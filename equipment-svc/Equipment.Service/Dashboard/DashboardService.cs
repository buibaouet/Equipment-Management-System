using Equipment.Domain.Constant;
using Equipment.Domain.IRepositories;
using Equipment.Domain.Models;
using Equipment.Domain.Models.Dashboard;
using Equipment.Domain.Models.ReponseModel;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Equipment.Service.Dashboard;

public class DashboardService : IDashboardService
{
    private readonly IEquipmentRepository _equipmentRepository;
    private readonly IEquipmentCategoryRepository _equipmentCategoryRepository;
    private readonly IBorrowEquipmentRepository _borrowEquipmentRepository;
    private readonly IUserRepository _userRepository;
    private readonly IDepartmentRepository _departmentRepository;

    public DashboardService(
        IEquipmentRepository equipmentRepository,
        IEquipmentCategoryRepository equipmentCategoryRepository,
        IBorrowEquipmentRepository borrowEquipmentRepository,
        IUserRepository userRepository,
        IDepartmentRepository departmentRepository
    )
    {
        _equipmentRepository = equipmentRepository;
        _equipmentCategoryRepository = equipmentCategoryRepository;
        _borrowEquipmentRepository = borrowEquipmentRepository;
        _userRepository = userRepository;
        _departmentRepository = departmentRepository;
    }

    public async Task<Response<DashboardModel>> GetDashboardDataAsync()
    {
        try
        {
            var dashboard = new DashboardModel();

            dashboard.TotalEquipment = await _equipmentRepository.CountAsync();
            dashboard.TotalBorrow = await _equipmentRepository.CountAsync(x => x.Status == Enumerations.EquipmentStatus.Borrowed);

            var equipmentByCategory = await _equipmentRepository
                .GetListAsync()
                .GroupBy(e => e.CategoryId)
                .Select(g => new { CategoryId = g.Key, Count = g.Count() })
                .ToListAsync();

            var categoryIds = equipmentByCategory.Select(x => x.CategoryId).ToList();
            var categories = await _equipmentCategoryRepository
                .GetListAsync(c => categoryIds.Contains(c.Id))
                .ToListAsync();

            dashboard.EquipmentByCategory = equipmentByCategory
                .Select(x =>
                {
                    var category = categories.FirstOrDefault(c => c.Id == x.CategoryId);
                    return new EquipmentByCategoryModel
                    {
                        CategoryId = x.CategoryId,
                        CategoryName = category?.Name ?? "Không xác định",
                        Count = x.Count
                    };
                })
                .OrderByDescending(x => x.Count)
                .ToList();

            var equipmentByStatus = await _equipmentRepository
                .GetListAsync()
                .GroupBy(e => e.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            var statusNameMap = new Dictionary<Enumerations.EquipmentStatus, string>
            {
                { Enumerations.EquipmentStatus.Available, "Sẵn sàng" },
                { Enumerations.EquipmentStatus.Borrowed, "Đang sử dụng" },
                { Enumerations.EquipmentStatus.Maintenance, "Bảo trì" },
                { Enumerations.EquipmentStatus.Liquidation, "Thanh lý" },
                { Enumerations.EquipmentStatus.Broken, "Đã hỏng" }
            };

            dashboard.EquipmentByStatus = equipmentByStatus
                .Select(x => new EquipmentByStatusModel
                {
                    Status = (int)x.Status,
                    StatusName = statusNameMap.GetValueOrDefault(x.Status, "Không xác định"),
                    Count = x.Count
                })
                .OrderByDescending(x => x.Count)
                .ToList();

            return new Response<DashboardModel>(dashboard);
        }
        catch (Exception ex)
        {
            return new Response<DashboardModel>(
                StatusCodes.Status500InternalServerError,
                $"Lỗi khi lấy dữ liệu dashboard: {ex.Message}"
            );
        }
    }

    public async Task<Response<List<BorrowReturnChartModel>>> GetDashboardBorrowAsync(
        Enumerations.ChartPeriodType periodType)
    {
        try
        {
            var borrowReturnChart = await GetBorrowReturnChartAsync(periodType);

            return new Response<List<BorrowReturnChartModel>>(borrowReturnChart);
        }
        catch (Exception ex)
        {
            return new Response<List<BorrowReturnChartModel>>(
                StatusCodes.Status500InternalServerError,
                $"Lỗi khi lấy dữ liệu dashboard: {ex.Message}"
            );
        }
    }

    private async Task<List<BorrowReturnChartModel>> GetBorrowReturnChartAsync(
        Enumerations.ChartPeriodType periodType
    )
    {
        var now = DateTime.Now;
        DateTime startDate;
        List<BorrowReturnChartModel> chartData = new();

        switch (periodType)
        {
            case Enumerations.ChartPeriodType.Week:
                // Last 8 weeks
                // Calculate the start of current week (Monday)
                var daysFromMonday = ((int)now.DayOfWeek - (int)DayOfWeek.Monday + 7) % 7;
                var currentWeekStart = now.Date.AddDays(7-daysFromMonday);
                startDate = currentWeekStart.AddDays(-7 * 7); // Go back 7 weeks from current week
                
                var weeks = Enumerable
                    .Range(0, 8)
                    .Select(i => startDate.AddDays(7 * i))
                    .ToList();

                foreach (var weekStart in weeks)
                {
                    var weekEnd = weekStart.AddDays(6);
                    var weekLabel = $"{weekStart.Date.ToString("dd/MM/yyyy")}-{weekEnd.Date.ToString("dd/MM/yyyy")}";

                    var borrowCount = await _borrowEquipmentRepository
                        .GetListAsync(b =>
                            b.CreatedDate.HasValue
                            && b.CreatedDate.Value.Date >= weekStart.Date
                            && b.CreatedDate.Value.Date <= weekEnd.Date
                        )
                        .CountAsync();

                    chartData.Add(
                        new BorrowReturnChartModel
                        {
                            Period = weekLabel,
                            BorrowCount = borrowCount,
                        }
                    );
                }
                break;

            case Enumerations.ChartPeriodType.Month:
                // Last 12 months
                startDate = new DateTime(now.Year, now.Month, 1).AddMonths(-11);
                var months = Enumerable
                    .Range(0, 12)
                    .Select(i => startDate.AddMonths(i))
                    .ToList();

                foreach (var monthStart in months)
                {
                    var monthEnd = monthStart.AddMonths(1).AddDays(-1);
                    var monthLabel = $"Tháng {monthStart.Month}/{monthStart.Year}";

                    var borrowCount = await _borrowEquipmentRepository
                        .GetListAsync(b =>
                            b.CreatedDate.HasValue
                            && b.CreatedDate.Value.Date >= monthStart.Date
                            && b.CreatedDate.Value.Date <= monthEnd.Date
                        )
                        .CountAsync();

                    chartData.Add(
                        new BorrowReturnChartModel
                        {
                            Period = monthLabel,
                            BorrowCount = borrowCount,
                        }
                    );
                }
                break;

            case Enumerations.ChartPeriodType.Quarter:
                // Last 8 quarters
                startDate = GetQuarterStartDate(now.AddMonths(-3 * 7));
                var quarters = Enumerable
                    .Range(0, 8)
                    .Select(i => GetQuarterStartDate(startDate.AddMonths(i * 3)))
                    .ToList();

                foreach (var quarterStart in quarters)
                {
                    var quarterEnd = quarterStart.AddMonths(3).AddDays(-1);
                    var quarterLabel = $"Quý {GetQuarter(quarterStart)}/{quarterStart.Year}";

                    var borrowCount = await _borrowEquipmentRepository
                        .GetListAsync(b =>
                            b.CreatedDate.HasValue
                            && b.CreatedDate.Value.Date >= quarterStart.Date
                            && b.CreatedDate.Value.Date <= quarterEnd.Date
                        )
                        .CountAsync();

                    chartData.Add(
                        new BorrowReturnChartModel
                        {
                            Period = quarterLabel,
                            BorrowCount = borrowCount,
                        }
                    );
                }
                break;
        }

        return chartData;
    }

    private static DateTime GetQuarterStartDate(DateTime date)
    {
        var quarter = GetQuarter(date);
        return new DateTime(date.Year, (quarter - 1) * 3 + 1, 1);
    }

    private static int GetQuarter(DateTime date)
    {
        return (date.Month - 1) / 3 + 1;
    }

    public async Task<Response<PagingDataModel<UserRankingTopModel>>> GetTableRankingTop(PaginationParam param)
    {
        var ranking = new List<UserRankingTopModel>();

        // Get all users
        var users = await _userRepository.GetListAsync().ToListAsync();

        // Get all departments for lookup
        var departments = await _departmentRepository.GetListAsync().ToListAsync();
        var departmentDict = departments.ToDictionary(d => d.Id, d => d.Name);

        foreach (var user in users)
        {
            // Count owned equipment
            var ownedCount = await _equipmentRepository
                .GetListAsync(e => e.OwnerId == user.Id)
                .CountAsync();

            // Count currently borrowed equipment
            var borrowedCount = await _borrowEquipmentRepository
                .GetListAsync(b =>
                    b.RequestedByUserId == user.Id
                    && b.Status == Enumerations.BorrowEquipmentStatus.Borrowed
                )
                .CountAsync();

            var totalCount = ownedCount + borrowedCount;

            // Only include users who have at least one device (owned or borrowed)
            if (totalCount > 0)
            {
                var departmentName = user.DepartmentId.HasValue
                    && departmentDict.ContainsKey(user.DepartmentId.Value)
                        ? departmentDict[user.DepartmentId.Value]
                        : "Không xác định";

                ranking.Add(
                    new UserRankingTopModel
                    {
                        UserId = user.Id,
                        UserName = user.UserName + " - "+ user.FullName,
                        Department = departmentName,
                        OwnedCount = ownedCount,
                        BorrowedCount = borrowedCount,
                        TotalCount = totalCount
                    }
                );
            }
        }

        // Handle pagination
        var totalRecords = ranking.Count;
        var totalPages = (int)Math.Ceiling((double)totalRecords / param.PageSize);
        var pagedData = ranking
            .OrderByDescending(r => r.TotalCount)
            .Skip((param.PageIndex - 1) * param.PageSize)
            .Take(param.PageSize)
            .ToList();
        var pagingResult = new PagingDataModel<UserRankingTopModel>
        {
            Data = pagedData,
            TotalRecords = totalRecords,
            TotalPages = totalPages
        };
        return new Response<PagingDataModel<UserRankingTopModel>>(pagingResult);
    }

    public async Task<Response<PagingDataModel<LoanRequestReportModel>>> GetLoanRequestReportAsync(
        PaginationParam param,
        Enumerations.ChartPeriodType periodType
    )
    {
        try
        {
            var now = DateTime.Now.Date;
            DateTime startDate;
            DateTime endDate;

            switch (periodType)
            {
                case Enumerations.ChartPeriodType.Week:
                    // Current week (Monday-Sunday)
                    var daysFromMonday =
                        ((int)now.DayOfWeek - (int)DayOfWeek.Monday + 7) % 7;
                    startDate = now.AddDays(-daysFromMonday);
                    endDate = startDate.AddDays(6);
                    break;
                case Enumerations.ChartPeriodType.Month:
                    startDate = new DateTime(now.Year, now.Month, 1);
                    endDate = startDate.AddMonths(1).AddDays(-1);
                    break;
                case Enumerations.ChartPeriodType.Quarter:
                default:
                    var quarter = (now.Month - 1) / 3 + 1;
                    startDate = new DateTime(now.Year, (quarter - 1) * 3 + 1, 1);
                    endDate = startDate.AddMonths(3).AddDays(-1);
                    break;
            }

            // Lấy các phiếu mượn trong khoảng thời gian theo ngày duyệt hoặc ngày mượn
            var borrowQuery = _borrowEquipmentRepository.GetListAsync(b =>
                (b.Status == Enumerations.BorrowEquipmentStatus.Borrowed
                    || b.Status == Enumerations.BorrowEquipmentStatus.Returned)
                && (
                    (b.ApprovedDate.HasValue
                        && b.ApprovedDate.Value.Date >= startDate
                        && b.ApprovedDate.Value.Date <= endDate)
                    || (b.FromDate.Date >= startDate && b.FromDate.Date <= endDate)
                )
            );

            var borrowList = await borrowQuery.ToListAsync();

            if (!borrowList.Any())
            {
                return new Response<PagingDataModel<LoanRequestReportModel>>(
                    new PagingDataModel<LoanRequestReportModel>()
                );
            }

            // Thu thập các Id để tránh N+1
            var equipmentIds = borrowList.Select(b => b.EquipmentId).Distinct().ToList();
            var userIds = borrowList
                .SelectMany(b => new[] { b.RequestedByUserId, b.ApprovedByUserId ?? 0 })
                .Where(id => id > 0)
                .Distinct()
                .ToList();

            var equipments = await _equipmentRepository
                .GetListAsync(e => equipmentIds.Contains(e.Id))
                .ToListAsync();
            var equipmentDict = equipments.ToDictionary(e => e.Id, e => e);

            var categoryIds = equipments.Select(e => e.CategoryId).Distinct().ToList();
            var categories = await _equipmentCategoryRepository
                .GetListAsync(c => categoryIds.Contains(c.Id))
                .ToListAsync();
            var categoryDict = categories.ToDictionary(c => c.Id, c => c.Name);

            var ownerIds = equipments
                .Where(e => e.OwnerId.HasValue)
                .Select(e => e.OwnerId!.Value)
                .Distinct()
                .ToList();

            userIds.AddRange(ownerIds);
            userIds = userIds.Distinct().ToList();

            var users = await _userRepository
                .GetListAsync(u => userIds.Contains(u.Id))
                .ToListAsync();
            var userDict = users.ToDictionary(u => u.Id, u => u);

            var departmentIds = users
                .Where(u => u.DepartmentId.HasValue)
                .Select(u => u.DepartmentId!.Value)
                .Distinct()
                .ToList();
            var departments = await _departmentRepository
                .GetListAsync(d => departmentIds.Contains(d.Id))
                .ToListAsync();
            var departmentDict = departments.ToDictionary(d => d.Id, d => d.Name);

            var items = new List<LoanRequestReportModel>();

            foreach (var b in borrowList)
            {
                if (!equipmentDict.TryGetValue(b.EquipmentId, out var equipment))
                {
                    continue;
                }

                categoryDict.TryGetValue(equipment.CategoryId, out var categoryName);

                string departmentName = string.Empty;
                if (equipment.OwnerId.HasValue
                    && userDict.TryGetValue(equipment.OwnerId.Value, out var ownerUser)
                    && ownerUser.DepartmentId.HasValue
                    && departmentDict.TryGetValue(
                        ownerUser.DepartmentId.Value,
                        out var deptName
                    ))
                {
                    departmentName = deptName;
                }

                var ownerName =
                    equipment.OwnerId.HasValue
                    && userDict.TryGetValue(equipment.OwnerId.Value, out var owner)
                        ? owner.FullName
                        : string.Empty;

                var borrowerName = userDict.TryGetValue(
                    b.RequestedByUserId,
                    out var borrower
                )
                    ? borrower.FullName
                    : string.Empty;

                items.Add(
                    new LoanRequestReportModel
                    {
                        Id = b.Id,
                        EquipmentCode = equipment.Code,
                        EquipmentName = equipment.Name,
                        CategoryName = categoryName ?? "Không xác định",
                        DepartmentName = departmentName,
                        OwnerName = ownerName,
                        BorrowerName = borrowerName,
                        ApprovedDate = b.ApprovedDate,
                        FromDate = b.FromDate,
                        ToDate = b.ToDate,
                        ReturnedDate = b.ReturnedDate,
                        Status = b.Status,
                    }
                );
            }

            // Sắp xếp theo ngày duyệt mới nhất
            var ordered = items
                .OrderByDescending(i => i.ApprovedDate ?? i.FromDate)
                .ToList();

            var totalRecords = ordered.Count;
            var totalPages = (int)Math.Ceiling((double)totalRecords / param.PageSize);
            var pagedData = ordered
                .Skip((param.PageIndex - 1) * param.PageSize)
                .Take(param.PageSize)
                .ToList();

            var pagingResult = new PagingDataModel<LoanRequestReportModel>
            {
                Data = pagedData,
                TotalRecords = totalRecords,
                TotalPages = totalPages,
            };

            return new Response<PagingDataModel<LoanRequestReportModel>>(pagingResult);
        }
        catch (Exception ex)
        {
            return new Response<PagingDataModel<LoanRequestReportModel>>(
                StatusCodes.Status500InternalServerError,
                $"Lỗi khi lấy báo cáo phiếu mượn: {ex.Message}"
            );
        }
    }
}


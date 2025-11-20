using Equipment.Domain.Constant;
using Equipment.Domain.Models.Dashboard;
using Equipment.Domain.Models.ReponseModel;

namespace Equipment.Service.Dashboard;

public interface IDashboardService
{
    Task<Response<DashboardModel>> GetDashboardDataAsync();
    Task<Response<List<BorrowReturnChartModel>>> GetDashboardBorrowAsync(Enumerations.ChartPeriodType periodType);
}


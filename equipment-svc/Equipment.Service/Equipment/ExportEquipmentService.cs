using System.Globalization;
using Equipment.Domain.Constant;
using Equipment.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using NPOI.HSSF.Util;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace Equipment.Service.Equipment;

public class ExportEquipmentService : IExportEquipmentService
{
    private readonly IEquipmentRepository _equipmentRepository;
    private readonly IEquipmentCategoryRepository _equipmentCategoryRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUserRepository _userRepository;

    public ExportEquipmentService(
        IEquipmentRepository equipmentRepository,
        IEquipmentCategoryRepository equipmentCategoryRepository,
        IDepartmentRepository departmentRepository,
        IUserRepository userRepository
    )
    {
        _equipmentRepository = equipmentRepository;
        _equipmentCategoryRepository = equipmentCategoryRepository;
        _departmentRepository = departmentRepository;
        _userRepository = userRepository;
    }

    public async Task<byte[]> ExportEquipment()
    {
        var workbook = new XSSFWorkbook();
        int row = 1;
        Dictionary<int, string> statusName = new()
        {
            { (int)Enumerations.EquipmentStatus.Available, "Còn sử dụng" },
            { (int)Enumerations.EquipmentStatus.Borrowed, "Đang mượn" },
            { (int)Enumerations.EquipmentStatus.Maintenance, "Đang bảo dưỡng" },
            { (int)Enumerations.EquipmentStatus.Lost, "Đã mất" },
            { (int)Enumerations.EquipmentStatus.BrokenPart, "Hỏng một phần" },
            { (int)Enumerations.EquipmentStatus.Broken, "Đã hỏng" },
        };
        
        var sheet = workbook.CreateSheet("Danh sách thiết bị");
        
        var iRow = sheet.CreateRow(0);
        
        CreateHeader(workbook, iRow, 0, "Mã thiết bị");
        CreateHeader(workbook, iRow, 1, "Tên thiết bị");
        CreateHeader(workbook, iRow, 2, "Loại thiết bị");
        CreateHeader(workbook, iRow, 3, "Phòng ban");
        CreateHeader(workbook, iRow, 4, "Người phụ trách");
        CreateHeader(workbook, iRow, 5, "Giá trị");
        CreateHeader(workbook, iRow, 6, "Ngày nhập");
        CreateHeader(workbook, iRow, 7, "Xuất xứ");
        CreateHeader(workbook, iRow, 8, "Hãng sản xuất");
        CreateHeader(workbook, iRow, 9, "Trạng thái");
        CreateHeader(workbook, iRow, 10, "Thông tin khác");
        sheet.CreateFreezePane(4, 1);
        
        var equipments = await _equipmentRepository.GetListAsync().ToListAsync();
        
        foreach (var item in equipments)
        {
            var category = await _equipmentCategoryRepository.GetByIdAsync(item.CategoryId);
            var department = await _departmentRepository.GetByIdAsync(item.DepartmentId);
            var owner = await _userRepository.GetByIdAsync(item.OwnerId ?? 0);
            
            iRow = sheet.CreateRow(row);

            CreateCellBinding(workbook, iRow, 0, item.Code);
            CreateCellBinding(workbook, iRow, 1, item.Name);
            CreateCellBinding(workbook, iRow, 2, category != null ? string.Concat(category.Code, " - ", category.Name) : "-");
            CreateCellBinding(workbook, iRow, 3, department != null ? string.Concat(department.Code, " - ", department.Name) : "-");
            CreateCellBinding(workbook, iRow, 4, owner != null ? string.Concat(owner.UserName, " - ", owner.FullName) : "-");
            CreateCellBinding(workbook, iRow, 5, item.Price.ToString("C", new CultureInfo("vi-VN")));
            CreateCellBinding(workbook, iRow, 6, item.ImportDate.HasValue ? item.ImportDate.Value.ToString("dd/MM/yyyy", CultureInfo.CurrentCulture) : "-");
            CreateCellBinding(workbook, iRow, 7, item.OriginOfGoods ?? "-");
            CreateCellBinding(workbook, iRow, 8, item.Manufacturer ?? "-");
            CreateCellBinding(workbook, iRow, 9, statusName[(int)item.Status]);
            CreateCellBinding(workbook, iRow, 10, item.Description ?? "-");

            row++;
        }
        
        for (int i = 0; i < 11; i++)
        {
            sheet.AutoSizeColumn(i);
        }
        
        var stream = new MemoryStream();
        workbook.Write(stream);
        var content = stream.ToArray();

        return content;
    }
    
    
    private void CreateCellBinding(XSSFWorkbook workbook, IRow irow, int cellIdx, string? cellValue)
    {
        //header
        var font = workbook.CreateFont();
        var style = SetBorderCell(workbook);
        style.SetFont(font);
        style.WrapText = true;

        var cellDefault = irow.CreateCell(cellIdx);
        cellDefault.SetCellValue(cellValue);
        cellDefault.CellStyle = style;
    }

    private void CreateHeader(XSSFWorkbook workbook, IRow irow, int cellIdx, string cellValue)
    {
        //header
        var font = workbook.CreateFont();
        font.IsBold = true;
        var style = SetBorderCell(workbook);
        style.SetFont(font);
        style.WrapText = true;
        style.VerticalAlignment = VerticalAlignment.Center;
        style.Alignment = HorizontalAlignment.Center;
        style.FillForegroundColor = HSSFColor.Grey25Percent.Index;
        style.FillPattern = FillPattern.SolidForeground;

        var cellDefault = irow.CreateCell(cellIdx);
        cellDefault.SetCellValue(cellValue);
        cellDefault.CellStyle = style;
    }

    /// <summary>
    /// Set border cho cell
    /// </summary>
    /// <param name="workbook"></param>
    /// <returns></returns>
    private ICellStyle SetBorderCell(XSSFWorkbook workbook)
    {
        ICellStyle cellStyle = workbook.CreateCellStyle();

        cellStyle.BorderBottom = BorderStyle.Thin;
        cellStyle.BorderTop = BorderStyle.Thin;
        cellStyle.BorderLeft = BorderStyle.Thin;
        cellStyle.BorderRight = BorderStyle.Thin;

        return cellStyle;
    }
}

using Equipment.Domain.Entities;

namespace Equipment.Domain.Models.Category;

public class CategoryPagingModel : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public bool IsActive { get; set; } = true;
}

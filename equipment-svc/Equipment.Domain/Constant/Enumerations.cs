namespace Equipment.Domain.Constant;

public class Enumerations
{
    public enum Role : int
    {
        Admin = 1,
        Manager = 2,
        User = 3,
    }
    
    public enum EquipmentStatus
    {
        Available = 1,

        InUse = 2,

        UnderMaintenance = 3,

        Broken = 4,

        Disposed = 5
    }
}

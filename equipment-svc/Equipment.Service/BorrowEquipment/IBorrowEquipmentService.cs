using Equipment.Domain.Entities;
using Equipment.Domain.Models;
using Equipment.Domain.Models.BorrowEquipmentModel;
using Equipment.Domain.Models.ReponseModel;

namespace Equipment.Service.BorrowEquipment;

public interface IBorrowEquipmentService
{
    Task<Response<PagingDataModel<BorrowEquipmentPagingModel>>> GetPaging(
        PaginationParam param,
        int currentUserId
    );
    Task<Response<PagingDataModel<BorrowEquipmentRequestPagingModel>>> GetRequestPaging(
        PaginationParam param,
        int currentUserId
    );
    Task<Response<BorrowEquipmentResponseModel>> CreateOrUpdateBorrowRequest(
        Domain.Entities.BorrowEquipment borrowEquipment,
        int currentUserId
    );
    Task<Response<bool>> ReturnEquipment(ReturnEquipmentModel param);
    Task<Response<bool>> ApproveBorrowRequest(int id, int currentUserId);
    Task<Response<bool>> RejectBorrowRequest(int id, int currentUserId, string? rejectionReason);
}

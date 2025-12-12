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
    Task<Response<BorrowEquipmentDataModel>> GetById(
        int id,
        int currentUserId
    );
    Task<Response<BorrowEquipmentResponseModel>> CreateOrUpdateBorrowRequest(
        Domain.Entities.BorrowEquipment borrowEquipment,
        int currentUserId
    );
    Task<Response<bool>> ReturnEquipment(ReturnEquipmentModel param, int currentUserId);
    Task<Response<bool>> ApproveBorrowRequest(int id, int currentUserId);
    Task<Response<bool>> RejectBorrowRequest(int id, int currentUserId);
    Task<Response<List<BorrowEquipmentDataModel>>> GetOverdueBorrowEquipments(int currentUserId);
    Task<Response<int>> GetOverdueBorrowEquipmentsTotal(int currentUserId);
    Task<Response<int>> GetTotalRequestBorrowEquipment(int currentUserId);
}

using System.Linq.Expressions;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using Equipment.Domain.Constant;
using Equipment.Domain.IRepositories;
using Equipment.Domain.Models;
using Equipment.Domain.Models.EquipmentHistoryModel;
using Equipment.Domain.Models.ReponseModel;
using Microsoft.EntityFrameworkCore;
using EquipmentHistoryEntity = Equipment.Domain.Entities.EquipmentHistory;

namespace Equipment.Service.EquipmentHistory;

public class EquipmentHistoryService : IEquipmentHistoryService
{
    private readonly IEquipmentHistoryRepository _equipmentHistoryRepository;
    private readonly JsonSerializerOptions _serializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        WriteIndented = false
    };

    public EquipmentHistoryService(IEquipmentHistoryRepository equipmentHistoryRepository)
    {
        _equipmentHistoryRepository = equipmentHistoryRepository;
    }

    public async Task LogAsync(
        int equipmentId,
        Enumerations.EquipmentHistoryAction action,
        string description,
        int? actorUserId,
        string? actorUserName,
        List<EquipmentHistoryChangeModel>? changes = null
    )
    {
        var history = new EquipmentHistoryEntity
        {
            EquipmentId = equipmentId,
            Action = action,
            Description = description,
            ActorUserId = actorUserId,
            ActorUserName = actorUserName,
            ChangesJson = changes != null && changes.Any()
                ? JsonSerializer.Serialize(changes, _serializerOptions)
                : null,
        };

        await _equipmentHistoryRepository.CreateAsync(history);
    }

    public async Task<Response<List<EquipmentHistoryModel>>> GetHistoryAsync(
        int equipmentId
    )
    {
        var pagingData = await _equipmentHistoryRepository.GetListAsync(history => history.EquipmentId == equipmentId).ToListAsync();

        var result = new List<EquipmentHistoryModel>();

        foreach (var item in pagingData)
        {
            result.Add(
                new EquipmentHistoryModel
                {
                    Id = item.Id,
                    EquipmentId = item.EquipmentId,
                    Action = item.Action,
                    ActionName = GetActionDisplayName(item.Action),
                    Description = item.Description ?? string.Empty,
                    ActorUserId = item.ActorUserId,
                    ActorUserName = item.ActorUserName,
                    CreatedDate = item.CreatedDate,
                    Changes = DeserializeChanges(item.ChangesJson),
                }
            );
        }

        return new Response<List<EquipmentHistoryModel>>(result);
    }

    private List<EquipmentHistoryChangeModel> DeserializeChanges(string? changesJson)
    {
        if (string.IsNullOrWhiteSpace(changesJson))
        {
            return new List<EquipmentHistoryChangeModel>();
        }

        try
        {
            var changes = JsonSerializer.Deserialize<List<EquipmentHistoryChangeModel>>(
                changesJson,
                _serializerOptions
            );

            return changes ?? new List<EquipmentHistoryChangeModel>();
        }
        catch
        {
            return new List<EquipmentHistoryChangeModel>();
        }
    }

    private static string GetActionDisplayName(Enumerations.EquipmentHistoryAction action)
    {
        return action switch
        {
            Enumerations.EquipmentHistoryAction.Created => "Tạo mới",
            Enumerations.EquipmentHistoryAction.Updated => "Cập nhật",
            Enumerations.EquipmentHistoryAction.BorrowRequested => "Yêu cầu mượn",
            Enumerations.EquipmentHistoryAction.BorrowApproved => "Phê duyệt mượn",
            Enumerations.EquipmentHistoryAction.BorrowRejected => "Từ chối mượn",
            Enumerations.EquipmentHistoryAction.Returned => "Trả thiết bị",
            _ => action.ToString(),
        };
    }
}


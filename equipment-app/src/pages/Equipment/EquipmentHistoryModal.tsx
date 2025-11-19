import { useEffect, useState } from "react";
import { Modal } from "../../components/ui/modal";
import { useGetEquipmentHistoryByIdQuery } from "../../api/useEquipmentApi";
import { EquipmentHistoryModel } from "../../types/Equipment";
import { Clock, User, ChevronDown, ChevronUp } from "lucide-react";

interface EquipmentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentId: number | null;
}

const EquipmentHistoryModal: React.FC<EquipmentHistoryModalProps> = ({
  isOpen,
  onClose,
  equipmentId,
}) => {
  const {
    data: historyData,
    isLoading,
    error,
  } = useGetEquipmentHistoryByIdQuery(
    { id: equipmentId ?? 0 },
    { skip: !equipmentId || !isOpen }
  );

  const [history, setHistory] = useState<EquipmentHistoryModel[]>([]);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isOpen) {
      setHistory([]);
      setExpandedCards(new Set());
      return;
    }

    if (historyData?.statusCode === 200 && historyData.data) {
      setHistory(historyData.data);
    }
  }, [historyData, isOpen]);

  const toggleCard = (cardId: number) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const formatDateTime = (value?: Date | string | null) => {
    if (!value) return "-";
    const date =
      typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : value;
    if (Number.isNaN(date.getTime())) {
      return "-";
    }
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatFieldName = (field: string) => {
    const fieldMap: Record<string, string> = {
      code: "Mã thiết bị",
      name: "Tên thiết bị",
      price: "Giá trị",
      originOfGoods: "Xuất xứ",
      manufacturer: "Nhà sản xuất",
      description: "Mô tả",
      departmentId: "Phòng ban",
      categoryId: "Loại thiết bị",
      ownerId: "Người sử dụng",
      status: "Trạng thái",
      importDate: "Ngày nhập",
    };
    return fieldMap[field] || field;
  };

  const formatValue = (value: string | null | undefined) => {
    if (!value || value === "null" || value === "undefined") return "-";
    return value;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl mx-4 sm:mx-auto"
      closeOnOutsideClick={!isLoading}
    >
      <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">
          Lịch sử thiết bị
        </h2>

        {isLoading && (
          <div className="flex justify-center py-8">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Đang tải dữ liệu...
            </span>
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-lg bg-error-50 px-4 py-3 text-sm text-error-600 dark:bg-error-500/10 dark:text-error-300">
            Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
          </div>
        )}

        {!isLoading && !error && history.length === 0 && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
            Không có lịch sử để hiển thị.
          </div>
        )}

        {!isLoading && !error && history.length > 0 && (
          <div className="space-y-6">
            {history.map((item) => {
              const isExpanded = expandedCards.has(item.id);
              const hasChanges = item.changes && item.changes.length > 0;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-100 p-4 dark:border-white/5"
                >
                  {/* Header with action and metadata */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-2">
                          {item.description || item.actionName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          {item.actorUserName && (
                            <div className="flex items-center gap-1.5">
                              <User className="w-4 h-4" />
                              <span>{item.actorUserName}</span>
                            </div>
                          )}
                          {item.createdDate && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>{formatDateTime(item.createdDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {hasChanges && (
                        <button
                          onClick={() => toggleCard(item.id)}
                          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Changes list */}
                  {isExpanded && hasChanges && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Chi tiết thay đổi:
                      </h4>
                      <div className="space-y-3">
                        {item.changes.map((change, changeIndex) => {
                          const hasOldValue =
                            change.oldValue &&
                            change.oldValue !== "null" &&
                            change.oldValue !== "undefined" &&
                            change.oldValue !== "";
                          const hasNewValue =
                            change.newValue &&
                            change.newValue !== "null" &&
                            change.newValue !== "undefined" &&
                            change.newValue !== "";

                          return (
                            <div
                              key={changeIndex}
                              className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/40"
                            >
                              <div className="text-sm">
                                {hasOldValue && hasNewValue ? (
                                  // Both old and new values exist - show update
                                  <>
                                    <span className="font-medium text-gray-800 dark:text-white/90">
                                      {formatFieldName(change.field)}:
                                    </span>
                                    <div className="mt-1.5 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                                      <div className="flex-1">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          Giá trị cũ:
                                        </span>
                                        <span className="ml-2 text-gray-700 dark:text-gray-300 line-through">
                                          {formatValue(change.oldValue)}
                                        </span>
                                      </div>
                                      <div className="hidden sm:block text-gray-400 dark:text-gray-500">
                                        →
                                      </div>
                                      <div className="flex-1">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          Giá trị mới:
                                        </span>
                                        <span className="ml-2 text-gray-900 dark:text-white font-medium">
                                          {formatValue(change.newValue)}
                                        </span>
                                      </div>
                                    </div>
                                  </>
                                ) : hasNewValue ? (
                                  // Only new value exists - show field and value side by side
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-800 dark:text-white/90">
                                      {formatFieldName(change.field)}:
                                    </span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                      {formatValue(change.newValue)}
                                    </span>
                                  </div>
                                ) : hasOldValue ? (
                                  // Only old value exists - show field and value side by side
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-800 dark:text-white/90">
                                      {formatFieldName(change.field)}:
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300 line-through">
                                      {formatValue(change.oldValue)}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-800 dark:text-white/90">
                                      {formatFieldName(change.field)}:
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {(!item.changes || item.changes.length === 0) && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                      Không có thay đổi chi tiết
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EquipmentHistoryModal;


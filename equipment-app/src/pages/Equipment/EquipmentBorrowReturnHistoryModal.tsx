import { useEffect, useMemo, useState } from "react";
import { Modal } from "../../components/ui/modal";
import { useGetEquipmentHistoryByIdQuery } from "../../api/useEquipmentApi";
import { EquipmentHistoryModel } from "../../types/Equipment";
import { EquipmentHistoryAction } from "../../utils/enumerations";

interface EquipmentBorrowReturnHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentId: number | null;
}

const borrowActions = new Set<EquipmentHistoryAction>([
  EquipmentHistoryAction.BorrowApproved,
]);

const returnActions = new Set<EquipmentHistoryAction>([
  EquipmentHistoryAction.Returned,
]);

const EquipmentBorrowReturnHistoryModal: React.FC<
  EquipmentBorrowReturnHistoryModalProps
> = ({ isOpen, onClose, equipmentId }) => {
  const {
    data: historyData,
    isLoading,
    error,
  } = useGetEquipmentHistoryByIdQuery(
    { id: equipmentId ?? 0 },
    { skip: !equipmentId || !isOpen }
  );

  const [history, setHistory] = useState<EquipmentHistoryModel[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setHistory([]);
      return;
    }

    if (historyData?.statusCode === 200 && historyData.data) {
      setHistory(historyData.data);
    }
  }, [historyData, isOpen]);

  const { borrowHistory, returnHistory } = useMemo(() => {
    const borrowHistory = history.filter((item) =>
      borrowActions.has(item.action)
    );
    const returnHistory = history.filter((item) =>
      returnActions.has(item.action)
    );

    return { borrowHistory, returnHistory };
  }, [history]);

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

  const renderHistoryCard = (item: EquipmentHistoryModel) => (
    <div
      key={item.id}
      className="rounded-xl border border-gray-100 p-4 dark:border-white/5"
    >
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {formatDateTime(item.createdDate)}
      </div>
      <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
        {`${item.changes[0].newValue} đã ${item.action === EquipmentHistoryAction.BorrowApproved ? "mượn" : "trả"} thiết bị`}
      </h3>
      {item.changes && item.changes.length > 0 && (
        <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
          {item.changes.map((change, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <span className="font-medium text-gray-800 dark:text-white/90">
                {change.field}
              </span>
              {change.newValue && (
                <span className="text-gray-700 dark:text-gray-200">
                  {change.newValue}
                </span>
              )}
              {change.oldValue && !change.newValue && (
                <span className="text-gray-500 line-through dark:text-gray-400">
                  {change.oldValue}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const hasBorrowOrReturnHistory =
    borrowHistory.length > 0 || returnHistory.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-5xl mx-4 sm:mx-auto"
      closeOnOutsideClick={!isLoading}
    >
      <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Lịch sử mượn / trả thiết bị
          </h2>
        </div>

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

        {!isLoading && !error && !hasBorrowOrReturnHistory && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
            Không có lịch sử mượn/trả để hiển thị.
          </div>
        )}

        {!isLoading && !error && hasBorrowOrReturnHistory && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                Mượn thiết bị
              </h3>
              {borrowHistory.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  Không có lịch sử mượn
                </div>
              ) : (
                <div className="space-y-4">
                  {borrowHistory.map(renderHistoryCard)}
                </div>
              )}
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                Trả thiết bị
              </h3>
              {returnHistory.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  Không có lịch sử trả
                </div>
              ) : (
                <div className="space-y-4">
                  {returnHistory.map(renderHistoryCard)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EquipmentBorrowReturnHistoryModal;



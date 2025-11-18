import { ReactNode, useEffect, useMemo, useState } from "react";
import { Modal } from "../../components/ui/modal";
import Badge from "../../components/ui/badge/Badge";
import {
  BorrowEquipmentStatusEnum,
  EquipmentStatusEnum,
  ProcessingFormEnum,
} from "../../utils/enumerations";
import { useGetBorrowEquipmentByIdMutation } from "../../api/useBorrowEquipmentApi";
import { BorrowEquipmentDataModel } from "../../types/BorrowEquipment";

interface BorrowReturnInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId?: number | null;
}

const statusLabelMap: Record<BorrowEquipmentStatusEnum, string> = {
  [BorrowEquipmentStatusEnum.Pending]: "Chờ duyệt",
  [BorrowEquipmentStatusEnum.Borrowed]: "Đang mượn",
  [BorrowEquipmentStatusEnum.Rejected]: "Đã từ chối",
  [BorrowEquipmentStatusEnum.Returned]: "Đã trả",
};

type StatusBadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

const statusColorMap: Record<BorrowEquipmentStatusEnum, StatusBadgeColor> = {
  [BorrowEquipmentStatusEnum.Pending]: "primary",
  [BorrowEquipmentStatusEnum.Borrowed]: "info",
  [BorrowEquipmentStatusEnum.Rejected]: "dark",
  [BorrowEquipmentStatusEnum.Returned]: "warning",
};

const equipmentStatusLabelMap: Record<EquipmentStatusEnum, string> = {
  [EquipmentStatusEnum.Available]: "Còn sử dụng",
  [EquipmentStatusEnum.Borrowed]: "Đang mượn",
  [EquipmentStatusEnum.Maintenance]: "Bảo dưỡng",
  [EquipmentStatusEnum.Lost]: "Đã mất",
  [EquipmentStatusEnum.BrokenPart]: "Hỏng một phần",
  [EquipmentStatusEnum.Broken]: "Đã hỏng",
};

const processingFormLabelMap: Record<ProcessingFormEnum, string> = {
  [ProcessingFormEnum.Repair]: "Sửa chữa",
  [ProcessingFormEnum.BuyNew]: "Mua mới",
  [ProcessingFormEnum.Compensation]: "Bồi thường",
};

const BorrowReturnInfoModal: React.FC<BorrowReturnInfoModalProps> = ({
  isOpen,
  onClose,
  recordId,
}) => {
  const [fetchDetail, { isLoading }] = useGetBorrowEquipmentByIdMutation();
  const [detail, setDetail] = useState<BorrowEquipmentDataModel | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isOpen) {
      setDetail(null);
      setError("");
      return;
    }

    if (!recordId) {
      setDetail(null);
      setError("Không tìm thấy dữ liệu yêu cầu.");
      return;
    }

    let isMounted = true;
    setDetail(null);
    setError("");

    const fetchData = async () => {
      try {
        const response = await fetchDetail({ id: recordId }).unwrap();
        if (!isMounted) return;

        if (response.statusCode === 200 && response.data) {
          setDetail(response.data);
        } else {
          setError(response.message || "Không thể tải dữ liệu chi tiết.");
        }
      } catch {
        if (!isMounted) return;
        setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.");
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchDetail, isOpen, recordId]);

  const showReturnInfo = detail?.status === BorrowEquipmentStatusEnum.Returned;

  const borrowerSectionTitle = useMemo(() => {
    if (!detail) return "Thông tin mượn";
    return detail.status === BorrowEquipmentStatusEnum.Pending
      ? "Thông tin yêu cầu mượn"
      : "Thông tin mượn";
  }, [detail]);

  const formatDateTime = (value?: Date | string | null) => {
    if (!value) return "-";
    const date =
      typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : value;
    if (Number.isNaN(date.getTime())) {
      return "-";
    }
    return date.toLocaleDateString();
  };

  const returnTimingInfo = useMemo(() => {
    if (!detail?.returnedDate || !detail?.toDate) return null;
    const returnedDate = new Date(detail.returnedDate);
    const dueDate = new Date(detail.toDate);
    if (
      Number.isNaN(returnedDate.getTime()) ||
      Number.isNaN(dueDate.getTime())
    ) {
      return null;
    }
    const getDayTimestamp = (date: Date) => {
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      return normalized.getTime();
    };

    const diffMs = getDayTimestamp(returnedDate) - getDayTimestamp(dueDate);
    if (diffMs <= 0) {
      return {
        text: "Đúng hạn",
        color: "success" as StatusBadgeColor,
      };
    }
    const daysOverdue = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return {
      text: `Trễ ${daysOverdue} ngày`,
      color: "error" as StatusBadgeColor,
    };
  }, [detail?.returnedDate, detail?.toDate]);

  const InfoRow = ({ label, value }: { label: string; value?: ReactNode }) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {value ?? "-"}
      </span>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl mx-4 sm:mx-auto"
      closeOnOutsideClick={!isLoading}
    >
      <div className="p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">
          Thông tin chi tiết mượn trả
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
            {error}
          </div>
        )}

        {!isLoading && !error && !detail && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Không có dữ liệu để hiển thị.
          </div>
        )}

        {detail && (
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/5 dark:bg-gray-800/40">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mã thiết bị
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {detail.equipmentCode}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {detail.equipmentName}
                  </p>
                </div>

                <Badge
                  size="md"
                  color={statusColorMap[detail.status] || "primary"}
                >
                  {statusLabelMap[detail.status]}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 rounded-xl border border-gray-100 p-4 dark:border-white/5 md:grid-cols-2">
              <InfoRow label="Loại thiết bị" value={detail.categoryName} />
              <InfoRow label="Phòng ban" value={detail.departmentName} />
              <InfoRow label="Người duyệt" value={detail.approvedByName || "-"} />
              <InfoRow
                label="Ngày duyệt"
                value={formatDateTime(detail.approvedDate)}
              />
            </div>

            <div className="rounded-xl border border-gray-100 p-4 dark:border-white/5">
              <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                {borrowerSectionTitle}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <InfoRow label="Người mượn" value={detail.borrowerName} />
                <InfoRow
                  label="Ngày bắt đầu mượn"
                  value={formatDateTime(detail.fromDate)}
                />
                <InfoRow
                  label="Ngày phải trả"
                  value={formatDateTime(detail.toDate)}
                />
              </div>
            </div>

            {showReturnInfo && (
              <div className="rounded-xl border border-gray-100 p-4 dark:border-white/5">
                <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                  Thông tin trả thiết bị
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoRow
                    label="Ngày trả"
                    value={
                      <div className="flex items-center gap-2">
                        <span>{formatDateTime(detail.returnedDate)}</span>
                        {returnTimingInfo && (
                          <Badge size="sm" color={returnTimingInfo.color}>
                            {returnTimingInfo.text}
                          </Badge>
                        )}
                      </div>
                    }
                  />
                  <InfoRow
                    label="Trạng thái thiết bị sau trả"
                    value={
                      detail.statusAfterReturn
                        ? equipmentStatusLabelMap[detail.statusAfterReturn]
                        : "-"
                    }
                  />
                  <InfoRow
                    label="Hình thức xử lý"
                    value={
                      detail.processingForm
                        ? processingFormLabelMap[detail.processingForm]
                        : "-"
                    }
                  />
                </div>
                {detail.processingNote && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                    <p className="mb-1 font-semibold text-gray-800 dark:text-white/90">
                      Ghi chú xử lý
                    </p>
                    <p>{detail.processingNote}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BorrowReturnInfoModal;


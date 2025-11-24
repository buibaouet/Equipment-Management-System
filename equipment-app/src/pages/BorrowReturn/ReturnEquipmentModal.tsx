import { useState, useMemo, useCallback } from "react";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import TextArea from "../../components/form/input/TextArea";
import { EquipmentStatusEnum, ProcessingFormEnum } from "../../utils/enumerations";
import { BorrowEquipmentPaging, ReturnEquipmentPayload } from "../../types/BorrowEquipment";
import { toast } from "sonner";
import { useReturnEquipmentMutation } from "../../api/useBorrowEquipmentApi";

interface ReturnEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionCallback: () => void;
  equipment?: BorrowEquipmentPaging | null;
}

const ReturnEquipmentModal: React.FC<ReturnEquipmentModalProps> = ({
  isOpen,
  onClose,
  actionCallback,
  equipment,
}) => {
  const [returnEquipment] = useReturnEquipmentMutation();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [processingFormError, setProcessingFormError] = useState<string>("");
  const [processingForm, setProcessingForm] = useState<string>("");
  const [processingNote, setProcessingNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get status options for dropdown
  const statusOptions = useMemo(() => {
    return Object.values(EquipmentStatusEnum)
      .filter((v) => typeof v === "number" && v !== EquipmentStatusEnum.Borrowed && v !== EquipmentStatusEnum.Maintenance)
      .map((status: number) => ({
        value: String(status),
        label:
          status === EquipmentStatusEnum.Available
            ? "Sẵn sàng"
            : status === EquipmentStatusEnum.Liquidation
              ? "Thanh lý"
                : status === EquipmentStatusEnum.Broken
                  ? "Đã hỏng"
                  : "",
      }));
  }, []);

  const processingFormOptions = useMemo(
    () => [
      { value: String(ProcessingFormEnum.Repair), label: "Sửa chữa" },
      { value: String(ProcessingFormEnum.BuyNew), label: "Mua mới" },
      { value: String(ProcessingFormEnum.Compensation), label: "Bồi thường" },
    ],
    []
  );

  const requireProcessingInfo = useMemo(() => {
    const statusValue = Number(selectedStatus);
    return [
      EquipmentStatusEnum.Broken,
      EquipmentStatusEnum.Liquidation,
    ].includes(statusValue);
  }, [selectedStatus]);

  // Return handler - confirms and executes the return
  const handleConfirm = useCallback(
    async () => {
      if (!equipment?.id) return;

      if (!selectedStatus) {
        setError("Vui lòng chọn trạng thái thiết bị");
        return;
      }

      if (requireProcessingInfo && !processingForm) {
        setProcessingFormError("Vui lòng chọn hình thức xử lý");
        return;
      }

      setError("");
      setProcessingFormError("");

      try {
        setIsSubmitting(true);
        const payload = {
          id: equipment.id,
          status: Number(selectedStatus) as EquipmentStatusEnum,
          processingForm: requireProcessingInfo ? Number(processingForm) as ProcessingFormEnum : null,
          processingNote:
            requireProcessingInfo && processingNote.trim().length > 0
              ? processingNote.trim()
              : null,
        };

        const response = await returnEquipment(payload as ReturnEquipmentPayload).unwrap();
        if (response.statusCode === 200) {
          toast.success("Trả thiết bị thành công");
          // Close modal and refresh the equipment list after successful return
          onClose();
          actionCallback();
        }
        else if (response.statusCode !== 200) {
          toast.error(response.message || "Có lỗi xảy ra khi trả thiết bị");
        }
      } catch (error: unknown) {
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? String((error as { message?: string }).message)
            : undefined;
        toast.error(message || "Có lỗi xảy ra khi trả thiết bị");
      } finally {
        setIsSubmitting(false);
      }
    },
    [actionCallback, equipment, onClose, processingForm, processingNote, requireProcessingInfo, returnEquipment, selectedStatus]
  );


  const handleClose = () => {
    setSelectedStatus("");
    setError("");
    setProcessingFormError("");
    setProcessingForm("");
    setProcessingNote("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-md mx-4 sm:mx-auto"
      closeOnOutsideClick={!isSubmitting}
    >
      <div className="p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">
          Xác nhận trả thiết bị
        </h2>

        {equipment && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span className="font-medium">Mã thiết bị:</span> {equipment.equipmentCode}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Tên thiết bị:</span> {equipment.equipmentName}
            </p>
          </div>
        )}

        <div className="mb-6">
          <Label htmlFor="status">
            Trạng thái thiết bị sau khi trả <span className="text-error-500">*</span>
          </Label>
          <Select
            options={statusOptions}
            placeholder="Chọn trạng thái thiết bị"
            onChange={(value) => {
              setSelectedStatus(value);
              setError("");
              setProcessingForm("");
              setProcessingFormError("");
              setProcessingNote("");
            }}
            defaultValue={selectedStatus}
            error={!!error}
            hint={error}
            required
          />
        </div>

        {requireProcessingInfo && (
          <div className="mb-6 space-y-4">
            <div>
              <Label htmlFor="processing-form">
                Hình thức xử lý <span className="text-error-500">*</span>
              </Label>
              <Select
                options={processingFormOptions}
                placeholder="Chọn hình thức xử lý"
                onChange={(value) => {
                  setProcessingForm(value);
                  setProcessingFormError("");
                }}
                defaultValue={processingForm}
                error={!!processingFormError}
                hint={processingFormError}
                required
              />
            </div>

            <div>
              <Label htmlFor="processing-note">Ghi chú xử lý</Label>
              <TextArea
                placeholder="Nhập ghi chú (nếu có)"
                rows={4}
                value={processingNote}
                onChange={setProcessingNote}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isSubmitting || !selectedStatus}
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận trả"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReturnEquipmentModal;


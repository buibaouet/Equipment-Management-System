import { useState, useEffect, useMemo } from "react";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import Button from "../../components/ui/button/Button";
import { useGetEquipmentListQuery } from "../../api/useEquipmentApi";
import { BorrowEditMode } from "../../utils/enumerations";
import { toast } from "sonner";
import { BorrowEquipmentEntity } from "../../types/BorrowEquipment";
import {
  useBorrowEquipmentMutation,
} from "../../api/useBorrowEquipmentApi";

interface BorrowEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BorrowEquipmentEntity;
  mode?: BorrowEditMode;
  actionCallback: () => void;
}

const BorrowEquipmentModal: React.FC<BorrowEquipmentModalProps> = ({
  isOpen,
  onClose,
  initialData,
  mode = BorrowEditMode.Create,
  actionCallback,
}) => {
  const { data: equipmentData } = useGetEquipmentListQuery({});
  const [borrowEquipment] = useBorrowEquipmentMutation();
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [errors, setErrors] = useState<{
    equipmentId?: string;
    fromDate?: string;
    toDate?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter available equipment only (for create mode) or include the selected equipment (for edit/reborrow)
  const availableEquipments = useMemo(() => {
    if (!equipmentData?.data) return [];
    const equipments = equipmentData.data
      .map((eq) => ({
        value: String(eq.id),
        label: `${eq.code} - ${eq.name} - ${eq.departmentName}`,
      }));
    return equipments;
  }, [equipmentData, initialData]);

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setSelectedEquipmentId(initialData.equipmentId ? String(initialData.equipmentId) : "");
        // For edit mode, pre-fill dates; for reborrow mode, leave dates empty
        if (mode === BorrowEditMode.Edit) {
          setFromDate(new Date(initialData.fromDate));
          setToDate(new Date(initialData.toDate));
        } else {
          setFromDate(undefined);
          setToDate(undefined);
        }
      } else {
        setSelectedEquipmentId("");
        setFromDate(undefined);
        setToDate(undefined);
      }
      setErrors({});
    } else {
      // Reset when modal closes
      setSelectedEquipmentId("");
      setFromDate(undefined);
      setToDate(undefined);
      setErrors({});
    }
  }, [isOpen, initialData, mode]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!selectedEquipmentId) {
      newErrors.equipmentId = "Vui lòng chọn thiết bị";
    }

    if (!fromDate) {
      newErrors.fromDate = "Vui lòng chọn ngày bắt đầu";
    }

    if (!toDate) {
      newErrors.toDate = "Vui lòng chọn ngày kết thúc";
    }

    if (fromDate && toDate && fromDate > toDate) {
      newErrors.toDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!fromDate || !toDate) {
      return;
    }

    setIsSubmitting(true);
    try {

      const params = {
        id: mode === BorrowEditMode.Edit && initialData?.id ? initialData?.id : 0,
        equipmentId: Number(selectedEquipmentId),
        fromDate: fromDate,
        toDate: toDate,
      };
      const response = await borrowEquipment(params as BorrowEquipmentEntity).unwrap();
      if (response.data && response.data.isSuccess) {
        // success
        toast.success("Mượn thiết bị thành công");
        onClose();
        actionCallback();
      }
      else if (response.data && !response.data.isSuccess) {
        const newErrors: typeof errors = {};

        if (response.data.equipmentIdError) {
          newErrors.equipmentId = response.data.equipmentIdError;
        }
        if (response.data.fromDateError) {
          newErrors.fromDate = response.data.fromDateError;
        }
        if (response.data.toDateError) {
          newErrors.toDate = response.data.toDateError;
        }

        setErrors(newErrors);
      }
    } catch (error: any) {
      const errorMessage = mode === BorrowEditMode.Edit
        ? "Có lỗi xảy ra khi cập nhật yêu cầu mượn"
        : "Có lỗi xảy ra khi mượn thiết bị";
      toast.error(error?.message || errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl mx-4 sm:mx-auto"
      closeOnOutsideClick={false}
    >
      <div className="p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            {mode === BorrowEditMode.Edit ? 'Chỉnh sửa yêu cầu mượn' : mode === BorrowEditMode.Reborrow ? 'Mượn lại thiết bị' : 'Mượn thiết bị'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {mode === BorrowEditMode.Edit
              ? 'Cập nhật thông tin thiết bị và thời gian mượn'
              : mode === BorrowEditMode.Reborrow
                ? 'Chọn lại thời gian mượn cho thiết bị'
                : 'Chọn thiết bị và thời gian mượn'}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Label>
              Thiết bị<span className="text-error-500">*</span>
            </Label>
            <Select
              options={availableEquipments}
              placeholder="Chọn thiết bị"
              defaultValue={selectedEquipmentId}
              onChange={(value) => {
                setSelectedEquipmentId(value);
                setErrors((prev) => ({ ...prev, equipmentId: undefined }));
              }}
              error={!!errors.equipmentId}
              hint={errors.equipmentId}
              required
              disabled={mode === BorrowEditMode.Edit} // Disable equipment selection in edit mode
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label>
                Ngày bắt đầu<span className="text-error-500">*</span>
              </Label>
              <DatePicker
                id="from-date-picker"
                placeholder="Chọn ngày bắt đầu"
                defaultDate={fromDate}
                onChange={(dates) => {
                  if (dates && dates.length > 0) {
                    const date = new Date(dates[0]);
                    setFromDate(date);
                    setErrors((prev) => ({ ...prev, fromDate: undefined }));

                    // If toDate is before the new fromDate, clear it
                    if (toDate && date > toDate) {
                      setToDate(undefined);
                    }
                  }
                }}
                error={!!errors.fromDate}
                hint={errors.fromDate}
                required
              />
            </div>

            <div>
              <Label>
                Ngày kết thúc<span className="text-error-500">*</span>
              </Label>
              <DatePicker
                id="to-date-picker"
                placeholder="Chọn ngày kết thúc"
                defaultDate={toDate}
                onChange={(dates) => {
                  if (dates && dates.length > 0) {
                    const date = new Date(dates[0]);
                    setToDate(date);
                    setErrors((prev) => ({ ...prev, toDate: undefined }));
                  }
                }}
                error={!!errors.toDate}
                hint={errors.toDate}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Đang xử lý..."
              : "Xác nhận"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BorrowEquipmentModal;


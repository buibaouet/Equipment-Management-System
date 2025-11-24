import { useState, useEffect, useMemo } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import { Loader2 } from "lucide-react";
import { DepartmentEntity } from "../../types/Department";
import { useGetManagerListQuery } from "../../api/useUserApi";
import { useGetDepartmentByIdQuery, useCreateOrUpdateDepartmentMutation } from "../../api/useDepartmentApi";
import { toast } from "sonner";

interface DepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: DepartmentEntity | null;
    callbackAction: () => void; // Callback to refresh the list
    readOnly?: boolean; // If true, all fields are disabled (view mode)
}

export default function DepartmentModal({
    isOpen,
    onClose,
    initialData,
    callbackAction: refreshList,
    readOnly = false,
}: DepartmentModalProps) {
    const { data: managerData, isLoading: isLoadingManagers } = useGetManagerListQuery({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<Partial<DepartmentEntity>>({});

    // Get department data using query if id is provided
    const { data: departmentData } = useGetDepartmentByIdQuery(
        { id: initialData?.id || 0 },
        { skip: !initialData?.id || !isOpen }
    );

    const [formData, setFormData] = useState<DepartmentEntity>({
        id: 0,
        code: "",
        name: "",
        description: "",
        managerId: 0,
        managerName: "",
        isActive: true,
    });

    const managerOptions = useMemo(() => {
        if (!managerData?.data) return [];
        return managerData.data.map((manager) => ({
            value: String(manager.id),
            label: `${manager.userName} - ${manager.fullName}`,
        }));
    }, [managerData]);

    const [saveCreateOrUpdate] = useCreateOrUpdateDepartmentMutation();

    // Update form data when API response is received
    useEffect(() => {
        // Clear form data when modal is opened before loading new data
        setFormData({
            id: 0,
            code: "",
            name: "",
            description: "",
            managerId: 0,
            managerName: "",
            isActive: true,
        });
        // Clear any errors
        setErrors({});

        if (isOpen && departmentData?.data && initialData?.id) {
            setFormData(departmentData.data);
        }
    }, [departmentData, isOpen, initialData?.id]);

    const handleInputChange = (field: keyof DepartmentEntity, value: any) => {
        setFormData((prev: DepartmentEntity) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Partial<DepartmentEntity> = {};

        if (!formData.code.trim()) {
            newErrors.code = "Vui lòng nhập mã phòng ban";
        }
        else if (formData.code.trim().length < 4) {
            newErrors.code = "Mã phòng ban tối thiểu 4 ký tự";
        }

        if (!formData.name.trim()) {
            newErrors.name = "Vui lòng nhập tên phòng ban";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);
        try {
            const response = await saveCreateOrUpdate(formData);

            if (response.data?.data?.isSuccess) {
                toast.success(initialData ? "Sửa phòng ban thành công!" : "Thêm mới phòng ban thành công!");
                onClose();
                refreshList(); // Refresh the list after save
            } else if (response.data?.data?.codeError) {
                setErrors(prev => ({
                    ...prev,
                    code: response.data?.data?.codeError || "Mã phòng ban đã tồn tại"
                }));
            }
        } catch (error) {
            console.error('Error saving department:', error);
            toast.error("Có lỗi xảy ra khi lưu phòng ban");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-3xl mx-4 sm:mx-auto"
            closeOnOutsideClick={false}
        >
            <div className="p-6 sm:p-8">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        {readOnly ? "Xem thông tin phòng ban" : initialData ? "Sửa phòng ban" : "Thêm mới phòng ban"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {readOnly ? "Xem thông tin chi tiết phòng ban" : initialData ? "Cập nhật thông tin phòng ban" : "Thêm mới phòng ban vào hệ thống"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label>
                            Mã phòng ban<span className="text-error-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            value={formData.code}
                            onChange={(e) => handleInputChange("code", e.target.value)}
                            placeholder="Nhập mã phòng ban"
                            error={!!errors.code}
                            hint={errors.code}
                            required
                            disabled={readOnly}
                        />
                    </div>

                    <div>
                        <Label>
                            Tên phòng ban<span className="text-error-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Nhập tên phòng ban"
                            error={!!errors.name}
                            hint={errors.name}
                            required
                            disabled={readOnly}
                        />
                    </div>

                    <div>
                        <Label>
                            Mô tả
                        </Label>
                        <Input
                            type="text"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Nhập mô tả phòng ban"
                            disabled={readOnly}
                        />
                    </div>

                    <div>
                        <Label>Người quản lý</Label>
                        {isLoadingManagers ? (
                            <div className="flex items-center justify-center h-11 rounded-lg border border-gray-300 dark:border-gray-700">
                                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                            </div>
                        ) : (
                            <Select
                                options={[
                                    { value: "", label: "Không chọn người quản lý" },
                                    ...managerOptions
                                ]}
                                defaultValue={formData.managerId ? String(formData.managerId) : ""}
                                onChange={(value) => {
                                    if (!value) {
                                        setFormData(prev => ({
                                            ...prev,
                                            managerId: 0,
                                            managerName: "",
                                        }));
                                        return;
                                    }
                                    const selectedManager = managerData?.data?.find(m => String(m.id) === value);
                                    setFormData(prev => ({
                                        ...prev,
                                        managerId: Number(value),
                                        managerName: `${selectedManager?.userName} - ${selectedManager?.fullName}` || "",
                                    }));
                                }}
                                placeholder="Chọn người quản lý"
                                disabled={readOnly}
                            />
                        )}
                    </div>

                    {initialData && (
                        <div>
                            <Label>Trạng thái</Label>
                            <Select
                                options={[
                                    { value: "true", label: "Đang hoạt động" },
                                    { value: "false", label: "Ngừng hoạt động" },
                                ]}
                                defaultValue={formData.isActive ? "true" : "false"}
                                onChange={(value) => handleInputChange("isActive", value === "true")}
                                placeholder="Chọn trạng thái"
                                disabled={readOnly}
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                        {readOnly ? (
                            <Button variant="outline" onClick={onClose}>
                                Đóng
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                                    Hủy
                                </Button>
                                <Button onClick={handleSubmit} disabled={isProcessing}>
                                    {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {isProcessing ? "Đang lưu..." : initialData ? "Lưu thay đổi" : "Thêm mới"}
                                </Button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </Modal>
    );
}
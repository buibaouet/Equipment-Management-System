import { useState, useEffect, useMemo } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import DatePicker from "../../components/form/date-picker";
import { CreateUserByAdminInput } from "../../types/User";
import Select from "../../components/form/Select";
import { useCreateUserMutation } from "../../api/useUserApi";
import { Loader2 } from "lucide-react";
import { useGetDepartmentListQuery } from "../../api/useDepartmentApi";
import { toast } from "sonner";
import { RoleEnum } from "../../utils/enumerations";

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    callbackAction?: () => void; // Callback to refresh the list
}

export default function CreateUserModal({ isOpen, onClose, callbackAction }: CreateUserModalProps) {
    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const { data: departmentData, isLoading: isLoadingDepartments } = useGetDepartmentListQuery({});
    
    const [formData, setFormData] = useState<CreateUserByAdminInput>({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        role: RoleEnum.User,
        departmentId: 0,
        phoneNumber: '',
        address: '',
        birthDate: undefined,
        bio: '',
    });

    const [errors, setErrors] = useState<Partial<CreateUserByAdminInput>>({});

    useEffect(() => {
        if (!isOpen) {
            // Reset form when modal closes
            setFormData({
                userName: '',
                firstName: '',
                lastName: '',
                email: '',
                role: RoleEnum.User,
                departmentId: 0,
                phoneNumber: '',
                address: '',
                birthDate: undefined,
                bio: '',
            });
            setErrors({});
        }
    }, [isOpen]);

    // Get department options for dropdown
    const departmentOptions = useMemo(() => {
        if (!departmentData?.data) return [];
        return departmentData.data.map((dept) => ({
            value: String(dept.id),
            label: dept.name,
        }));
    }, [departmentData]);

    const handleInputChange = (field: keyof CreateUserByAdminInput, value: string | Date | number | undefined) => {
        if (field === 'birthDate' && value) {
            setFormData((prev) => ({
                ...prev,
                [field]: new Date(value as string)
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleDepartmentChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            departmentId: Number(value),
        }));
    };

    const validateForm = () => {
        const newErrors: Partial<CreateUserByAdminInput> = {};

        if (!formData.userName.trim()) {
            newErrors.userName = "Vui lòng nhập tên đăng nhập";
        }

        if (!formData.firstName.trim()) {
            newErrors.firstName = "Vui lòng nhập họ";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Vui lòng nhập tên";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Vui lòng nhập email";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = "Email không hợp lệ";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }
        
        try {
            const response = await createUser({
                data: formData
            }).unwrap();

            if (response.data && response.data.isSuccess) {
                toast.success(`Tạo người dùng thành công với mật khẩu mặc định: "Default@123"!`);
                callbackAction?.();
                onClose();
            } 
            else if (response.data && !response.data.isSuccess) {
                const newErrors: Partial<CreateUserByAdminInput> = {};
        
                if (response.data.usernameError) {
                    newErrors.userName = response.data.usernameError;
                }
                if (response.data.emailError) {
                    newErrors.email = response.data.emailError;
                }
        
                setErrors(newErrors);
            }
            else {
                toast.error(response.message || "Tạo người dùng thất bại");
            }
        } catch (error: unknown) {
            const apiError = error as { data?: { message?: string; usernameError?: string; emailError?: string } };
            if (apiError?.data?.usernameError) {
                setErrors((prev) => ({ ...prev, userName: apiError.data.usernameError }));
            }
            if (apiError?.data?.emailError) {
                setErrors((prev) => ({ ...prev, email: apiError.data.emailError }));
            }
            toast.error(apiError?.data?.message || "Có lỗi xảy ra khi tạo người dùng");
        }
    };

    const handleCancel = () => {
        setFormData({
            userName: '',
            firstName: '',
            lastName: '',
            email: '',
            role: RoleEnum.User,
            departmentId: 0,
            phoneNumber: '',
            address: '',
            birthDate: undefined,
            bio: '',
        });
        setErrors({});
        onClose();
    };

    const roleOptions = [
        { value: String(RoleEnum.Manager), label: "Quản lý phòng ban" },
        { value: String(RoleEnum.User), label: "Người dùng" },
        { value: String(RoleEnum.Supervisor), label: "Giám sát viên" },
    ];

    const handleRoleChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            role: Number(value),
        }));
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
                        Thêm người dùng mới
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Nhập thông tin để tạo người dùng mới
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label>Tên đăng nhập<span className="text-error-500">*</span></Label>
                            <Input
                                type="text"
                                value={formData.userName}
                                onChange={(e) => handleInputChange('userName', e.target.value)}
                                error={!!errors.userName}
                                hint={errors.userName}
                                required
                                placeholder="Nhập tên đăng nhập"
                            />
                        </div>
                        <div>
                            <Label>Email<span className="text-error-500">*</span></Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                error={!!errors.email}
                                hint={errors.email}
                                required
                                placeholder="Nhập email"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label>Họ<span className="text-error-500">*</span></Label>
                            <Input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                error={!!errors.firstName}
                                hint={errors.firstName}
                                required
                                placeholder="Nhập họ"
                            />
                        </div>
                        <div>
                            <Label>Tên<span className="text-error-500">*</span></Label>
                            <Input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                error={!!errors.lastName}
                                hint={errors.lastName}
                                required
                                placeholder="Nhập tên"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label>Số điện thoại</Label>
                            <Input
                                type="text"
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                        <div>
                            <Label>Ngày sinh</Label>
                            <DatePicker
                                id="birth-date-picker"
                                placeholder="Nhập ngày sinh"
                                defaultDate={formData.birthDate}
                                onChange={(dates) => {
                                    if (dates.length > 0) {
                                        const date = new Date(dates[0]);
                                        handleInputChange('birthDate', date);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Địa chỉ</Label>
                        <Input
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Nhập địa chỉ"
                        />
                    </div>

                    <div>
                        <Label>Bio</Label>
                        <TextArea
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e)}
                            placeholder="Thông tin bio..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label>Phòng ban</Label>
                            {isLoadingDepartments ? (
                                <div className="flex items-center justify-center h-11 rounded-lg border border-gray-300 dark:border-gray-700">
                                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                                </div>
                            ) : (
                                <Select
                                    options={departmentOptions}
                                    defaultValue={String(formData.departmentId)}
                                    onChange={handleDepartmentChange}
                                    placeholder="Chọn phòng ban"
                                />
                            )}
                        </div>

                        <div>
                            <Label>Vai trò<span className="text-error-500">*</span></Label>
                            <Select
                                options={roleOptions}
                                defaultValue={String(formData.role)}
                                onChange={handleRoleChange}
                                placeholder="Chọn vai trò"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <Button variant="outline" onClick={handleCancel} disabled={isCreating}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave} disabled={isCreating}>
                        {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isCreating ? "Đang tạo..." : "Tạo người dùng"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}


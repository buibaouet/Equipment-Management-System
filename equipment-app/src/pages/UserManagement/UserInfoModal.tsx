import { useState, useEffect, useMemo } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import DatePicker from "../../components/form/date-picker";
import { UpdateUserRoleDepartment } from "../../types/User";
import Select from "../../components/form/Select";
import { useUpdateRoleDepartmentUserMutation, useGetUserByIdQuery } from "../../api/useUserApi";
import { Loader2 } from "lucide-react";
import { useGetDepartmentListQuery } from "../../api/useDepartmentApi";
import { toast } from "sonner";
import { RoleEnum } from "../../utils/enumerations";

interface UserInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number | null;
    callbackAction?: () => void; // Callback to refresh the list
    readOnly?: boolean; // If true, all fields are disabled (view mode)
}

export default function UserInfoModal({ isOpen, onClose, userId, callbackAction, readOnly = false }: UserInfoModalProps) {
    const [updateUser, { isLoading: isUpdating }] = useUpdateRoleDepartmentUserMutation();
    const { data: departmentData, isLoading: isLoadingDepartments } = useGetDepartmentListQuery({});
    const { data: userData, isLoading: isLoadingUser } = useGetUserByIdQuery(
        { userId: userId || 0 },
        { skip: !userId || !isOpen }
    );
    
    const user = userData?.data;
    
    const [formData, setFormData] = useState<UpdateUserRoleDepartment>({
        departmentId: 0,
        role: RoleEnum.User,
        firstName: '',
        lastName: '',
        email: '',
        birthDate: undefined,
        bio: '',
        phoneNumber: '',
        address: '',
    });

    const [errors, setErrors] = useState<Partial<UpdateUserRoleDepartment>>({});

    useEffect(() => {
        if (user) {
            setFormData({
                departmentId: user.departmentId || 0,
                role: user.role || RoleEnum.User,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                birthDate: user.birthDate ? (typeof user.birthDate === 'string' ? new Date(user.birthDate) : user.birthDate) : undefined,
                bio: user.bio || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
            });
        }
    }, [user]);

    // Get department options for dropdown
    const departmentOptions = useMemo(() => {
        if (!departmentData?.data) return [];
        return departmentData.data.map((dept) => ({
            value: String(dept.id),
            label: dept.name,
        }));
    }, [departmentData]);

    const handleInputChange = (field: keyof UpdateUserRoleDepartment, value: string | Date | undefined) => {
        if (field === 'birthDate' && value) {
            setFormData((prev) => ({
                ...prev,
                [field]: new Date(value)
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
        const newErrors: Partial<UpdateUserRoleDepartment> = {};

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
        if (!user || !userId) return;
        
        if (!validateForm()) {
            return;
        }
        
        try {
            const response = await updateUser({
                id: userId,
                data: formData
            }).unwrap();
            
            if (response.data) {
                toast.success("Cập nhật thành công!");
                callbackAction?.();
                onClose();
            } else {
                toast.error(response.message || "Cập nhật thất bại");
            }
        } catch (error: unknown) {
            const apiError = error as { data?: { message?: string } };
            toast.error(apiError?.data?.message || "Có lỗi xảy ra khi cập nhật người dùng");
        }
    };

    const handleCancel = () => {
        // Reset form data to original values
        if (user) {
            setFormData({
                departmentId: user.departmentId || 0,
                role: user.role || RoleEnum.User,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                birthDate: user.birthDate ? (typeof user.birthDate === 'string' ? new Date(user.birthDate) : user.birthDate) : undefined,
                bio: user.bio || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
            });
        }
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

    if (!userId) return null;

    if (isLoadingUser) {
        return (
            <Modal 
                isOpen={isOpen} 
                onClose={onClose} 
                className="max-w-3xl mx-4 sm:mx-auto"
                closeOnOutsideClick={false}
            >
                <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                    </div>
                </div>
            </Modal>
        );
    }

    if (!user) {
        return (
            <Modal 
                isOpen={isOpen} 
                onClose={onClose} 
                className="max-w-3xl mx-4 sm:mx-auto"
                closeOnOutsideClick={false}
            >
                <div className="p-6 sm:p-8">
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">Không tìm thấy thông tin người dùng</p>
                    </div>
                </div>
            </Modal>
        );
    }

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
                        {readOnly ? "Xem thông tin người dùng" : "Thông tin người dùng"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {readOnly ? "Xem thông tin chi tiết của người dùng" : "Xem và chỉnh sửa thông tin chi tiết của người dùng"}
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label>Tên đăng nhập</Label>
                            <div className="h-11 px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                                {user.userName}
                            </div>
                        </div>
                        <div>
                            <Label>Email<span className="text-error-500">*</span></Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                error={!!errors.email}
                                hint={errors.email}
                                disabled={readOnly}
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
                                disabled={readOnly}
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
                                disabled={readOnly}
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
                                disabled={readOnly}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                        <div>
                            <Label>Ngày sinh</Label>
                            {readOnly ? (
                                <div className="h-11 px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                                    {formData.birthDate ? new Date(formData.birthDate).toLocaleDateString() : '-'}
                                </div>
                            ) : (
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
                            )}
                        </div>
                    </div>

                    <div>
                        <Label>Địa chỉ</Label>
                        <Input
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            disabled={readOnly}
                            placeholder="Nhập địa chỉ"
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
                                    disabled={readOnly}
                                />
                            )}
                        </div>

                        <div>
                            <Label>Vai trò</Label>
                            <Select
                                options={roleOptions}
                                defaultValue={String(formData.role)}
                                onChange={handleRoleChange}
                                placeholder="Chọn vai trò"
                                disabled={readOnly}
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Bio</Label>
                        {readOnly ? (
                            <div className="min-h-[100px] px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                                {formData.bio || '-'}
                            </div>
                        ) : (
                            <TextArea
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e)}
                                disabled={readOnly}
                                placeholder="Thông tin bio..."
                                rows={3}
                            />
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                    {readOnly ? (
                        <Button variant="outline" onClick={onClose}>
                            Đóng
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
                                Hủy
                            </Button>
                            <Button onClick={handleSave} disabled={isUpdating}>
                                {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
}


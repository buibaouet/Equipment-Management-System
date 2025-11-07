import { useState, useEffect, useMemo } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import { UpdateUserRoleDepartment, UserEntity } from "../../types/User";
import Select from "../../components/form/Select";
import { useUpdateRoleDepartmentUserMutation } from "../../api/useUserApi";
import { Loader2 } from "lucide-react";
import { useGetDepartmentListQuery } from "../../api/useDepartmentApi";
import { toast } from "sonner";
import { RoleEnum } from "../../utils/enumerations";

interface UserInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserEntity | null;
    callbackAction?: () => void; // Callback to refresh the list
}

export default function UserInfoModal({ isOpen, onClose, user, callbackAction }: UserInfoModalProps) {
    const [updateUser, { isLoading: isUpdating }] = useUpdateRoleDepartmentUserMutation();
    const { data: departmentData, isLoading: isLoadingDepartments } = useGetDepartmentListQuery({});
    
    const [formData, setFormData] = useState<UpdateUserRoleDepartment>({
        departmentId: 0,
        role: RoleEnum.User,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                departmentId: user.departmentId || 0,
                role: user.role || RoleEnum.User,
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

    const handleDepartmentChange = (value: string) => {
        const selectedDept = departmentData?.data?.find((d) => String(d.id) === value);
        setFormData((prev) => ({
            ...prev,
            departmentId: Number(value),
            departmentName: selectedDept?.name || "",
        }));
    };

    const handleSave = async () => {
        if (!user) return;
        
        try {
            const response = await updateUser({
                id: user.id,
                data: formData
            }).unwrap();
            
            if (response.data) {
                toast.success("Cập nhật thành công!");
                callbackAction?.();
                onClose();
            } else {
                toast.error(response.message || "Cập nhật thất bại");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Có lỗi xảy ra khi cập nhật người dùng");
        }
    };

    const handleCancel = () => {
        // Reset form data to original values
        if (user) {
            setFormData({
                departmentId: user.departmentId || 0,
                role: user.role || RoleEnum.User,
            });
        }
        onClose();
    };

    const roleOptions = [
        { value: String(RoleEnum.Manager), label: "Quản lý phòng ban" },
        { value: String(RoleEnum.User), label: "Người dùng" },
    ];

    const handleRoleChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            role: Number(value),
        }));
    };

    if (!user) return null;

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
                        Thông tin người dùng
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Xem và chỉnh sửa thông tin chi tiết của người dùng
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="mb-4 space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <Label>Tên đăng nhập</Label>
                                <div className="h-11 px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                                    {user.userName}
                                </div>
                            </div>
                            <div>
                                <Label>Họ và tên</Label>
                                <div className="h-11 px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                                    {`${user.firstName} ${user.lastName}`}
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label>Email</Label>
                            <div className="h-11 px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                                {user.email}
                            </div>
                        </div>
                    </div>

                    {/* Department */}
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

                    {/* Role */}
                    <div>
                        <Label>Vai trò</Label>
                        <Select
                            options={roleOptions}
                            defaultValue={String(formData.role)}
                            onChange={handleRoleChange}
                            placeholder="Chọn vai trò"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <>
                        <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
                            Hủy
                        </Button>
                        <Button onClick={handleSave} disabled={isUpdating}>
                            {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </>
                </div>
            </div>
        </Modal>
    );
}


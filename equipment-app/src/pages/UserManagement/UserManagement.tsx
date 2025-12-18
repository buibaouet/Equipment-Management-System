import {
  Table,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import PaginationWithIcon from "../../components/ui/table/PaginationWithIcon";
import {
  Pencil,
  SearchIcon,
  Eye,
  PlusCircle,
  Trash2,
  Lock,
  Unlock,
} from "lucide-react";
import Badge from "../../components/ui/badge/Badge";
import useUserManagement from "./useUserManagement";
import PageMeta from "../../components/common/PageMeta";
import { RoleEnum } from "../../utils/enumerations";
import { useModal } from "../../hooks/useModal";
import UserInfoModal from "./UserInfoModal";
import CreateUserModal from "./CreateUserModal";
import { useState } from "react";
import { UserEntity } from "../../types/User";
import HeaderTable from "../../components/ui/table/HeaderTable";
import TableBodyContent from "../../components/ui/table/TableBodyContent";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/button/Button";
import { useDeleteUserMutation, useBlockUserMutation } from "../../api/useUserApi";
import ConfirmModal from "../../components/common/ConfirmModal";
import { toast } from "sonner";

export default function UserManagement() {
  const {
    handleSort,
    currentPage,
    handlePageChange,
    handleSearch,
    totalItems,
    totalPages,
    users,
    refreshUsers,
    isLoading
  } = useUserManagement();
  const { currentUser, isAdmin } = useAuth();
  const isSupervisor = currentUser?.role === RoleEnum.Supervisor;
  const isManager = currentUser?.role === RoleEnum.Manager;

  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isCreateModalOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteUser] = useDeleteUserMutation();
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockTarget, setBlockTarget] = useState<{ id: number; name: string; isBlocked: boolean } | null>(null);
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockUser] = useBlockUserMutation();

  const handleEditUser = (user: UserEntity) => {
    setSelectedUserId(user.id);
    setIsViewMode(false);
    openModal();
  };

  const handleViewUser = (user: UserEntity) => {
    setSelectedUserId(user.id);
    setIsViewMode(true);
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
    setSelectedUserId(null);
    setIsViewMode(false);
  };

  const handleOpenDeleteModal = (user: UserEntity) => {
    setUserToDelete({ id: user.id, name: `${user.firstName} ${user.lastName}` });
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleOpenBlockModal = (user: UserEntity) => {
    setBlockTarget({ id: user.id, name: `${user.firstName} ${user.lastName}`, isBlocked: false });
    setIsBlockModalOpen(true);
  };

  const handleOpenUnblockModal = (user: UserEntity) => {
    setBlockTarget({ id: user.id, name: `${user.firstName} ${user.lastName}`, isBlocked: true });
    setIsBlockModalOpen(true);
  };

  const handleCloseBlockModal = () => {
    setIsBlockModalOpen(false);
    setBlockTarget(null);
  };

  const handleConfirmBlock = async () => {
    if (!blockTarget) return;

    try {
      setIsBlocking(true);
      const response = await blockUser({ id: blockTarget.id }).unwrap();
      if (response.statusCode === 200) {
        toast.success(blockTarget.isBlocked ? "Mở khóa người dùng thành công" : "Khóa người dùng thành công");
        refreshUsers();
        handleCloseBlockModal();
      } else {
        toast.error(response.message || "Có lỗi xảy ra khi cập nhật trạng thái khóa");
      }
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? String((error as { data?: string }).data || "Có lỗi xảy ra khi cập nhật trạng thái khóa")
          : undefined;
      toast.error(message);
    } finally {
      setIsBlocking(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      const response = await deleteUser({ id: userToDelete.id }).unwrap();
      if (response.statusCode === 200) {
        toast.success("Xóa người dùng thành công");
        refreshUsers();
      } else {
        toast.error(response.message || "Có lỗi xảy ra khi xóa người dùng");
      }
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? String((error as { data?: string }).data || "Có lỗi xảy ra khi xóa người dùng")
          : undefined;
          toast.error(message);
        } finally {
          setIsDeleting(false);
      handleCloseDeleteModal();
    }
  };

  const arrColumns = [
    { key: "userName", label: "Tên đăng nhập", sortable: true },
    { key: "fullName", label: "Họ và tên", sortable: true },
    { key: "email", label: "Email", sortable: false },
    { key: "departmentName", label: "Phòng ban", sortable: false },
    { key: "role", label: "Vai trò", sortable: false },
    { key: "isBlock", label: "Trạng thái", sortable: false },
  ];

  return (
    <div>
      <PageMeta
        title="Danh sách người dùng"
        description="Danh sách người dùng"
      />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Danh sách người dùng
            </h3>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 sm:flex-auto">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <SearchIcon className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="shadow-sm focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-none sm:w-[300px] sm:min-w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            {isAdmin() && (
              <Button variant="primary" onClick={openCreateModal}>
                <PlusCircle className="w-5 h-5" />
                Thêm người dùng
              </Button>
            )}
          </div>
        </div>
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div>
            <Table>
              <HeaderTable arrColumns={arrColumns} handleSort={handleSort} />
              <TableBodyContent
                isLoading={isLoading}
                data={users}
                columns={arrColumns}
                renderRow={(item: UserEntity, index: number) => (
                  <TableRow key={index + 1}>
                    <TableCell className="px-4 py-4 font-medium text-gray-800 border border-gray-100 dark:border-white/[0.05] dark:text-white text-theme-sm whitespace-nowrap ">
                      {item.userName}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-medium text-gray-800 border border-gray-100 dark:border-white/[0.05] dark:text-white text-theme-sm whitespace-nowrap ">
                      {`${item.firstName} ${item.lastName}`}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.email}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.departmentName}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                      <Badge
                        size="sm"
                        color={
                          item.role == RoleEnum.Admin
                            ? "success"
                            : item.role == RoleEnum.Manager
                              ? "warning"
                              : item.role == RoleEnum.Supervisor
                                ? "info"
                                : "primary"
                        }
                      >
                        {item.role == RoleEnum.Admin
                          ? "Quản trị viên"
                          : item.role == RoleEnum.Manager
                            ? "Quản lý phòng ban"
                            : item.role == RoleEnum.Supervisor
                              ? "Giám sát viên"
                              : "Người dùng"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap ">
                    <Badge
                        size="sm"
                        color={
                          item.isBlock ? "error" : "success"
                        }
                      >
                        {item.isBlock ? "Đã khóa" : "Đang hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap ">
                      <div className="flex items-center justify-center w-full gap-2">
                        {isSupervisor || isManager ? (
                          <span title="Xem">
                            <Eye
                              className="w-4 h-4 cursor-pointer hover:text-brand-600 transition-colors"
                              onClick={() => handleViewUser(item)}
                            />
                          </span>
                        ) : (
                          <>
                            {item.role != RoleEnum.Admin && (
                              <span title="Sửa">
                                <Pencil
                                  className="w-4 h-4 cursor-pointer hover:text-brand-600 transition-colors"
                                  onClick={() => handleEditUser(item)}
                                />
                              </span>
                            )}
                            {isAdmin() && item.role != RoleEnum.Admin && (
                              <>
                              {!item.isBlock ? (
                                <span title="Khóa">
                                  <Lock
                                    className="w-4 h-4 cursor-pointer hover:text-red-600 transition-colors"
                                    onClick={() => handleOpenBlockModal(item)}
                                  />
                                  
                                </span>
                              ) : (
                                <span title="Mở khóa">
                                  <Unlock
                                    className="w-4 h-4 cursor-pointer hover:text-green-600 transition-colors"
                                    onClick={() => handleOpenUnblockModal(item)}
                                  />
                                </span>
                              )}
                              <span title="Xóa">
                                <Trash2
                                  className="w-4 h-4 cursor-pointer hover:text-red-600 transition-colors"
                                  onClick={() => handleOpenDeleteModal(item)}
                                />
                              </span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              />
            </Table>
          </div>
        </div>

        <PaginationWithIcon
          totalPages={totalPages}
          totalItems={totalItems}
          initialPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* User Info Modal */}
      <UserInfoModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        userId={selectedUserId}
        callbackAction={refreshUsers}
        readOnly={isViewMode}
      />

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        callbackAction={refreshUsers}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa người dùng "${userToDelete?.name}" không?`}
        confirmText="Xóa"
        cancelText="Hủy"
        isLoading={isDeleting}
      />

      {/* Block/Unblock Confirmation Modal */}
      <ConfirmModal
        isOpen={isBlockModalOpen}
        onClose={handleCloseBlockModal}
        onConfirm={handleConfirmBlock}
        title={blockTarget?.isBlocked ? "Mở khóa người dùng" : "Khóa người dùng"}
        message={
          blockTarget?.isBlocked
            ? `Bạn có chắc chắn muốn mở khóa người dùng "${blockTarget?.name}" không?`
            : `Bạn có chắc chắn muốn khóa người dùng "${blockTarget?.name}" không?`
        }
        confirmText={blockTarget?.isBlocked ? "Mở khóa" : "Khóa"}
        cancelText="Hủy"
        isLoading={isBlocking}
      />
    </div>
  );
}

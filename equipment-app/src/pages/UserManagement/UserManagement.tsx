import {
  Table,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import PaginationWithIcon from "../../components/ui/table/PaginationWithIcon";
import {
  Pencil,
  SearchIcon,
} from "lucide-react";
import Badge from "../../components/ui/badge/Badge";
import useUserManagement from "./useUserManagement";
import PageMeta from "../../components/common/PageMeta";
import { RoleEnum } from "../../utils/enumerations";
import { useModal } from "../../hooks/useModal";
import UserInfoModal from "./UserInfoModal";
import { useState } from "react";
import { UserEntity } from "../../types/User";
import HeaderTable from "../../components/ui/table/HeaderTable";
import TableBodyContent from "../../components/ui/table/TableBodyContent";

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

  const { isOpen, openModal, closeModal } = useModal();
  const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);

  const handleEditUser = (user: UserEntity) => {
    setSelectedUser(user);
    openModal();
  };

  const arrColumns = [
    { key: "userName", label: "Tên đăng nhập", sortable: true },
    { key: "fullName", label: "Họ và tên", sortable: true },
    { key: "email", label: "Email", sortable: false },
    { key: "departmentName", label: "Phòng ban", sortable: false },
    { key: "role", label: "Vai trò", sortable: false },
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
                renderRow={(item: any, index: number) => (
                  <TableRow key={index + 1}>
                    <TableCell className="px-4 py-4 font-medium text-gray-800 border border-gray-100 dark:border-white/[0.05] dark:text-white text-theme-sm whitespace-nowrap ">
                      {item.userName}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-medium text-gray-800 border border-gray-100 dark:border-white/[0.05] dark:text-white text-theme-sm whitespace-nowrap ">
                      {item.fullName}
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
                              : "primary"
                        }
                      >
                        {item.role == RoleEnum.Admin
                          ? "Quản trị viên"
                          : item.role == RoleEnum.Manager
                            ? "Quản lý phòng ban"
                            : "Người dùng"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap ">
                      <div className="flex items-center justify-center w-full gap-2" title="Sửa">
                        {item.role != RoleEnum.Admin
                          ? (<Pencil
                            className="w-4 h-4 cursor-pointer hover:text-brand-600 transition-colors"
                            onClick={() => handleEditUser(item)}
                          />)
                          :
                          (<></>)}
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
        onClose={closeModal}
        user={selectedUser}
        callbackAction={refreshUsers}
      />
    </div>
  );
}

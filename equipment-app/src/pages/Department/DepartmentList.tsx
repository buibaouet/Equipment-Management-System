import Button from "../../components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import PaginationWithIcon from "../../components/ui/table/PaginationWithIcon";
import {
  Pencil,
  PauseCircleIcon,
  PlayCircleIcon,
  PlusCircle
} from "lucide-react";
import Badge from "../../components/ui/badge/Badge";
import useDepartmentList from "./useDepartmentList";
import PageMeta from "../../components/common/PageMeta";
import DepartmentModal from "./DepartmentModal";
import { useState } from "react";
import { DepartmentEntity } from "../../types/Department";
import HeaderTable from "../../components/ui/table/HeaderTable";

export default function DepartmentList() {
  const {
    handleSort,
    currentPage,
    handlePageChange,
    totalItems,
    totalPages,
    departments,
    refreshDepartments,
    handleActiveDepartment
  } = useDepartmentList();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentEntity | null>(null);

  const handleOpenModal = () => {
    setSelectedDepartment(null); // Clear selected department for "Add new"
    setIsModalOpen(true);
  };

  const handleEditDepartment = (department: DepartmentEntity) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
  };

  const arrColumns = [
    { key: "code", label: "Mã phòng ban", sortable: true },
    { key: "name", label: "Tên phòng ban", sortable: true },
    { key: "quantityEquipment", label: "Số lượng thiết bị", sortable: false },
    { key: "quantityUser", label: "Số lượng nhân sự", sortable: false },
    { key: "managerName", label: "Người quản lý", sortable: false },
    { key: "isActive", label: "Trạng thái", sortable: true },
  ];


  return (
    <div>
      <PageMeta
        title="Danh sách phòng ban"
        description="Danh sách phòng ban"
      />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Danh sách phòng ban
            </h3>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" onClick={handleOpenModal}>
              <PlusCircle className="w-5 h-5" />
              Thêm mới
            </Button>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div>
            <Table>
              <HeaderTable arrColumns={arrColumns} handleSort={handleSort} />
              <TableBody>
                {departments.map((item: any, i: number) => (
                  <TableRow key={i + 1}>
                    <TableCell className="px-4 py-4 font-medium text-gray-800 border border-gray-100 dark:border-white/[0.05] dark:text-white text-theme-sm whitespace-nowrap ">
                      {item.code}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.name}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.quantityEquipment}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.quantityUser}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.managerName}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                      <Badge
                        size="sm"
                        color={item.isActive ? "success" : "error"}
                      >
                        {item.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap ">
                      <div className="flex items-center justify-center w-full gap-2">
                        <span title="Sửa">
                          <Pencil
                            className="w-4 h-4 cursor-pointer hover:text-gray"
                            onClick={() => handleEditDepartment(item)}
                          />
                        </span>
                        {item.isActive
                          ? (
                            <span title="Ngừng hoạt động">
                              <PauseCircleIcon
                                className="w-4 h-4 cursor-pointer hover:text-error-500"
                                onClick={() => handleActiveDepartment(item)}
                              />
                            </span>
                          )
                          : <span title="Hoạt động lại">
                            <PlayCircleIcon
                              className="w-4 h-4 cursor-pointer hover:text-error-500"
                              onClick={() => handleActiveDepartment(item)}
                            />
                          </span>
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
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

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedDepartment}
        callbackAction={refreshDepartments}
      />
    </div>
  );
}

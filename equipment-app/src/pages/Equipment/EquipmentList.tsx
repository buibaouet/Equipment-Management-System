import Button from "../../components/ui/button/Button";
import {
  Table,
  TableCell,
  TableRow
} from "../../components/ui/table";
import PaginationWithIcon from "../../components/ui/table/PaginationWithIcon";
import {
  Pencil,
  ArrowBigDownDash,
  PlusCircle,
  SearchIcon,
  EyeIcon,
  EllipsisVerticalIcon
} from "lucide-react";
import { useNavigate } from "react-router";
import Badge from "../../components/ui/badge/Badge";
import useEquipmentList from "./useEquipmentList";
import FilterDropdown from "./FilterDropdown";
import PageMeta from "../../components/common/PageMeta";
import HeaderTable from "../../components/ui/table/HeaderTable";
import { EquipmentStatusEnum } from "../../utils/enumerations";
import { useAuth } from "../../hooks/useAuth";
import TableBodyContent from "../../components/ui/table/TableBodyContent";
import { useState } from "react";
import EquipmentModal from "./EquipmentModal";
import TableDropdown from "../../components/common/TableDropdown";

export default function EquipmentList() {
  const navigate = useNavigate();
  const { isAdmin, isManagerOrAdmin } = useAuth();
  const {
    showFilter,
    setShowFilter,
    handleSearch,
    handleSort,
    currentPage,
    handlePageChange,
    totalItems,
    totalPages,
    equipments: currentData,
    handleApplyFilter,
    categoryId,
    departmentId,
    status,
    isLoading
  } = useEquipmentList();

  const arrColumns = [
    { key: "code", label: "Mã thiết bị", sortable: true },
    { key: "name", label: "Tên thiết bị", sortable: true },
    { key: "categoryName", label: "Loại thiết bị", sortable: false },
    { key: "price", label: "Giá trị", sortable: true },
    { key: "departmentName", label: "Phòng ban", sortable: false },
    { key: "ownerName", label: "Người sử dụng", sortable: false },
    { key: "status", label: "Trạng thái", sortable: true },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);
  const handleOpenModal = (equipmentId: number) => {
    setSelectedEquipmentId(equipmentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <PageMeta
        title="Danh sách thiết bị"
        description="Danh sách thiết bị"
      />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Danh sách thiết bị
            </h3>
          </div>

          <div className="flex gap-3">
            {isAdmin() && (
              <Button variant="outline">
                Xuất dữ liệu
                <ArrowBigDownDash className="w-5 h-5" />
              </Button>
            )}

            {isManagerOrAdmin() && (
              <Button variant="primary" onClick={() => navigate('/equipment-detail')}>
                <PlusCircle className="w-5 h-5" />
                Thêm thiết bị
              </Button>
            )}
          </div>
        </div>
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div className="flex gap-3 sm:justify-between">
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
            <FilterDropdown
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              onApplyFilter={handleApplyFilter}
              initialFilters={{ categoryId, departmentId, status }}
            />
          </div>
        </div>
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div>
            <Table>
              <HeaderTable arrColumns={arrColumns} handleSort={handleSort} />
              <TableBodyContent
                isLoading={isLoading}
                data={currentData}
                columns={arrColumns}
                renderRow={(item: any, index: number) => (
                  <TableRow key={index + 1}>
                    <TableCell className="px-4 py-3.5 font-medium text-gray-800 border border-gray-100 dark:border-white/[0.05] dark:text-white text-theme-sm whitespace-nowrap ">
                      {item.code}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.name}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.categoryName}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border dark:border-white/[0.05] border-gray-100 text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.price
                        ? new Intl.NumberFormat("vi-VN").format(item.price)
                        : ""}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border border-gray-100  dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.departmentName}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border border-gray-100  dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.ownerName}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                      <Badge
                        size="sm"
                        color={
                          item.status === EquipmentStatusEnum.Available
                            ? "success"
                            : item.status === EquipmentStatusEnum.Borrowed
                              ? "info"
                              : item.status === EquipmentStatusEnum.Maintenance
                                ? "primary"
                                : item.status === EquipmentStatusEnum.Lost
                                  ? "dark"
                                  : item.status === EquipmentStatusEnum.BrokenPart
                                    ? "warning"
                                    : "error"
                        }
                      >
                        {item.status === EquipmentStatusEnum.Available
                          ? "Còn sử dụng"
                          : item.status === EquipmentStatusEnum.Borrowed
                            ? "Đang mượn"
                            : item.status === EquipmentStatusEnum.Maintenance
                              ? "Đang bảo dưỡng"
                              : item.status === EquipmentStatusEnum.Lost
                                ? "Đã mất"
                                : item.status === EquipmentStatusEnum.BrokenPart
                                  ? "Hỏng một phần"
                                  : item.status === EquipmentStatusEnum.Broken
                                    ? "Đã hỏng"
                                    : ""
                        }
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap ">
                      <div className="flex items-center justify-center w-full gap-2">
                        <span title="Xem">
                          <EyeIcon className="w-4 h-4 cursor-pointer hover:text-gray"
                            onClick={() => handleOpenModal(item.id)}
                          />
                        </span>
                        <span title="Sửa">
                          <Pencil
                            className="w-4 h-4 cursor-pointer hover:text-gray"
                            onClick={() => navigate(`/equipment-detail/${item.id}`)}
                          />
                        </span>
                        <TableDropdown
                          className="h-4 w-4"
                          dropdownButton={
                            <button className="text-gray-500 dark:text-gray-400" title="Thêm thao tác">
                              <EllipsisVerticalIcon className="w-4 h-4" />
                            </button>
                          }
                          dropdownContent={
                            <>
                              <button
                                className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                onClick={() => navigate(`/equipment-detail/${item.id}`)}
                                title="Sửa"
                              >
                                Sửa
                              </button>
                              <button
                                className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                              >
                                Xóa
                              </button>
                            </>
                          }
                        />
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

      <EquipmentModal
        id={selectedEquipmentId ?? 0}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

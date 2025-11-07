import Button from "../../components/ui/button/Button";
import {
  Table,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import PaginationWithIcon from "../../components/ui/table/PaginationWithIcon";
import {
  Pencil,
  RotateCcwIcon,
  HardDriveDownload,
  RefreshCcwIcon,
} from "lucide-react";
import Badge from "../../components/ui/badge/Badge";
import useBorrowReturn from "./useBorrowReturn";
import PageMeta from "../../components/common/PageMeta";
import HeaderTable from "../../components/ui/table/HeaderTable";
import { BorrowEditMode, BorrowEquipmentStatusEnum } from "../../utils/enumerations";
import TableBodyContent from "../../components/ui/table/TableBodyContent";
import BorrowEquipmentModal from "./BorrowEquipmentModal";
import ReturnEquipmentModal from "./ReturnEquipmentModal";

export default function BorrowReturnList() {
  const {
    handleSort,
    currentPage,
    handlePageChange,
    totalItems,
    totalPages,
    borrowRecords,
    isLoading,
    isBorrowModalOpen,
    modalMode,
    selectedItem,
    isReturnModalOpen,
    selectedReturnItem,
    openReturnModal,
    closeReturnModal,
    openBorrowModal,
    closeModal,
    fetchBorrowRecords,
  } = useBorrowReturn();

  const arrColumns = [
    { key: "code", label: "Mã thiết bị", sortable: true },
    { key: "name", label: "Tên thiết bị", sortable: true },
    { key: "categoryName", label: "Loại thiết bị", sortable: false },
    { key: "departmentName", label: "Phòng ban", sortable: false },
    { key: "fromDate", label: "Ngày mượn", sortable: true },
    { key: "toDate", label: "Ngày trả", sortable: true },
    { key: "status", label: "Trạng thái", sortable: true },
  ];

  return (
    <div>
      <PageMeta
        title="Mượn trả thiết bị"
        description="Mượn trả thiết bị"
      />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Mượn trả thiết bị
            </h3>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" onClick={() => openBorrowModal(null, BorrowEditMode.Create)}>
              <HardDriveDownload className="w-5 h-5" />
              Mượn thiết bị
            </Button>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div>
            <Table>
              <HeaderTable arrColumns={arrColumns} handleSort={handleSort} />
              <TableBodyContent
                isLoading={isLoading}
                data={borrowRecords}
                columns={arrColumns}
                renderRow={(item: any, index: number) => (
                  <TableRow key={index + 1}>
                    <TableCell className="px-4 py-3.5 font-medium text-gray-800 border border-gray-100 dark:border-white/[0.05] dark:text-white text-theme-sm whitespace-nowrap ">
                      {item.equipmentCode}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.equipmentName}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.categoryName}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border border-gray-100  dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.departmentName}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border border-gray-100  dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.fromDate ? new Date(item.fromDate).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className={`px-4 py-3.5 font-normal text-gray-800 border border-gray-100  dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap 
                      ${new Date(item.toDate) < new Date() ? "text-red-500" : "text-gray-800"}`}
                    >
                      {item.toDate ? new Date(item.toDate).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                      <Badge
                        size="sm"
                        color={
                          new Date(item.toDate) < new Date() && item.status === BorrowEquipmentStatusEnum.Borrowed
                            ? "error"
                            : item.status === BorrowEquipmentStatusEnum.Pending
                              ? "primary"
                              : item.status === BorrowEquipmentStatusEnum.Borrowed
                                ? "info"
                                : item.status === BorrowEquipmentStatusEnum.Rejected
                                  ? "dark"
                                  : item.status === BorrowEquipmentStatusEnum.Returned
                                    ? "warning"
                                    : "primary"
                        }
                      >
                        {new Date(item.toDate) < new Date() && item.status === BorrowEquipmentStatusEnum.Borrowed
                          ? "Quá hạn"
                          : item.status === BorrowEquipmentStatusEnum.Pending
                            ? "Chờ duyệt"
                            : item.status === BorrowEquipmentStatusEnum.Borrowed
                              ? "Đang mượn"
                              : item.status === BorrowEquipmentStatusEnum.Rejected
                                ? "Đã từ chối"
                                : item.status === BorrowEquipmentStatusEnum.Returned
                                  ? "Đã trả"
                                  : ""}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap ">
                      <div className="flex items-center justify-center w-full gap-2">
                        {item.status === BorrowEquipmentStatusEnum.Borrowed && (
                          <span
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => openReturnModal(item)}
                          >
                            <RotateCcwIcon
                              className="w-4 h-4 cursor-pointer hover:text-gray"
                            />
                            <span className="text-sm">Trả</span>
                          </span>
                        )}
                        {item.status === BorrowEquipmentStatusEnum.Pending && (
                          <span
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => openBorrowModal(item, BorrowEditMode.Edit)}
                          >
                            <Pencil
                              className="w-4 h-4 cursor-pointer hover:text-gray"
                            />
                            <span className="text-sm">Sửa</span>
                          </span>
                        )}
                        {(item.status === BorrowEquipmentStatusEnum.Rejected ||
                          item.status === BorrowEquipmentStatusEnum.Returned) && (
                            <span
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => openBorrowModal(item, BorrowEditMode.Reborrow)}
                            >
                              <RefreshCcwIcon
                                className="w-4 h-4 cursor-pointer hover:text-gray"
                              />
                              <span className="text-sm">Mượn lại</span>
                            </span>
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

      <BorrowEquipmentModal
        isOpen={isBorrowModalOpen}
        onClose={closeModal}
        actionCallback={fetchBorrowRecords}
        mode={modalMode}
        initialData={selectedItem ?? undefined}
      />

      <ReturnEquipmentModal
        isOpen={isReturnModalOpen}
        onClose={closeReturnModal}
        equipment={selectedReturnItem ?? undefined}
        actionCallback={fetchBorrowRecords}
      />
    </div>
  );
}

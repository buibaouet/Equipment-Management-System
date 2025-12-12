import {
  Table,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import PaginationWithIcon from "../../components/ui/table/PaginationWithIcon";
import {
  EyeIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import useApprovedRequest from "./useApprovedRequest";
import PageMeta from "../../components/common/PageMeta";
import TableBodyContent from "../../components/ui/table/TableBodyContent";
import HeaderTable from "../../components/ui/table/HeaderTable";
import { RequestBorrowEquipmentPaging } from "../../types/BorrowEquipment";
import EquipmentModal from "../Equipment/EquipmentModal";
import { RoleEnum } from "../../utils/enumerations";
import { useAuth } from "../../hooks/useAuth";

export default function ApprovedRequest() {
  const {
    handleSort,
    currentPage,
    handlePageChange,
    totalItems,
    totalPages,
    currentData,
    isLoading,
    handleApprove,
    handleReject,
  } = useApprovedRequest();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);

  const handleOpenModal = (equipmentId: number) => {
    setSelectedEquipmentId(equipmentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const arrColumns = [
    { key: "equipmentCode", label: "Mã thiết bị", sortable: true },
    { key: "equipmentName", label: "Tên thiết bị", sortable: true },
    { key: "categoryName", label: "Loại thiết bị", sortable: false },
    { key: "departmentName", label: "Phòng ban", sortable: false },
    { key: "owerName", label: "Chủ thiết bị", sortable: false },
    { key: "borrowerName", label: "Người mượn", sortable: true },
    { key: "fromDate", label: "Thời gian mượn", sortable: false },
  ];

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateObj);
  };

  const formatDateRange = (fromDate: Date | string, toDate: Date | string) => {
    return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
  };

  const { currentUser } = useAuth();
  const isSupervisor = currentUser?.role === RoleEnum.Supervisor;

  return (
    <div>
      <PageMeta
        title="Duyệt yêu cầu mượn"
        description="Duyệt yêu cầu mượn"
      />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Duyệt yêu cầu mượn
            </h3>
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
                renderRow={(item: RequestBorrowEquipmentPaging, index: number) => (
                  <TableRow key={item.id || index + 1}>
                    <TableCell className="px-4 py-4 font-medium text-gray-800 border border-gray-100 dark:border-white/[0.05] dark:text-white text-theme-sm whitespace-nowrap ">
                      {item.equipmentCode}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.equipmentName}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.categoryName}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.departmentName}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.owerName}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.borrowerName}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {formatDateRange(item.fromDate, item.toDate)}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap ">
                      <div className="flex items-center justify-center w-full gap-2">
                      {!isSupervisor && (
                        <>
                          <span title="Duyệt">
                            <CheckIcon 
                              className="w-4 h-4 cursor-pointer hover:text-success-500 text-success-600 dark:text-success-400" 
                              onClick={() => handleApprove(item.id)}
                            />
                          </span>
                          <span title="Từ chối">
                            <XIcon 
                              className="w-4 h-4 cursor-pointer hover:text-error-500 text-error-600 dark:text-error-400" 
                              onClick={() => handleReject(item.id)}
                            />
                          </span>
                        </>
                        )}
                        <span title="Xem chi tiết">
                          <EyeIcon 
                            className="w-4 h-4 cursor-pointer hover:text-gray" 
                            onClick={() => handleOpenModal(item.equipmentId)}
                          />
                        </span>
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

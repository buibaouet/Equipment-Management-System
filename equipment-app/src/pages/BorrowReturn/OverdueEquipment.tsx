import { useCallback, useState } from "react";
import { Table, TableCell, TableRow } from "../../components/ui/table";
import { Info, RotateCcwIcon } from "lucide-react";
import Badge from "../../components/ui/badge/Badge";
import PageMeta from "../../components/common/PageMeta";
import HeaderTable from "../../components/ui/table/HeaderTable";
import TableBodyContent from "../../components/ui/table/TableBodyContent";
import { useGetOverdueBorrowEquipmentsQuery } from "../../api/useBorrowEquipmentApi";
import { BorrowEquipmentDataModel } from "../../types/BorrowEquipment";
import BorrowReturnInfoModal from "./BorrowReturnInfoModal";
import ReturnEquipmentModal from "./ReturnEquipmentModal";
import { useAuth } from "../../hooks/useAuth";
import { BorrowEquipmentStatusEnum } from "../../utils/enumerations";

export default function OverdueEquipment() {
  const { data, isLoading, refetch } = useGetOverdueBorrowEquipmentsQuery();
  const overdueRecords = (data?.data || []) as BorrowEquipmentDataModel[];

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedInfoId, setSelectedInfoId] = useState<number | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedReturnItem, setSelectedReturnItem] = useState<BorrowEquipmentDataModel | null>(null);

  const { currentUser } = useAuth();

  const openInfoModal = useCallback((id: number) => {
    setSelectedInfoId(id);
    setIsInfoModalOpen(true);
  }, []);

  const closeInfoModal = useCallback(() => {
    setIsInfoModalOpen(false);
    setSelectedInfoId(null);
  }, []);

  const openReturnModal = useCallback((item: BorrowEquipmentDataModel) => {
    setSelectedReturnItem(item);
    setIsReturnModalOpen(true);
  }, []);

  const closeReturnModal = useCallback(() => {
    setSelectedReturnItem(null);
    setIsReturnModalOpen(false);
  }, []);

  const overdueInfo = (item: BorrowEquipmentDataModel) => {
    const dueDate = new Date(item.toDate);
    const getDayTimestamp = (date: Date) => {
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      return normalized.getTime();
    };

    const diffMs = getDayTimestamp(new Date()) - getDayTimestamp(dueDate);
    const daysOverdue = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return daysOverdue > 0 ? `Trễ ${daysOverdue} ngày` : "Đúng hạn";
  };

  const arrColumns = [
    { key: "code", label: "Mã thiết bị", sortable: true },
    { key: "name", label: "Tên thiết bị", sortable: true },
    { key: "categoryName", label: "Loại thiết bị", sortable: false },
    { key: "departmentName", label: "Phòng ban", sortable: false },
    { key: "owerName", label: "Chủ thiết bị", sortable: false },
    { key: "borrowerName", label: "Người mượn", sortable: false },
    { key: "fromDate", label: "Ngày mượn", sortable: true },
    { key: "toDate", label: "Ngày trả dự kiến", sortable: true },
    { key: "status", label: "Trạng thái", sortable: false },
  ];

  return (
    <div>
      <PageMeta
        title="Thiết bị quá hạn"
        description="Danh sách thiết bị đã quá hạn nhưng chưa được trả"
      />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Thiết bị quá hạn
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Danh sách các thiết bị đang mượn nhưng đã quá hạn ngày trả.
            </p>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div>
            <Table>
              <HeaderTable arrColumns={arrColumns} handleSort={() => {}} />
              <TableBodyContent
                isLoading={isLoading}
                data={overdueRecords}
                columns={arrColumns}
                renderRow={(item: BorrowEquipmentDataModel, index: number) => (
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
                      {item.owerName}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border border-gray-100  dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.borrowerName}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border border-gray-100  dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.fromDate ? new Date(item.fromDate).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-red-600 border border-gray-100  dark:border-white/[0.05] text-theme-sm dark:text-red-400 whitespace-nowrap ">
                      {item.toDate ? new Date(item.toDate).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                      <Badge size="sm" color="error">
                        {overdueInfo(item)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap ">
                      <div className="flex items-center justify-center w-full gap-2">
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                          onClick={() => openInfoModal(item.id)}
                          aria-label="Xem chi tiết"
                          title="Xem chi tiết"
                          >
                          <Info className="w-4 h-4" />
                        </button>
                        {currentUser?.id === item.borrowerId && item.status === BorrowEquipmentStatusEnum.Borrowed && (
                          <span
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => openReturnModal(item)}
                            title="Trả thiết bị"
                          >
                            <RotateCcwIcon className="w-4 h-4 cursor-pointer hover:text-gray" />
                            <span className="text-sm">Trả</span>
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
      </div>

      <BorrowReturnInfoModal
        isOpen={isInfoModalOpen}
        onClose={closeInfoModal}
        recordId={selectedInfoId ?? undefined}
      />

      <ReturnEquipmentModal
        isOpen={isReturnModalOpen}
        onClose={closeReturnModal}
        equipment={selectedReturnItem ?? undefined}
        actionCallback={refetch}
      />
    </div>
  );
}

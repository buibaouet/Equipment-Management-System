import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  ArrowBigDownDash,
  PlusCircle,
  SearchIcon,
  EyeIcon,
  EllipsisVerticalIcon,
  Pencil
} from "lucide-react";
import Button from "../../components/ui/button/Button";
import {
  Table,
  TableCell,
  TableRow
} from "../../components/ui/table";
import PaginationWithIcon from "../../components/ui/table/PaginationWithIcon";
import Badge from "../../components/ui/badge/Badge";
import useEquipmentList from "./useEquipmentList";
import FilterDropdown from "./FilterDropdown";
import PageMeta from "../../components/common/PageMeta";
import HeaderTable from "../../components/ui/table/HeaderTable";
import { EquipmentStatusEnum, RoleEnum, BorrowEditMode, BorrowEquipmentStatusEnum } from "../../utils/enumerations";
import { useAuth } from "../../hooks/useAuth";
import TableBodyContent from "../../components/ui/table/TableBodyContent";
import EquipmentModal from "./EquipmentModal";
import TableDropdown from "../../components/common/TableDropdown";
import BorrowEquipmentModal from "../BorrowReturn/BorrowEquipmentModal";
import ReturnEquipmentModal from "../BorrowReturn/ReturnEquipmentModal";
import EquipmentHistoryModal from "./EquipmentHistoryModal";
import EquipmentBorrowReturnHistoryModal from "./EquipmentBorrowReturnHistoryModal";
import { useGetListBorrowEquipmentPagingMutation } from "../../api/useBorrowEquipmentApi";
import { useExportEquipmentMutation } from "../../api/useEquipmentApi";
import { BorrowEquipmentEntity, BorrowEquipmentPaging } from "../../types/BorrowEquipment";
import { EquipmentPagingResponse } from "../../types/Equipment";

export default function EquipmentList() {
  const navigate = useNavigate();
  const { isAdmin, isManagerOrAdmin, currentUser } = useAuth();
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
    isLoading,
    fetchEquipments
  } = useEquipmentList();

  const [getBorrowEquipmentPaging] = useGetListBorrowEquipmentPagingMutation();
  const [exportEquipment] = useExportEquipmentMutation();
  const [borrowRecords, setBorrowRecords] = useState<BorrowEquipmentPaging[]>([]);

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
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedBorrowRecord, setSelectedBorrowRecord] = useState<BorrowEquipmentPaging | null>(null);
  const [borrowEquipmentId, setBorrowEquipmentId] = useState<number | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyEquipmentId, setHistoryEquipmentId] = useState<number | null>(null);
  const [isBorrowReturnHistoryOpen, setIsBorrowReturnHistoryOpen] = useState(false);
  const [borrowReturnEquipmentId, setBorrowReturnEquipmentId] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch borrow records for current user to get borrow record IDs
  useEffect(() => {
    const fetchBorrowRecords = async () => {
      if (!currentUser || isAdmin()) return; // Admin doesn't need borrow records

      try {
        const param = {
          pageIndex: 1,
          pageSize: 1000, // Get all records for current user
          orderBy: "",
          keyword: '',
        };
        const response = await getBorrowEquipmentPaging({ param }).unwrap();
        if (response.statusCode === 200 && response.data) {
          const data = response.data.data;
          setBorrowRecords(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching borrow records:", err);
      }
    };

    fetchBorrowRecords();
  }, [currentUser, isAdmin, getBorrowEquipmentPaging]);

  // Create a map of equipmentId -> borrowRecord for quick lookup
  const borrowRecordMap = useMemo(() => {
    const map = new Map<number, BorrowEquipmentPaging>();
    borrowRecords.forEach(record => {
      if (record.status === BorrowEquipmentStatusEnum.Borrowed) { // Borrowed status
        map.set(record.equipmentId, record);
      }
    });
    return map;
  }, [borrowRecords]);

  const handleOpenModal = (equipmentId: number) => {
    setSelectedEquipmentId(equipmentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenBorrowModal = (equipmentId: number) => {
    setBorrowEquipmentId(equipmentId);
    setIsBorrowModalOpen(true);
  };

  const handleCloseBorrowModal = () => {
    setIsBorrowModalOpen(false);
    setBorrowEquipmentId(null);
  };

  const handleOpenReturnModal = (equipmentId: number) => {
    const borrowRecord = borrowRecordMap.get(equipmentId);
    if (borrowRecord) {
      setSelectedBorrowRecord(borrowRecord);
      setIsReturnModalOpen(true);
    }
  };

  const handleCloseReturnModal = () => {
    setIsReturnModalOpen(false);
    setSelectedBorrowRecord(null);
  };

  const handleOpenHistoryEquipmentModal = (equipmentId: number) => {
    setHistoryEquipmentId(equipmentId);
    setIsHistoryModalOpen(true);
  };

  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false);
    setHistoryEquipmentId(null);
  };

  const handleOpenBorrowReturnHistoryModal = (equipmentId: number) => {
    setBorrowReturnEquipmentId(equipmentId);
    setIsBorrowReturnHistoryOpen(true);
  };

  const handleCloseBorrowReturnHistoryModal = () => {
    setBorrowReturnEquipmentId(null);
    setIsBorrowReturnHistoryOpen(false);
  };

  const handleRefresh = () => {
    fetchEquipments();
    // Refresh borrow records
    if (currentUser && !isAdmin()) {
      const param = {
        pageIndex: 1,
        pageSize: 1000,
        orderBy: "",
        keyword: '',
      };
      getBorrowEquipmentPaging({ param }).unwrap().then(response => {
        if (response.statusCode === 200 && response.data) {
          const data = response.data.data;
          setBorrowRecords(Array.isArray(data) ? data : []);
        }
      }).catch(err => console.error("Error fetching borrow records:", err));
    }
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const blob = await exportEquipment().unwrap();
      const fileName = `Danh_sach_thiet_bi_${new Date().toISOString().split("T")[0]}.xlsx`;
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Xuất dữ liệu thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xuất dữ liệu");
      console.log(error);
    } finally {
      setIsExporting(false);
    }
  };

  // Permission check functions
  const canEditEquipment = (item: EquipmentPagingResponse): boolean => {
    if (currentUser?.role === RoleEnum.Supervisor) return false; // Supervisor is read-only
    if (isAdmin()) return true;
    if (currentUser?.role === RoleEnum.Manager) {
      return item.departmentId === currentUser.departmentId;
    }
    return false;
  };

  const canBorrowEquipment = (item: EquipmentPagingResponse): boolean => {
    if (currentUser?.role === RoleEnum.Supervisor) return false; // Supervisor is read-only
    if (!currentUser || item.ownerId === currentUser.id) return false;
    // User or Manager can borrow available equipment
    if (currentUser.role === RoleEnum.User || currentUser.role === RoleEnum.Manager) {
      return item.status === EquipmentStatusEnum.Available;
    }
    return false;
  };

  const canReturnEquipment = (item: EquipmentPagingResponse): boolean => {
    if (currentUser?.role === RoleEnum.Supervisor) return false; // Supervisor is read-only
    if (!currentUser || item.ownerId === currentUser.id) return false;
    // Can return if equipment is borrowed and owned by current user
    if (item.status === EquipmentStatusEnum.Borrowed) {
      return borrowRecordMap.has(item.id);
    }
    return false;
  };

  const canViewBorrowReturnHistory = (item: EquipmentPagingResponse): boolean => {
    if (isAdmin() || currentUser?.role === RoleEnum.Supervisor) return true;
    if (currentUser?.role === RoleEnum.Manager) {
      return item.departmentId === currentUser.departmentId;
    }
    return false;
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
              <Button
                variant="outline"
                onClick={handleExportData}
                disabled={isExporting}
              >
                {isExporting ? "Đang xuất..." : "Xuất dữ liệu"}
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
                renderRow={(item: EquipmentPagingResponse, index: number) => (
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
                        {canEditEquipment(item) && (
                          <span title="Sửa">
                            <Pencil
                              className="w-4 h-4 cursor-pointer hover:text-gray"
                              onClick={() => navigate(`/equipment-detail/${item.id}`)}
                            />
                          </span>
                        )}
                        <TableDropdown
                          className="h-4 w-4"
                          dropdownButton={
                            <button className="text-gray-500 dark:text-gray-400" title="Thêm thao tác">
                              <EllipsisVerticalIcon className="w-4 h-4" />
                            </button>
                          }
                          dropdownContent={
                            <>
                              {canBorrowEquipment(item) && (
                                <button
                                  className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                  onClick={() => handleOpenBorrowModal(item.id)}
                                >
                                  Mượn thiết bị
                                </button>
                              )}
                              {canReturnEquipment(item) && (
                                <button
                                  className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                  onClick={() => handleOpenReturnModal(item.id)}
                                >
                                  Trả thiết bị
                                </button>
                              )}
                              <button
                                className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                onClick={() => handleOpenHistoryEquipmentModal(item.id)}
                              >
                                Lịch sử thiết bị
                              </button>
                              {canViewBorrowReturnHistory(item) && (
                                <button
                                className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                onClick={() => handleOpenBorrowReturnHistoryModal(item.id)}
                                >
                                  Lịch sử mượn / trả
                                </button>
                              )}
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

      {borrowEquipmentId && (
        <BorrowEquipmentModal
          isOpen={isBorrowModalOpen}
          onClose={handleCloseBorrowModal}
          initialData={{
            id: 0,
            equipmentId: borrowEquipmentId,
            fromDate: new Date(),
            toDate: new Date(),
          } satisfies BorrowEquipmentEntity}
          mode={BorrowEditMode.Create}
          actionCallback={handleRefresh}
        />
      )}

      <ReturnEquipmentModal
        isOpen={isReturnModalOpen}
        onClose={handleCloseReturnModal}
        equipment={selectedBorrowRecord}
        actionCallback={handleRefresh}
      />

      <EquipmentHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={handleCloseHistoryModal}
        equipmentId={historyEquipmentId}
      />

      <EquipmentBorrowReturnHistoryModal
        isOpen={isBorrowReturnHistoryOpen}
        onClose={handleCloseBorrowReturnHistoryModal}
        equipmentId={borrowReturnEquipmentId}
      />
    </div>
  );
}

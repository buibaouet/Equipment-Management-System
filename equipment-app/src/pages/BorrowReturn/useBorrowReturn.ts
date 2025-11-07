import { useState, useCallback, useEffect } from "react";
import { BorrowEditMode, PAGINATION_CONFIG } from "../../utils/enumerations";
import { useGetListBorrowEquipmentPagingMutation } from "../../api/useBorrowEquipmentApi";
import { BorrowEquipmentEntity, BorrowEquipmentPaging } from "../../types/BorrowEquipment";

/**
 * useBorrowReturn encapsulates data, filtering, sorting, pagination, and all handler logic
 * so the UI component can remain presentational.
 */
export default function useBorrowReturn() {
  const [getBorrowEquipmentPaging, { isLoading, error }] = useGetListBorrowEquipmentPagingMutation();

  // Pagination and sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [borrowRecords, setBorrowRecords] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal state
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BorrowEditMode>(BorrowEditMode.Create);
  const [selectedItem, setSelectedItem] = useState<BorrowEquipmentEntity | null>(null);

  // Return modal state
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedReturnItem, setSelectedReturnItem] = useState<BorrowEquipmentPaging | null>(null);

  // Fetch equipment from API
  const fetchBorrowRecords = useCallback(
    async () => {
      try {
        // Ensure param object includes all required properties as per EquipmentPagingParam type
        const param = {
          pageIndex: currentPage,
          pageSize: PAGINATION_CONFIG.PAGE_SIZE,
          orderBy: sortKey ? `${sortKey} ${sortOrder}` : "",
          keyword: '',
        };

        // Call the API with the expected structure
        const response = await getBorrowEquipmentPaging({ param: param }).unwrap();

        if (response.statusCode === 200 && response.data) {
          setBorrowRecords((response.data.data as unknown as any[]) || []);
          setTotalItems(response.data.totalRecords || 0);
          setTotalPages(response.data.totalPages || 0);
        }
      } catch (err) {
        console.error("Error fetching equipment:", err);
      }
    },
    [getBorrowEquipmentPaging, sortKey, sortOrder, currentPage]
  );

  // Fetch equipment when dependencies change
  useEffect(() => {
    fetchBorrowRecords();
  }, [fetchBorrowRecords]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Return handler - opens the return modal
  const openReturnModal = useCallback((item: BorrowEquipmentPaging) => {
    setSelectedReturnItem(item);
    setIsReturnModalOpen(true);
  }, []);

  // Close return modal
  const closeReturnModal = useCallback(() => {
    setIsReturnModalOpen(false);
    setSelectedReturnItem(null);
  }, []);

  // Modal handlers
  const openBorrowModal = useCallback((item: BorrowEquipmentEntity | null, mode: BorrowEditMode) => {
    setSelectedItem(item);
    setModalMode(mode);
    setIsBorrowModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsBorrowModalOpen(false);
    setSelectedItem(null);
    setModalMode(BorrowEditMode.Create);
  }, []);

  return {
    // Data
    borrowRecords: borrowRecords,
    totalItems,
    totalPages,
    currentPage,

    // Loading and error states
    isLoading,
    error,

    // Modal state
    isBorrowModalOpen,
    modalMode,
    selectedItem,

    // Return modal state
    isReturnModalOpen,
    selectedReturnItem,

    // Actions
    handlePageChange,
    handleSort,
    fetchBorrowRecords,
    openReturnModal,
    closeReturnModal,
    openBorrowModal,
    closeModal,
  };
}


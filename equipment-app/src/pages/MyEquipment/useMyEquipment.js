import React from "react";
import { PAGINATION_CONFIG } from "../../utils/enumerations";
import { useGetListMyEquipmentPagingMutation } from "../../api/useEquipmentApi";
import { useGetListBorrowEquipmentPagingMutation } from "../../api/useBorrowEquipmentApi";
import { BorrowEquipmentStatusEnum } from "../../utils/enumerations";

/**
 * useMyEquipment encapsulates data, filtering, sorting and pagination logic
 * so the UI component can remain presentational.
 */
export default function useMyEquipment() {
  const [getMyEquipmentPaging, { isLoading, error }] = useGetListMyEquipmentPagingMutation();
  const [getBorrowEquipmentPaging] = useGetListBorrowEquipmentPagingMutation();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortKey, setSortKey] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("asc");
  const [keyword, setKeyword] = React.useState("");
  const [equipments, setEquipments] = React.useState([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [borrowRecords, setBorrowRecords] = React.useState([]);

  // Fetch equipment from API
  const fetchMyEquipments = React.useCallback(async (pageOverride = null) => {
    try {
      const activePage = pageOverride !== null ? pageOverride : currentPage;

      const param = {
        pageIndex: activePage,
        pageSize: PAGINATION_CONFIG.PAGE_SIZE,
        orderBy: sortKey ? `${sortKey} ${sortOrder}` : '',
        keyword: keyword,
      };

      // Call the API
      const response = await getMyEquipmentPaging({ param }).unwrap();

      if (response.statusCode === 200 && response.data) {
        setEquipments(response.data.data || []);
        setTotalItems(response.data.totalRecords || 0);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (err) {
      console.error('Error fetching my equipment:', err);
    }
  }, [getMyEquipmentPaging, sortKey, sortOrder, keyword, currentPage]);

  // Fetch borrow records to get borrow equipment IDs
  const fetchBorrowRecords = React.useCallback(async () => {
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
  }, [getBorrowEquipmentPaging]);

  // Create a map of equipmentId -> borrowRecord for quick lookup
  const borrowRecordMap = React.useMemo(() => {
    const map = new Map();
    borrowRecords.forEach(record => {
      if (record.status === BorrowEquipmentStatusEnum.Borrowed) {
        map.set(record.equipmentId, record);
      }
    });
    return map;
  }, [borrowRecords]);

  // Fetch equipment when dependencies change
  React.useEffect(() => {
    fetchMyEquipments();
  }, [fetchMyEquipments]);

  // Fetch borrow records on mount
  React.useEffect(() => {
    fetchBorrowRecords();
  }, [fetchBorrowRecords]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return {
    // Data
    currentData: equipments,
    totalItems,
    totalPages,
    currentPage,
    borrowRecordMap,

    // Loading and error states
    isLoading,
    error,

    // Actions
    handlePageChange,
    handleSort,
    fetchMyEquipments,

    // Sort state
    sortKey,
    sortOrder,
  };
}



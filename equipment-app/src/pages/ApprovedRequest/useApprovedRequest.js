import React from "react";
import { PAGINATION_CONFIG } from "../../utils/enumerations";
import {
  useGetRequestBorrowEquipmentPagingMutation,
  useApproveRequestBorrowEquipmentMutation,
  useRejectRequestBorrowEquipmentMutation
} from "../../api/useBorrowEquipmentApi";

/**
 * useApprovedRequest encapsulates data, filtering, sorting and pagination logic
 * so the UI component can remain presentational.
 */
export default function useApprovedRequest() {
  const [getRequestBorrowEquipmentPaging, { isLoading, error }] = useGetRequestBorrowEquipmentPagingMutation();
  const [approveRequest, { isLoading: isApproving }] = useApproveRequestBorrowEquipmentMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectRequestBorrowEquipmentMutation();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortKey, setSortKey] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("asc");
  const [keyword, setKeyword] = React.useState("");
  const [requests, setRequests] = React.useState([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);

  // Fetch request borrow equipment from API
  const fetchRequestBorrowEquipments = React.useCallback(async (pageOverride = null) => {
    try {
      const activePage = pageOverride !== null ? pageOverride : currentPage;

      const param = {
        pageIndex: activePage,
        pageSize: PAGINATION_CONFIG.PAGE_SIZE,
        orderBy: sortKey ? `${sortKey} ${sortOrder}` : '',
        keyword: keyword,
      };

      // Call the API
      const response = await getRequestBorrowEquipmentPaging({ param }).unwrap();

      if (response.statusCode === 200 && response.data) {
        setRequests(response.data.data || []);
        setTotalItems(response.data.totalRecords || 0);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (err) {
      console.error('Error fetching request borrow equipment:', err);
    }
  }, [getRequestBorrowEquipmentPaging, sortKey, sortOrder, keyword, currentPage]);

  // Fetch requests when dependencies change
  React.useEffect(() => {
    fetchRequestBorrowEquipments();
  }, [fetchRequestBorrowEquipments]);

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

  const handleApprove = async (id) => {
    try {
      const response = await approveRequest({ id }).unwrap();
      if (response.statusCode === 200 && response.data) {
        // Refresh the list after successful approval
        toast.success("Duyệt yêu cầu thành công");
        await fetchRequestBorrowEquipments();
      }
      else if (response.statusCode !== 200) {
        toast.error(response.message || "Có lỗi xảy ra khi duyệt yêu cầu");
      }
    } catch (err) {
      toast.error(error?.message || "Có lỗi xảy ra khi duyệt yêu cầu");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await rejectRequest({ id }).unwrap();
      if (response.statusCode === 200 && response.data) {
        // Refresh the list after successful rejection
        toast.success("Từ chối yêu cầu thành công");
        await fetchRequestBorrowEquipments();
      }
      else if (response.statusCode !== 200) {
        toast.error(response.message || "Có lỗi xảy ra khi từ chối yêu cầu");
      }
    } catch (err) {
      toast.error(error?.message || "Có lỗi xảy ra khi từ chối yêu cầu");
    }
  };

  return {
    // Data
    currentData: requests,
    totalItems,
    totalPages,
    currentPage,

    // Loading and error states
    isLoading: isLoading || isApproving || isRejecting,
    error,

    // Actions
    handlePageChange,
    handleSort,
    handleApprove,
    handleReject,

    // Sort state
    sortKey,
    sortOrder,
  };
}



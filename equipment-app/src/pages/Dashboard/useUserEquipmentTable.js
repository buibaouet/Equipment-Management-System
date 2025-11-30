import React, { useCallback } from "react";
import { useGetTableRankingTopMutation } from '../../api/useDashboardApi';
import { PAGINATION_CONFIG } from "../../utils/enumerations";

export default function useUserEquipmentTable() {
  const [getTableRankingTop, { isLoading, error }] = useGetTableRankingTopMutation();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortKey, setSortKey] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("asc");
  const [rankingData, setRankingData] = React.useState([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);

  // Fetch ranking data from API
  const fetchRankingData = useCallback(async () => {
    try {
      const param = {
        orderBy: sortKey ? `${sortKey} ${sortOrder}` : '',
        keyword: '',
        pageIndex: currentPage,
        pageSize: PAGINATION_CONFIG.PAGE_SIZE
      };

      const response = await getTableRankingTop({ param }).unwrap();

      if (response.statusCode === 200 && response.data) {
        setRankingData(response.data.data || []);
        setTotalItems(response.data.totalRecords || 0);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (err) {
      console.error('Error fetching ranking data:', err);
    }
  }, [getTableRankingTop, sortKey, sortOrder, currentPage]);

  // Fetch ranking data when dependencies change
  React.useEffect(() => {
    fetchRankingData();
  }, [fetchRankingData]);

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
    rankingData,
    totalItems,
    totalPages,
    currentPage,

    // Loading and error states
    isLoading,
    error,

    // Actions
    handlePageChange,
    handleSort,
    refreshRankingData: fetchRankingData,

    // Sort state
    sortKey,
    sortOrder,
  };
}


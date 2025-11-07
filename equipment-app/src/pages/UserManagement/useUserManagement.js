import React from "react";
import { useGetListUserPagingMutation } from '../../api/useUserApi'
import { PAGINATION_CONFIG } from '../../utils/enumerations'

/**
 * useUserManagement encapsulates data, filtering, sorting and pagination logic
 * so the UI component can remain presentational.
 */
export default function useUserManagement() {
  const [getListUserPaging, { isLoading, error }] = useGetListUserPagingMutation();
  
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortKey, setSortKey] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("asc");
  const [keyword, setKeyword] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);

  // Fetch users from API
  const fetchUsers = React.useCallback(async () => {
    try {
      const param = {
        orderBy: sortKey ? `${sortKey} ${sortOrder}` : '',
        keyword: keyword,
        pageIndex: currentPage,
        pageSize: PAGINATION_CONFIG.PAGE_SIZE
      };
      
      const response = await getListUserPaging({ param }).unwrap();
      
      if (response.statusCode === 200 && response.data) {
        setUsers(response.data.data || []);
        setTotalItems(response.data.totalRecords || 0);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }, [getListUserPaging, sortKey, sortOrder, keyword, currentPage]);

  // Fetch users when dependencies change
  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  const handleSearch = (searchKeyword) => {
    setKeyword(searchKeyword);
    setCurrentPage(1); // Reset to first page when searching
  };

  return {
    // Data
    users,
    totalItems,
    totalPages,
    currentPage,
    
    // Loading and error states
    isLoading,
    error,
    
    // Actions
    handlePageChange,
    handleSort,
    handleSearch,
    refreshUsers: fetchUsers,
    
    // Sort state
    sortKey,
    sortOrder,
  };
}



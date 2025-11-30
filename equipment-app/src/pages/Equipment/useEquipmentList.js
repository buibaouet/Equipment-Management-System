import React from "react";
import { PAGINATION_CONFIG } from "../../utils/enumerations";
import { useGetListEquipmentPagingMutation } from "../../api/useEquipmentApi";

/**
 * useEquipmentList encapsulates data, filtering, sorting and pagination logic
 * so the UI component can remain presentational.
 * }}
 */
export default function useEquipmentList() {
  const [getEquipmentPaging, { isLoading, error }] = useGetListEquipmentPagingMutation();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortKey, setSortKey] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("asc");
  const [keyword, setKeyword] = React.useState("");
  const [equipments, setEquipments] = React.useState([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [showFilter, setShowFilter] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState(undefined);
  const [departmentId, setDepartmentId] = React.useState(undefined);
  const [status, setStatus] = React.useState(undefined);
  const [userId, setUserId] = React.useState(undefined);

  // Fetch users from API
  const fetchEquipments = React.useCallback(async (filters = null, pageOverride = null) => {
    try {
      // Use provided filters or current state
      const activeCategoryId = filters?.categoryId !== undefined ? filters.categoryId : categoryId;
      const activeDepartmentId = filters?.departmentId !== undefined ? filters.departmentId : departmentId;
      const activeStatus = filters?.status !== undefined ? filters.status : status;
      const activeUserId = filters?.userId !== undefined ? filters.userId : userId;
      const activePage = pageOverride !== null ? pageOverride : currentPage;

      // Ensure param object includes all required properties as per EquipmentPagingParam type
      const fullParam = {
        paramPaging: {
          pageIndex: activePage,
          pageSize: PAGINATION_CONFIG.PAGE_SIZE,
          orderBy: sortKey ? `${sortKey} ${sortOrder}` : '',
          keyword: keyword,
        },
        departmentId: activeDepartmentId ? Number(activeDepartmentId) : undefined,
        categoryId: activeCategoryId ? Number(activeCategoryId) : undefined,
        status: activeStatus ? Number(activeStatus) : undefined,
        ownerId: activeUserId ? Number(activeUserId) : undefined,
      };

      // Call the API with the expected structure
      const response = await getEquipmentPaging({ param: fullParam }).unwrap();

      if (response.statusCode === 200 && response.data) {
        setEquipments(response.data.data || []);
        setTotalItems(response.data.totalRecords || 0);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }, [getEquipmentPaging, sortKey, sortOrder, keyword, currentPage, categoryId, departmentId, status, userId]);

  // Fetch users when dependencies change
  React.useEffect(() => {
    fetchEquipments();
  }, [fetchEquipments]);

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

  const handleApplyFilter = React.useCallback((filters) => {
    // Update filter state
    setCategoryId(filters?.categoryId || undefined);
    setDepartmentId(filters?.departmentId || undefined);
    setStatus(filters?.status || undefined);
    setUserId(filters?.userId || undefined);
    // Reset to first page when applying filters and fetch with new filters
    setCurrentPage(1);
    fetchEquipments(filters, 1);
  }, [fetchEquipments]);

  return {
    // Data
    equipments,
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
    fetchEquipments: fetchEquipments,
    handleApplyFilter,

    //filter
    showFilter,
    setShowFilter,
    categoryId,
    departmentId,
    status,
    userId,
    
    // Sort state
    sortKey,
    sortOrder,
  };
}



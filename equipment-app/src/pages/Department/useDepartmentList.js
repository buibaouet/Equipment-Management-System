import React from "react";
import { useGetListDepartmentPagingMutation, useUpdateDepartmentStatusMutation } from '../../api/useDepartmentApi';
import { PAGINATION_CONFIG } from '../../utils/enumerations';
import { toast } from "sonner";

/**
 * useDepartmentList encapsulates data, filtering, sorting and pagination logic
 * so the UI component can remain presentational.
 */
export default function useDepartmentList() {
  const [getListDepartmentPaging, { isLoading, error }] = useGetListDepartmentPagingMutation();
  const [updateDepartmentStatus] = useUpdateDepartmentStatusMutation();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortKey, setSortKey] = React.useState("code");
  const [sortOrder, setSortOrder] = React.useState("asc");
  const [departments, setDepartments] = React.useState([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);

  // Fetch departments from API
  const fetchDepartments = React.useCallback(async () => {
    try {
      const param = {
        orderBy: sortKey ? `${sortKey} ${sortOrder}` : '',
        keyword: '',
        pageIndex: currentPage,
        pageSize: PAGINATION_CONFIG.PAGE_SIZE
      };

      const response = await getListDepartmentPaging({ param }).unwrap();

      if (response.statusCode === 200 && response.data) {
        setDepartments(response.data.data || []);
        setTotalItems(response.data.totalRecords || 0);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  }, [getListDepartmentPaging, sortKey, sortOrder, currentPage]);

  // Fetch departments when dependencies change
  React.useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

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

  const handleActiveDepartment = async (department) => {
    try {
      const response = await updateDepartmentStatus({ departmentId: department.id }).unwrap();

      if (response.statusCode === 200 && response.data) {
        toast.success('Cập nhật trạng thái phòng ban thành công');
        fetchDepartments();
      } else {
        toast.error(response.message || 'Cập nhật trạng thái phòng ban thất bại');
      }
    } catch (err) {
      toast.error(err.data || 'Cập nhật trạng thái phòng ban thất bại');
    };
  };

  return {
    // Data
    departments,
    totalItems,
    totalPages,
    currentPage,

    // Loading and error states
    isLoading,
    error,

    // Actions
    handlePageChange,
    handleSort,
    refreshDepartments: fetchDepartments,
    handleActiveDepartment: handleActiveDepartment,
  };
}



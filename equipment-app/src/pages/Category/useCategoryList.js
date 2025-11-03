import React, { useCallback } from "react";
import { useGetListCategoryPagingMutation, useUpdateCategoryStatusMutation } from '../../api/useCategoryApi';
import { PAGINATION_CONFIG } from "../../utils/enumerations";
import { toast } from "sonner";

export default function useCategoryList() {
  const [getListCategoryPaging, { isLoading, error }] = useGetListCategoryPagingMutation();
  const [updateCategoryStatus] = useUpdateCategoryStatusMutation();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortKey, setSortKey] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("asc");
  const [categories, setCategories] = React.useState([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const param = {
        orderBy: sortKey ? `${sortKey} ${sortOrder}` : '',
        keyword: '',
        pageIndex: currentPage,
        pageSize: PAGINATION_CONFIG.PAGE_SIZE
      };

      const response = await getListCategoryPaging({ param }).unwrap();

      if (response.statusCode === 200 && response.data) {
        setCategories(response.data.data || []);
        setTotalItems(response.data.totalRecords || 0);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, [getListCategoryPaging, sortKey, sortOrder, currentPage]);

  // Fetch categories when dependencies change
  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

  const handleActiveCategory = async (categoryId) => {
    const response = await updateCategoryStatus({ categoryId: categoryId }).unwrap();

    if (response.statusCode === 200 && response.data) {
      toast.success('Cập nhật trạng thái danh mục thành công');
      fetchCategories();
    } else {
      toast.error('Cập nhật trạng thái danh mục thất bại');
    }
  };

  return {
    // Data
    categories,
    totalItems,
    totalPages,
    currentPage,

    // Loading and error states
    isLoading,
    error,

    // Actions
    handlePageChange,
    handleSort,
    refreshCategories: fetchCategories,
    handleActiveCategory: handleActiveCategory,

    // Sort state
    sortKey,
    sortOrder,
  };
}



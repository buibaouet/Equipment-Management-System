import { useMemo, useState, useEffect } from "react";
import { useGetDepartmentListQuery } from "../../api/useDepartmentApi";
import { useGetCategoryListQuery } from "../../api/useCategoryApi";
import { useGetUserListQuery } from "../../api/useUserApi";
import { EquipmentStatusEnum } from "../../utils/enumerations";

interface FilterProps {
  onApplyFilter: (filters: any) => void;
  initialFilters: any;
}

export default function useFilterDropdown({ onApplyFilter, initialFilters }: FilterProps) {
  const { data: departmentData } = useGetDepartmentListQuery({});
  const { data: categoryData } = useGetCategoryListQuery({});
  const { data: userData } = useGetUserListQuery();

  const [filterValue, setFilterValue] = useState(initialFilters);

  useEffect(() => {
    setFilterValue(initialFilters);
  }, [initialFilters]);

  const changeValueFilter = (key: string, value: string) => {
    setFilterValue((prev: any) => ({ ...prev, [key]: value || undefined }));
  };

  const cleanFilter = () => {
    const clearedFilters = {
      categoryId: undefined,
      departmentId: undefined,
      status: undefined,
      userId: undefined,
    };
    setFilterValue(clearedFilters);
    // Call onApplyFilter to reload data with cleared filters
    onApplyFilter(clearedFilters);
  };

  const applyFilter = () => {
    onApplyFilter(filterValue);
  };

  // Get department options for dropdown
  const departmentOptions = useMemo(() => {
    if (!departmentData?.data) return [];
    return departmentData.data.map((dept) => ({
      value: String(dept.id),
      label: dept.name,
    }));
  }, [departmentData]);

  // Get category options for dropdown
  const categoryOptions = useMemo(() => {
    if (!categoryData?.data) return [];
    return categoryData.data.map((cate) => ({
      value: String(cate.id),
      label: cate.name,
    }));
  }, [categoryData]);

  // Get status options for dropdown
  const statusOptions = useMemo(() => {
    return Object.values(EquipmentStatusEnum).filter(
      v => typeof v === "number"
    ).map((status: number) => ({
      value: String(status),
      label: status === EquipmentStatusEnum.Available ? "Sẵn sàng" :
        status === EquipmentStatusEnum.Borrowed ? "Đang sử dụng" :
          status === EquipmentStatusEnum.Maintenance ? "Bảo trì" :
            status === EquipmentStatusEnum.Liquidation ? "Thanh lý" :
              status === EquipmentStatusEnum.Broken ? "Đã hỏng" :
                "",
    }));
  }, []);

  // Get user options for dropdown
  const userOptions = useMemo(() => {
    if (!userData?.data) return [];
    return userData.data.map((user) => ({
      value: String(user.id),
      label: user.fullName || user.userName,
    }));
  }, [userData]);

  return {
    departmentOptions,
    categoryOptions,
    statusOptions,
    userOptions,
    changeValueFilter,
    cleanFilter,
    applyFilter,
    filterValue,
  };
}

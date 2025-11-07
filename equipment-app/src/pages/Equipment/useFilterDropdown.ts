import { useMemo, useState, useEffect } from "react";
import { useGetDepartmentListQuery } from "../../api/useDepartmentApi";
import { useGetCategoryListQuery } from "../../api/useCategoryApi";
import { EquipmentStatusEnum } from "../../utils/enumerations";

interface FilterProps {
  onApplyFilter: (filters: any) => void;
  initialFilters: any;
}

export default function useFilterDropdown({ onApplyFilter, initialFilters }: FilterProps) {
  const { data: departmentData } = useGetDepartmentListQuery({});
  const { data: categoryData } = useGetCategoryListQuery({});

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
      label: status === EquipmentStatusEnum.Available ? "Còn sử dụng" :
        status === EquipmentStatusEnum.Borrowed ? "Đang mượn" :
          status === EquipmentStatusEnum.Maintenance ? "Đang bảo dưỡng" :
            status === EquipmentStatusEnum.Lost ? "Đã mất" :
              status === EquipmentStatusEnum.BrokenPart ? "Hỏng một phần" :
                status === EquipmentStatusEnum.Broken ? "Đã hỏng" :
                  "",
    }));
  }, [EquipmentStatusEnum]);

  return {
    departmentOptions,
    categoryOptions,
    statusOptions,
    changeValueFilter,
    cleanFilter,
    applyFilter,
    filterValue,
  };
}

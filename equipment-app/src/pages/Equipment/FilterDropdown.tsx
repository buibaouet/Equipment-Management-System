import React from "react";
import { Filter } from "lucide-react";
import Select from "../../components/form/Select";
import useFilterDropdown from "./useFilterDropdown";
import Button from "../../components/ui/button/Button";

const FilterDropdown: React.FC<{
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
  onApplyFilter: (filters: any) => void;
  initialFilters: any;
}> = ({ showFilter, setShowFilter, onApplyFilter, initialFilters }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const {
    departmentOptions,
    categoryOptions,
    statusOptions,
    changeValueFilter,
    cleanFilter,
    applyFilter,
    filterValue,
  } = useFilterDropdown({ onApplyFilter, initialFilters });

  React.useEffect(() => {
    if (!showFilter) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is inside the button container or dropdown panel
      // Since Select dropdowns are inside the dropdown panel, they're automatically included
      const isInsideButton = ref.current?.contains(target);
      const isInsideDropdown = dropdownRef.current?.contains(target);

      // Only close if click is outside both button and dropdown panel
      if (!isInsideButton && !isInsideDropdown) {
        setShowFilter(false);
      }
    };

    // Use a small delay to ensure the event doesn't fire immediately when dropdown opens
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter, setShowFilter]);

  React.useEffect(() => {
    if (showFilter && ref.current && dropdownRef.current) {
      const updatePosition = () => {
        if (!ref.current || !dropdownRef.current) return;

        const buttonRect = ref.current.getBoundingClientRect();
        const dropdown = dropdownRef.current;
        const dropdownWidth = 224; // w-56 = 14rem = 224px
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        // Get actual dropdown height after render
        const dropdownHeight = dropdown.offsetHeight;

        // Position dropdown below by default
        let top: string | number = buttonRect.bottom + 8;
        let bottom: string = 'auto';

        // If not enough space below and more space above, position above
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          top = 'auto';
          bottom = `${viewportHeight - buttonRect.top + 8}px`;
        }

        // Align to right edge of button, but ensure it doesn't go off screen
        let right: string | number = viewportWidth - buttonRect.right;
        let left: string = 'auto';

        // If dropdown would go off screen to the right, align to left edge
        if (right < 0 || buttonRect.right < dropdownWidth) {
          right = 'auto';
          left = `${buttonRect.left}px`;
        }

        dropdown.style.top = typeof top === 'number' ? `${top}px` : top;
        dropdown.style.bottom = bottom;
        dropdown.style.right = typeof right === 'number' ? `${right}px` : right;
        dropdown.style.left = left;
      };

      // Use requestAnimationFrame to ensure dropdown is rendered
      requestAnimationFrame(() => {
        updatePosition();
        // Recalculate after a short delay to get accurate height
        setTimeout(updatePosition, 0);
      });
    }
  }, [showFilter, categoryOptions, departmentOptions]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="shadow-theme-xs flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 sm:w-auto sm:min-w-[100px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        onClick={() => setShowFilter(!showFilter)}
        type="button"
      >
        <Filter className="w-4 h-4" />
        Lọc
      </button>
      {showFilter && (
        <div
          ref={dropdownRef}
          className="fixed z-[9999] w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Danh mục thiết bị
            </label>
            <Select
              key={`category-${filterValue?.categoryId || 'empty'}`}
              options={categoryOptions}
              onChange={(value) => {
                changeValueFilter('categoryId', value);
              }}
              placeholder="Chọn danh mục"
              defaultValue={filterValue?.categoryId || initialFilters?.categoryId || ""}
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Phòng ban
            </label>
            <Select
              key={`department-${filterValue?.departmentId || 'empty'}`}
              options={departmentOptions}
              onChange={(value) => {
                changeValueFilter('departmentId', value);
              }}
              placeholder="Chọn phòng ban"
              defaultValue={filterValue?.departmentId || initialFilters?.departmentId || ""}
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Trạng thái
            </label>
            <Select
              key={`status-${filterValue?.status || 'empty'}`}
              options={statusOptions}
              onChange={(value) => {
                changeValueFilter('status', value);
              }}
              placeholder="Chọn trạng thái"
              defaultValue={filterValue?.status || initialFilters?.status || ""}
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => {
                cleanFilter();
                setShowFilter(false);
              }}
            >
              Bỏ lọc
            </Button>
            <Button
              className="flex-1"
              variant="primary"
              onClick={() => {
                applyFilter();
                setShowFilter(false);
              }}
            >
              Áp dụng
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;



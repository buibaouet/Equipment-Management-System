import React from "react";
import { Filter } from "lucide-react";
import Select from "../../components/form/Select";

const FilterDropdown: React.FC<{
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
}> = ({ showFilter, setShowFilter }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setShowFilter]);

  const options = [
    { value: "marketing", label: "Option 1" },
    { value: "template", label: "Option 2" },
    { value: "development", label: "Option 3" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="shadow-theme-xs flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 sm:w-auto sm:min-w-[100px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        onClick={() => setShowFilter(!showFilter)}
        type="button"
      >
        <Filter className="w-4 h-4"/>
        Lọc
      </button>
      {showFilter && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Danh mục thiết bị
            </label>
            <Select
              options={options}
              placeholder="Chọn danh mục"
              onChange={handleSelectChange}
              defaultValue=""
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Phòng ban
            </label>
            <Select
              options={options}
              placeholder="Chọn phòng ban"
              onChange={handleSelectChange}
              defaultValue=""
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>
          <button className="bg-brand-500 hover:bg-brand-600 h-10 w-full rounded-lg px-3 py-2 text-sm font-medium text-white">
            Áp dụng
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;



import { ChartPeriodType } from "../../utils/enumerations";

type ChartTabProps = {
  selected: ChartPeriodType;
  onChange: (period: ChartPeriodType) => void;
};

const OPTIONS: Array<{ label: string; value: ChartPeriodType }> = [
  { label: "Tuần", value: ChartPeriodType.Week },
  { label: "Tháng", value: ChartPeriodType.Month },
  { label: "Quý", value: ChartPeriodType.Quarter },
];

const ChartTab: React.FC<ChartTabProps> = ({ selected, onChange }) => {
  const getButtonClass = (value: ChartPeriodType) =>
    selected === value
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
            option.value
          )}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ChartTab;

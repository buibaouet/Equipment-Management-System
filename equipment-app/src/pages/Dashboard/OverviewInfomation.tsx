import { useMemo } from "react";
import { useGetDashboardDataQuery } from "../../api/useDashboardApi";

export default function OverviewInfomation() {
  const { data, isFetching } = useGetDashboardDataQuery();
  const totalEquipment = data?.data?.totalEquipment ?? 0;
  const totalBorrow = data?.data?.totalBorrow ?? 0;

  const formatNumber = useMemo(
    () => new Intl.NumberFormat("vi-VN"),
    []
  );

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 xl:p-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Số lượng thiết bị
          </h3>
        </div>

        <h5 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
          {isFetching ? "..." : formatNumber.format(totalEquipment)}
        </h5>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 xl:p-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Thiết bị đang mượn
          </h3>
        </div>

        <h5 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
          {isFetching ? "..." : formatNumber.format(totalBorrow)}
        </h5>
      </div>
    </div>
  );
}

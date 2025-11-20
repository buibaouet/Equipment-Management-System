import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useGetDashboardDataQuery } from "../../api/useDashboardApi";
import { UserRankingTopModel } from "../../types/Dashboard";

export default function UserEquipmentTable() {
  const { data, isFetching } = useGetDashboardDataQuery();
  const tableRowData = data?.data?.userRankingTop ?? [];

  const formatNumber = useMemo(
    () => new Intl.NumberFormat("vi-VN"),
    []
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Thống kê sở hữu thiết bị
          </h3>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <Table>
          <TableHeader className="px-6 py-3 border-t border-gray-100 border-y bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <TableRow>
              <TableCell className="px-4 py-3 font-medium text-gray-500 sm:px-6 text-theme-xs dark:text-gray-400 text-start">
              Người dùng
              </TableCell>
              <TableCell className="px-6 py-3 font-medium text-gray-500 sm:px-6 text-theme-xs dark:text-gray-400 text-start">
                Phòng ban
              </TableCell>
              <TableCell className="px-6 py-3 font-medium text-gray-500 sm:px-6 text-theme-xs dark:text-gray-400 text-start">
                Thiết bị sở hữu
              </TableCell>
              <TableCell className="px-6 py-3 font-medium text-gray-500 sm:px-6 text-theme-xs dark:text-gray-400 text-start">
                Thiết bị mượn
              </TableCell>
              <TableCell className="px-6 py-3 font-medium text-gray-500 sm:px-6 text-theme-xs dark:text-gray-400 text-start">
                Tổng số
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRowData.map((row: UserRankingTopModel) => (
              <TableRow key={row.userId}>
                <TableCell className="px-4 sm:px-6 py-3.5">
                  <p className="text-gray-700 text-theme-sm dark:text-gray-400">
                  {row.userName}
                  </p>
                </TableCell>
                <TableCell className="px-4 sm:px-6 py-3.5">
                  <p className="text-gray-700 text-theme-sm dark:text-gray-400">
                    {row.department}
                  </p>
                </TableCell>
                <TableCell className="px-4 sm:px-6 py-3.5">
                  <p className="text-gray-700 text-theme-sm dark:text-gray-400">
                    {formatNumber.format(row.ownedCount)}
                  </p>
                </TableCell>
                <TableCell className="px-4 sm:px-6 py-3.5">
                  <p className="text-gray-700 text-theme-sm dark:text-gray-400">
                    {formatNumber.format(row.borrowedCount)}
                  </p>
                </TableCell>
                <TableCell className="px-4 sm:px-6 py-3.5">
                  <p className="text-gray-700 text-theme-sm dark:text-gray-400 font-semibold">
                    {formatNumber.format(row.totalCount)}
                  </p>
                </TableCell>
              </TableRow>
            ))}
            {!isFetching && tableRowData.length === 0 && (
              <TableRow>
                <TableCell
                  className="px-4 sm:px-6 py-6 text-center text-sm text-gray-500"
                >
                  Không có dữ liệu bảng xếp hạng.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

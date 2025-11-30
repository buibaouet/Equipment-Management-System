import { useMemo } from "react";
import {
  Table,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import PaginationWithIcon from "../../components/ui/table/PaginationWithIcon";
import TableBodyContent from "../../components/ui/table/TableBodyContent";
import useUserEquipmentTable from "./useUserEquipmentTable";
import { UserRankingTopModel } from "../../types/Dashboard";
import HeaderTable from "../../components/ui/table/HeaderTable";

export default function UserEquipmentTable() {
  const {
    rankingData,
    totalItems,
    totalPages,
    currentPage,
    handlePageChange,
    isLoading,
    handleSort,
  } = useUserEquipmentTable();

  const arrColumns = [
    { key: "userName", label: "Người dùng", sortable: false },
    { key: "department", label: "Phòng ban", sortable: false },
    { key: "ownedCount", label: "Thiết bị sở hữu", sortable: false },
    { key: "borrowedCount", label: "Thiết bị mượn", sortable: false },
    { key: "totalCount", label: "Tổng số", sortable: false },
  ];

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
          <HeaderTable 
            arrColumns={arrColumns} 
            handleSort={handleSort}
            showActionColumn={false} 
          />
          <TableBodyContent
            isLoading={isLoading}
            data={rankingData}
            columns={arrColumns}
            renderRow={(item: UserRankingTopModel, index: number) => (
              <TableRow key={item.userId || index}>
                <TableCell className="px-4 sm:px-6 py-3.5">
                  <p className="text-gray-700 text-theme-sm dark:text-gray-400">
                    {item.userName}
                  </p>
                </TableCell>
                <TableCell className="px-4 sm:px-6 py-3.5">
                  <p className="text-gray-700 text-theme-sm dark:text-gray-400">
                    {item.department}
                  </p>
                </TableCell>
                <TableCell className="px-4 sm:px-6 py-3.5">
                  <p className="text-gray-700 text-theme-sm dark:text-gray-400">
                    {formatNumber.format(item.ownedCount)}
                  </p>
                </TableCell>
                <TableCell className="px-4 sm:px-6 py-3.5">
                  <p className="text-gray-700 text-theme-sm dark:text-gray-400">
                    {formatNumber.format(item.borrowedCount)}
                  </p>
                </TableCell>
                <TableCell className="px-4 sm:px-6 py-3.5">
                  <p className="text-gray-700 text-theme-sm dark:text-gray-400 font-semibold">
                    {formatNumber.format(item.totalCount)}
                  </p>
                </TableCell>
              </TableRow>
            )}
          />
        </Table>
      </div>

      <PaginationWithIcon
        totalPages={totalPages}
        totalItems={totalItems}
        initialPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

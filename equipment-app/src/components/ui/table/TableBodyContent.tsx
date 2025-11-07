import React from "react";
import { TableBody, TableRow } from "./index";

interface TableBodyContentProps<T> {
  isLoading?: boolean;
  data: T[];
  columns: Array<{ key: string; label: string; sortable?: boolean }>;
  renderRow: (item: T, index: number) => React.ReactNode;
  loadingMessage?: string;
  noDataMessage?: string;
  actionColumnCount?: number; // Number of action columns (default: 1)
}

export default function TableBodyContent<T>({
  isLoading = false,
  data,
  columns,
  renderRow,
  loadingMessage = "Đang tải dữ liệu...",
  noDataMessage = "Không có dữ liệu",
  actionColumnCount = 1,
}: TableBodyContentProps<T>) {
  const totalColumns = columns.length + actionColumnCount;

  return (
    <TableBody>
      {isLoading ? (
        <TableRow>
          <td
            colSpan={totalColumns}
            className="px-4 py-12 text-center border border-gray-100 dark:border-white/[0.05]"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {loadingMessage}
              </p>
            </div>
          </td>
        </TableRow>
      ) : data.length === 0 ? (
        <TableRow>
          <td
            colSpan={totalColumns}
            className="px-4 py-12 text-center border border-gray-100 dark:border-white/[0.05]"
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {noDataMessage}
            </p>
          </td>
        </TableRow>
      ) : (
        data.map((item, index) => renderRow(item, index))
      )}
    </TableBody>
  );
}


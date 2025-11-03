"use client";

import {
  ArrowUpDownIcon
} from "lucide-react";
import { TableCell, TableHeader, TableRow } from ".";
import { ColumnHeader } from "../../../types/Common";

interface PaginationProps {
  arrColumns: ColumnHeader[];
  handleSort: (key: string) => void;
}

export default function HeaderTable({
  arrColumns,
  handleSort,
}: PaginationProps) {
  return (
    <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
      <TableRow>
        {arrColumns.map(({ key, label, sortable }) => (
          <TableCell
            key={key}
            isHeader
            className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
          >
            {sortable ? (
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => handleSort(key)}
              >
                <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                  {label}
                </p>
                <button className="text-gray-500">
                  <ArrowUpDownIcon className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                {label}
              </p>
            )}
          </TableCell>
        ))}
        <TableCell
          isHeader
          className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
        >
          <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
            Thao tác
          </p>
        </TableCell>
      </TableRow>
    </TableHeader>
  );
}

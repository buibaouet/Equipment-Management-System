import Button from "../../components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import PaginationWithIcon from "../../components/ui/table/PaginationWithIcon";
import {
  Pencil,
  Trash2Icon,
  RotateCcwIcon,
  HardDriveDownload,
  SeparatorHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router";
import Badge from "../../components/ui/badge/Badge";
import useBorrowReturn from "./useBorrowReturn";
import PageMeta from "../../components/common/PageMeta";


type SortKey = "name" | "position" | "location" | "age" | "date" | "salary";


export default function BorrowReturn() {
  const navigate = useNavigate();
  const {
    handleSort,
    currentPage,
    handlePageChange,
    totalItems,
    totalPages,
    currentData
  } = useBorrowReturn();

  const arrColumns = [
    { key: "code", label: "Mã thiết bị" },
    { key: "name", label: "Tên thiết bị" },
    { key: "categoryName", label: "Loại thiết bị" },
    { key: "price", label: "Giá trị" },
    { key: "departmentName", label: "Phòng ban" },
    { key: "owner", label: "Người sở hữu" },
    { key: "status", label: "Trạng thái" },
  ];


  return (
    <div>
      <PageMeta
        title="Mượn trả thiết bị"
        description="Mượn trả thiết bị"
      />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Mượn trả thiết bị
            </h3>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">
              Trả thiết bị
              <RotateCcwIcon className="w-5 h-5" />
            </Button>

            <Button variant="primary">
              <HardDriveDownload className="w-5 h-5" />
              Mượn thiết bị
            </Button>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div>
            <Table>
              <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {arrColumns.map(({ key, label }) => (
                    <TableCell
                      key={key}
                      isHeader
                      className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                    >
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => handleSort(key as SortKey)}
                      >
                        <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                          {label}
                        </p>
                        <button className="text-gray-500">
                          <SeparatorHorizontal className="h-3 w-3" />
                        </button>
                      </div>
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
              <TableBody>
                {currentData.map((item: any, i: number) => (
                  <TableRow key={i + 1}>
                    <TableCell className="px-4 py-4 font-medium text-gray-800 border border-gray-100 dark:border-white/[0.05] dark:text-white text-theme-sm whitespace-nowrap ">
                      {item["name"]}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.position}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.location}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border dark:border-white/[0.05] border-gray-100 text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.age}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100  dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.date}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100  dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.salary}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                      <Badge
                        size="sm"
                        color={
                          item.age < 30
                            ? "success"
                            : item.age < 50
                              ? "warning"
                              : "error"
                        }
                      >
                        {"item.status"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap ">
                      <div className="flex items-center w-full gap-2">
                        <Pencil
                          className="w-4 h-4 cursor-pointer hover:text-gray"
                          onClick={() => navigate('/equipment-detail')}
                        />
                        <Trash2Icon className="w-4 h-4 cursor-pointer hover:text-error-500" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <PaginationWithIcon
          totalPages={totalPages}
          totalItems={totalItems}
          initialPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

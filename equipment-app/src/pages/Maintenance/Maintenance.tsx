import Button from "../../components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import PaginationWithIcon from "../../components/tables/DataTables/PaginationWithIcon";
import {
  Pencil,
  Trash2Icon,
  SeparatorHorizontal,
  Wrench
} from "lucide-react";
import { useNavigate } from "react-router";
import Badge from "../../components/ui/badge/Badge";
import useMaintenance from "./useMaintenance";
import PageMeta from "../../components/common/PageMeta";


type SortKey = "name" | "position" | "location" | "age" | "date" | "salary";


export default function Maintenance() {
  const navigate = useNavigate();
  const {
    handleSort,
    currentPage,
    handlePageChange,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    currentData
  } = useMaintenance();

  const arrColumns = [
    { key: "type", label: "Loại" },
    { key: "code", label: "Mã thiết bị" },
    { key: "name", label: "Tên thiết bị" },
    { key: "categoryName", label: "Loại thiết bị" },
    { key: "price", label: "Giá trị" },
    { key: "departmentName", label: "Phòng ban" },
    { key: "owner", label: "Người sở hữu" },
    { key: "startDate", label: "Ngày bắt đầu" },
    { key: "finishDate", label: "Ngày kết thúc" },
  ];

  return (
    <div>
      <PageMeta
        title="Bảo dưỡng thiết bị"
        description="Bảo dưỡng thiết bị"
      />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Bảo dưỡng thiết bị
            </h3>
          </div>

          <div className="flex gap-3">
            <Button variant="primary">
              <Wrench className="w-5 h-5" />
              Thêm mới
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
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                      <Badge
                        size="sm"
                        color="info"
                      >
                        {"Bảo dưỡng"}
                      </Badge>
                    </TableCell>
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
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100  dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.date}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100  dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.salary}
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

        <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
            {/* Left side: Showing entries */}
            <div className="pb-3 xl:pb-0">
              <p className="pb-3 text-sm font-medium text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">
                Từ {startIndex + 1} đến {endIndex} của {totalItems} bản ghi
              </p>
            </div>

            <PaginationWithIcon
              totalPages={totalPages}
              initialPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

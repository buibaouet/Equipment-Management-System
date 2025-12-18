import { useMemo, useState } from "react";
import {
  Table,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import PaginationWithIcon from "../../components/ui/table/PaginationWithIcon";
import TableBodyContent from "../../components/ui/table/TableBodyContent";
import HeaderTable from "../../components/ui/table/HeaderTable";
import ChartTab from "../../components/common/ChartTab";
import { ChartPeriodType } from "../../utils/enumerations";
import { useGetLoanRequestReportMutation } from "../../api/useDashboardApi";
import { LoanRequestReportModel } from "../../types/Dashboard";
import { PAGINATION_CONFIG } from "../../utils/enumerations";

const columns = [
  { key: "equipmentCode", label: "Mã thiết bị", sortable: false },
  { key: "equipmentName", label: "Tên thiết bị", sortable: false },
  { key: "categoryName", label: "Danh mục", sortable: false },
  { key: "departmentName", label: "Phòng ban", sortable: false },
  { key: "ownerName", label: "Phụ trách", sortable: false },
  { key: "borrowerName", label: "Người mượn", sortable: false },
  { key: "approvedDate", label: "Ngày duyệt", sortable: false },
  { key: "loanDate", label: "Ngày mượn / trả", sortable: false },
  { key: "status", label: "Trạng thái", sortable: false },
];

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
};

const formatStatus = (status: number) => {
  switch (status) {
    case 1:
      return "Đang mượn";
    case 3:
      return "Đã trả";
    default:
      return "Không xác định";
  }
};

export default function LoanRequestReportTable() {
  const [periodType, setPeriodType] = useState<ChartPeriodType>(
    ChartPeriodType.Month
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<LoanRequestReportModel[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [getReport, { isLoading }] = useGetLoanRequestReportMutation();

  const fetchData = async (
    nextPeriodType: ChartPeriodType,
    page: number
  ) => {
    const param = {
      orderBy: "",
      keyword: "",
      pageIndex: page,
      pageSize: PAGINATION_CONFIG.PAGE_SIZE,
    };

    const res = await getReport({
      periodType: nextPeriodType,
      param,
    }).unwrap();

    if (res.statusCode === 200 && res.data) {
      setData(res.data.data || []);
      setTotalItems(res.data.totalRecords || 0);
      setTotalPages(res.data.totalPages || 0);
    }
  };

  const handleChangePeriod = async (type: ChartPeriodType) => {
    setPeriodType(type);
    setCurrentPage(1);
    await fetchData(type, 1);
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchData(periodType, page);
  };

  // initial load
  useMemo(() => {
    fetchData(periodType, currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Báo cáo phiếu mượn thiết bị
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Chỉ hiển thị yêu cầu đã duyệt, đang mượn hoặc đã trả
          </p>
        </div>
        <ChartTab selected={periodType} onChange={handleChangePeriod} />
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <Table>
          <HeaderTable
            arrColumns={columns}
            handleSort={() => {}}
            showActionColumn={false}
          />
          <TableBodyContent
            isLoading={isLoading}
            data={data}
            columns={columns}
            renderRow={(item: LoanRequestReportModel, index: number) => (
              <TableRow key={item.id || index}>
                <TableCell className="px-4 sm:px-6 py-3.5 text-theme-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                  {item.equipmentCode}
                </TableCell>
                <TableCell className="px-4 sm:px-6 py-3.5 text-theme-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                  {item.equipmentName}
                </TableCell>
                <TableCell className="px-4 sm:px-6 py-3.5 text-theme-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {item.categoryName}
                </TableCell>
                <TableCell className="px-4 sm:px-6 py-3.5 text-theme-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {item.departmentName || "-"}
                </TableCell>
                <TableCell className="px-4 sm:px-6 py-3.5 text-theme-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {item.ownerName || "-"}
                </TableCell>
                <TableCell className="px-4 sm:px-6 py-3.5 text-theme-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {item.borrowerName}
                </TableCell>
                <TableCell className="px-4 sm:px-6 py-3.5 text-theme-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {formatDate(item.approvedDate)}
                </TableCell>
                <TableCell className="px-4 sm:px-6 py-3.5 text-theme-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {`${formatDate(item.fromDate)} - ${formatDate(item.returnedDate || item.toDate)}`}
                </TableCell>
                <TableCell className="px-4 sm:px-6 py-3.5 text-theme-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {formatStatus(item.status)}
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



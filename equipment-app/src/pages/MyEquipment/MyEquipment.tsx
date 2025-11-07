import {
  Table,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import PaginationWithIcon from "../../components/ui/table/PaginationWithIcon";
import {
  EyeIcon,
  RotateCcwIcon,
} from "lucide-react";
import Badge from "../../components/ui/badge/Badge";
import useMyEquipment from "./useMyEquipment";
import PageMeta from "../../components/common/PageMeta";
import { EquipmentStatusEnum } from "../../utils/enumerations";
import TableBodyContent from "../../components/ui/table/TableBodyContent";
import HeaderTable from "../../components/ui/table/HeaderTable";
import { useState } from "react";
import EquipmentModal from "../Equipment/EquipmentModal";

export default function MyEquipment() {
  const {
    handleSort,
    currentPage,
    handlePageChange,
    totalItems,
    totalPages,
    currentData,
    isLoading,
  } = useMyEquipment();

  const arrColumns = [
    { key: "isBorrow", label: "Loại", sortable: false },
    { key: "code", label: "Mã thiết bị", sortable: true },
    { key: "name", label: "Tên thiết bị", sortable: true },
    { key: "categoryName", label: "Loại thiết bị", sortable: false },
    { key: "price", label: "Giá trị", sortable: true },
    { key: "status", label: "Trạng thái", sortable: false },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);
  const handleOpenModal = (equipmentId: number) => {
    setSelectedEquipmentId(equipmentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getStatusLabel = (status: EquipmentStatusEnum) => {
    switch (status) {
      case EquipmentStatusEnum.Available:
        return "Còn sử dụng";
      case EquipmentStatusEnum.Borrowed:
        return "Đang mượn";
      case EquipmentStatusEnum.Maintenance:
        return "Đang bảo dưỡng";
      case EquipmentStatusEnum.Lost:
        return "Đã mất";
      case EquipmentStatusEnum.BrokenPart:
        return "Hỏng một phần";
      case EquipmentStatusEnum.Broken:
        return "Đã hỏng";
      default:
        return "";
    }
  };

  const getStatusColor = (status: EquipmentStatusEnum) => {
    switch (status) {
      case EquipmentStatusEnum.Available:
        return "success";
      case EquipmentStatusEnum.Borrowed:
        return "info";
      case EquipmentStatusEnum.Maintenance:
        return "primary";
      case EquipmentStatusEnum.Lost:
        return "dark";
      case EquipmentStatusEnum.BrokenPart:
        return "warning";
      case EquipmentStatusEnum.Broken:
        return "error";
      default:
        return "dark";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };


  return (
    <div>
      <PageMeta
        title="Thiết bị của tôi"
        description="Thiết bị của tôi"
      />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Thiết bị của tôi
            </h3>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div>
            <Table>
              <HeaderTable arrColumns={arrColumns} handleSort={handleSort} />
              <TableBodyContent
                isLoading={isLoading}
                data={currentData}
                columns={arrColumns}
                renderRow={(item: any, index: number) => (
                  <TableRow key={index + 1}>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                      {(
                        <Badge
                          size="sm"
                          color={item.isBorrow ? "warning" : "success"}
                        >
                          {item.isBorrow ? "Thiết bị mượn" : "Thiết bị sở hữu"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-medium text-gray-800 border border-gray-100 dark:border-white/[0.05] dark:text-white text-theme-sm whitespace-nowrap ">
                      {item.code}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.name}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.categoryName}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border dark:border-white/[0.05] border-gray-100 text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {formatPrice(item.price)}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                      {item.isBorrow
                        ? (
                          <Badge
                            size="sm"
                            color={item.remainingDays < 0 ? "error" : item.remainingDays <= 3 ? "warning" : "info"}
                          >
                            {item.remainingDays >= 0 ? `Còn ${item.remainingDays} ngày` : `Quá hạn ${Math.abs(item.remainingDays)} ngày`}
                          </Badge>
                        )
                        : (
                          <Badge
                            size="sm"
                            color={getStatusColor(item.status)}
                          >
                            {getStatusLabel(item.status)}
                          </Badge>
                        )}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap ">
                      <div className="flex items-center justify-center w-full gap-2">
                        <span title="Xem">
                          <EyeIcon className="w-4 h-4 cursor-pointer hover:text-gray"
                            onClick={() => handleOpenModal(item.id)}
                          />
                        </span>
                        {item.isBorrow && (<span title="Trả">
                          <RotateCcwIcon className="w-4 h-4 cursor-pointer hover:text-gray"
                          // onClick={() => handleReturnEquipment(item.id)}
                          />
                        </span>)}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              />
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

      <EquipmentModal
        id={selectedEquipmentId ?? 0}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div >
  );
}

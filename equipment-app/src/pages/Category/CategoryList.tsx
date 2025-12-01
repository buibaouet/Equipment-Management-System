import { useState } from "react";
import Button from "../../components/ui/button/Button";
import {
  Table,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import PaginationWithIcon from "../../components/ui/table/PaginationWithIcon";
import {
  Pencil,
  PlusCircle,
  PauseCircleIcon,
  PlayCircleIcon,
  Eye,
  Trash2
} from "lucide-react";
import Badge from "../../components/ui/badge/Badge";
import useCategoryList from "./useCategoryList";
import PageMeta from "../../components/common/PageMeta";
import HeaderTable from "../../components/ui/table/HeaderTable";
import CategoryModal from "./CategoryModal";
import { CategoryEntity } from "../../types/Category";
import TableBodyContent from "../../components/ui/table/TableBodyContent";
import { useAuth } from "../../hooks/useAuth";
import { RoleEnum } from "../../utils/enumerations";
import { useDeleteCategoryMutation } from "../../api/useCategoryApi";
import ConfirmModal from "../../components/common/ConfirmModal";
import { toast } from "sonner";

export default function CategoryList() {
  const {
    handleSort,
    currentPage,
    handlePageChange,
    totalItems,
    totalPages,
    categories: currentData,
    refreshCategories,
    handleActiveCategory,
    isLoading
  } = useCategoryList();
  const { currentUser, isAdmin } = useAuth();
  const isSupervisor = currentUser?.role === RoleEnum.Supervisor;
  const [deleteCategory] = useDeleteCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryEntity | null>(null);

  const handleOpenModal = () => {
    setSelectedCategory(null); // Clear selected category for "Add new"
    setIsModalOpen(true);
  };

  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditCategory = (category: CategoryEntity) => {
    setSelectedCategory(category);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleViewCategory = (category: CategoryEntity) => {
    setSelectedCategory(category);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setIsViewMode(false);
  };

  const handleOpenDeleteModal = (category: CategoryEntity) => {
    setCategoryToDelete({ id: category.id, name: category.name });
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      const response = await deleteCategory({ id: categoryToDelete.id }).unwrap();
      if (response.statusCode === 200) {
        toast.success("Xóa danh mục thành công");
        refreshCategories();
      } else {
        toast.error(response.message || "Có lỗi xảy ra khi xóa danh mục");
      }
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error
        ? String((error as { data?: string }).data || "Có lỗi xảy ra khi xóa danh mục")
          : undefined;
      toast.error(message);
    } finally {
      setIsDeleting(false);
      handleCloseDeleteModal();
    }
  };

  const arrColumns = [
    { key: "code", label: "Mã danh mục", sortable: true },
    { key: "name", label: "Tên danh mục", sortable: true },
    { key: "quantity", label: "Số lượng thiết bị", sortable: false },
    { key: "isActive", label: "Trạng thái", sortable: true },
  ];

  return (
    <div>
      <PageMeta
        title="Danh mục thiết bị"
        description="Danh mục thiết bị"
      />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Danh mục thiết bị
            </h3>
          </div>

          <div className="flex gap-3">
            {!isSupervisor && (
              <Button variant="primary" onClick={handleOpenModal}>
                <PlusCircle className="w-5 h-5" />
                Thêm mới
              </Button>
            )}
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
                    <TableCell className="px-4 py-4 font-medium text-gray-800 border border-gray-100 dark:border-white/[0.05] dark:text-white text-theme-sm whitespace-nowrap ">
                      {item.code}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.name}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                      <Badge
                        size="sm"
                        color={item.isActive ? "success" : "error"}
                      >
                        {item.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap ">
                      <div className="flex items-center justify-center w-full gap-2">
                        {isSupervisor ? (
                          <span title="Xem">
                            <Eye
                              className="w-4 h-4 cursor-pointer hover:text-brand-600 transition-colors"
                              onClick={() => handleViewCategory(item)}
                            />
                          </span>
                        ) : (
                          <>
                            <span title="Sửa">
                              <Pencil
                                className="w-4 h-4 cursor-pointer hover:text-gray"
                                onClick={() => handleEditCategory(item)}
                              />
                            </span>
                            {item.isActive
                              ? (
                                <span title="Ngừng hoạt động">
                                  <PauseCircleIcon
                                    className="w-4 h-4 cursor-pointer hover:text-error-500"
                                    onClick={() => handleActiveCategory(item.id)}
                                  />
                                </span>
                              )
                              : <span title="Hoạt động lại">
                                <PlayCircleIcon
                                  className="w-4 h-4 cursor-pointer hover:text-error-500"
                                  onClick={() => handleActiveCategory(item.id)}
                                />
                              </span>
                            }
                            {isAdmin() && (
                              <span title="Xóa">
                                <Trash2
                                  className="w-4 h-4 cursor-pointer hover:text-red-600 transition-colors"
                                  onClick={() => handleOpenDeleteModal(item)}
                                />
                              </span>
                            )}
                          </>
                        )}
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

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedCategory}
        callbackAction={refreshCategories}
        readOnly={isViewMode}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Xóa danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục "${categoryToDelete?.name}" không?`}
        confirmText="Xóa"
        cancelText="Hủy"
        isLoading={isDeleting}
      />
    </div>
  );
}

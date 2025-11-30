import { useState, useEffect } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import { Loader2 } from "lucide-react";
import { CategoryEntity } from "../../types/Category";
import { toast } from "sonner";
import { useGetCategoryByIdQuery, useCreateOrUpdateCategoryMutation } from "../../api/useCategoryApi";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CategoryEntity | null;
  callbackAction: () => void; // Callback to refresh the list
  readOnly?: boolean; // If true, all fields are disabled (view mode)
}

export default function CategoryModal({
  isOpen,
  onClose,
  initialData,
  callbackAction: refreshCategories,
  readOnly = false,
}: CategoryModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<CategoryEntity>>({});

  // Get category data using query if id is provided
  const { data: categoryData, isLoading: isLoadingCategory } = useGetCategoryByIdQuery(
    { id: initialData?.id || 0 },
    { skip: !initialData?.id || !isOpen }
  );

  const [formData, setFormData] = useState<CategoryEntity>({
    id: 0,
    code: "",
    name: "",
    description: "",
    isActive: true,
  });

  const [saveCreateOrUpdate] = useCreateOrUpdateCategoryMutation({});

  // Update form data when API response is received
  useEffect(() => {
    // Clear form data when modal is opened before loading new data
    setFormData({
      id: 0,
      code: "",
      name: "",
      description: "",
      isActive: true,
    });
    // Clear any errors
    setErrors({});

    if (isOpen && categoryData?.data && initialData?.id) {
      setFormData(categoryData.data);
    }
  }, [categoryData, isOpen, initialData?.id]);

  const handleInputChange = (field: keyof CategoryEntity, value: any) => {
    setFormData((prev: CategoryEntity) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof CategoryEntity]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<CategoryEntity> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Vui lòng nhập mã danh mục";
    }
    else if (formData.code.trim().length < 4) {
      newErrors.code = "Mã danh mục tối thiểu 4 ký tự";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên danh mục";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSaveCategory = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    try {
      // Add API call to save/update category
      const response = await saveCreateOrUpdate(formData).unwrap();

      if (response.data && response.data.isSuccess) {
        // success
        toast.success(initialData ? "Sửa danh mục thành công!" : "Thêm mới danh mục thành công!");
        onClose();
        refreshCategories(); // Refresh the list after save
      }
      else if (response.data && !response.data.isSuccess) {
        const newErrors: Partial<CategoryEntity> = {};

        if (response.data.codeError) {
          newErrors.code = response.data.codeError;
        }

        setErrors(newErrors);
      }
    } catch (err) {
      toast.error(err.data || "Có lỗi xảy ra khi lưu danh mục");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-3xl mx-4 sm:mx-auto"
      closeOnOutsideClick={false}
    >
      <div className="p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            {readOnly ? "Xem thông tin danh mục" : initialData ? "Sửa danh mục" : "Thêm mới danh mục"}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {readOnly ? "Xem thông tin chi tiết danh mục" : initialData ? "Cập nhật thông tin danh mục" : "Thêm mới danh mục vào hệ thống"}
          </p>
        </div>

        {isLoadingCategory && initialData ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <form onSubmit={handleSaveCategory} className="space-y-6">
            <div>
              <Label>
                Mã danh mục<span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                placeholder="Nhập mã danh mục"
                error={!!errors.code}
                hint={errors.code}
                required
                disabled={readOnly}
              />
            </div>

            <div>
              <Label>
                Tên danh mục<span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nhập tên danh mục"
                error={!!errors.name}
                hint={errors.name}
                required
                disabled={readOnly}
              />
            </div>

            <div>
              <Label>
                Mô tả
              </Label>
              <Input
                type="text"
                value={formData?.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Nhập mô tả danh mục"
                disabled={readOnly}
              />
            </div>

            {initialData && (
              <div>
                <Label>Trạng thái</Label>
                <Select
                  options={[
                    { value: "true", label: "Đang hoạt động" },
                    { value: "false", label: "Ngừng hoạt động" },
                  ]}
                  defaultValue={formData.isActive ? "true" : "false"}
                  onChange={(value) => handleInputChange("isActive", value === "true")}
                  placeholder="Chọn trạng thái"
                  disabled={readOnly}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              {readOnly ? (
                <Button variant="outline" onClick={onClose}>
                  Đóng
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                    Hủy
                  </Button>
                  <Button onClick={handleSaveCategory} disabled={isProcessing}>
                    {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isProcessing ? "Đang lưu..." : initialData ? "Lưu thay đổi" : "Thêm mới"}
                  </Button>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
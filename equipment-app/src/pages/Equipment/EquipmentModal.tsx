import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import DatePicker from "../../components/form/date-picker";
import CurrencyInput from "../../components/form/input/CurrencyInputField";
import { Modal } from "../../components/ui/modal";
import { useGetEquipmentByIdQuery } from "../../api/useEquipmentApi";
import { useEffect, useMemo, useState } from "react";
import { EquipmentStatusEnum } from "../../utils/enumerations";
import { useGetCategoryListQuery } from "../../api/useCategoryApi";
import { useGetDepartmentListQuery } from "../../api/useDepartmentApi";
import { useGetUserListQuery } from "../../api/useUserApi";
import { EquipmentEntity } from "../../types/Equipment";

interface EquipmentModalProps {
  id: number;
  isOpen: boolean;
  onClose: () => void;
}

const EquipmentModal: React.FC<EquipmentModalProps> = ({ id, isOpen, onClose }) => {
  const { data: equipmentData } = useGetEquipmentByIdQuery({ id: Number(id) }, { skip: !id });
  const { data: departmentData } = useGetDepartmentListQuery({});
  const { data: userData } = useGetUserListQuery();
  const { data: categoryData } = useGetCategoryListQuery({});
  const [formData, setFormData] = useState<EquipmentEntity>({
    id: 0,
    code: "",
    name: "",
    importDate: undefined,
    price: 0,
    originOfGoods: "",
    manufacturer: "",
    description: "",
    departmentId: 0,
    categoryId: 0,
    ownerId: 0,
    status: EquipmentStatusEnum.Available,
    reasonBroken: null,
    solutionBroken: null,
  });

  useEffect(() => {
    if (equipmentData?.data) {
      setFormData({
        ...equipmentData.data,
        reasonBroken: equipmentData.data.reasonBroken ?? null,
        solutionBroken: equipmentData.data.solutionBroken ?? null,
      });
    }
  }, [equipmentData]);


  // Get department options for dropdown
  const departmentOptions = useMemo(() => {
    if (!departmentData?.data) return [];
    return departmentData.data.map((dept) => ({
      value: String(dept.id),
      label: dept.name,
    }));
  }, [departmentData]);

  // Get category options for dropdown
  const categoryOptions = useMemo(() => {
    if (!categoryData?.data) return [];
    return categoryData.data.map((cate) => ({
      value: String(cate.id),
      label: cate.name,
    }));
  }, [categoryData]);

  // Get user options for dropdown
  const userOptions = useMemo(() => {
    if (!userData?.data) return [];
    return userData.data.map((user) => ({
      value: String(user.id),
      label: `${user.userName} - ${user.fullName}`,
    }));
  }, [userData]);

  // Get selected category description from categoryData
  const selectedCategoryDescription = useMemo(() => {
    if (!categoryData?.data || !formData.categoryId) return "";
    const selectedCategory = categoryData.data.find(cate => cate.id === formData.categoryId);
    return selectedCategory?.description || "";
  }, [categoryData, formData.categoryId]);

  // Get status options for dropdown
  const statusOptions = useMemo(() => {
    return Object.values(EquipmentStatusEnum).filter(
      v => typeof v === "number"
    ).map((status: number) => ({
      value: String(status),
      label: status === EquipmentStatusEnum.Available ? "Sẵn sàng" :
        status === EquipmentStatusEnum.Borrowed ? "Đang sử dụng" :
          status === EquipmentStatusEnum.Maintenance ? "Bảo trì" :
            status === EquipmentStatusEnum.Liquidation ? "Thanh lý" :
              status === EquipmentStatusEnum.Broken ? "Đã hỏng" :
                "",
    }));
  }, []);

  const isBrokenStatus = useMemo(
    () => formData.status == EquipmentStatusEnum.Broken,
    [formData.status]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-5xl mx-4 sm:mx-auto"
      closeOnOutsideClick={false}
    >
      <div className="p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Thông tin thiết bị
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Label className="mb-0 whitespace-nowrap">Trạng thái:</Label>
          <div className="w-48">
            <Select
              options={statusOptions}
              defaultValue={String(formData.status)}
              placeholder="Chọn trạng thái"
              disabled={true}
            />
          </div>
        </div>
        <div className="p-4 sm:p-6 dark:border-gray-800">
          <form>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label>Mã thiết bị</Label>
                <Input
                  type="text"
                  name="code"
                  value={formData.code}
                  disabled={true}
                  placeholder="Nhập mã thiết bị"
                />
              </div>
              <div>
                <Label>Tên thiết bị</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  disabled={true}
                  placeholder="Nhập tên thiết bị"
                />
              </div>
              <div>
                <Label>Danh mục</Label>
                <Select
                  options={categoryOptions}
                  defaultValue={String(formData.categoryId)}
                  disabled={true}
                  placeholder="Chọn danh mục"
                />
              </div>
              <div>
                <Label>Phòng ban</Label>
                <Select
                  options={departmentOptions}
                  defaultValue={String(formData.departmentId)}
                  placeholder="Chọn phòng ban"
                  disabled={true}
                />
              </div>
              <div className="col-span-full">
                <Label>Mô tả danh mục</Label>
                <Input
                  type="text"
                  name="categoryDescription"
                  value={selectedCategoryDescription}
                  disabled={true}
                  placeholder="Mô tả danh mục"
                />
              </div>
              <div>
                <Label>Giá trị</Label>
                <CurrencyInput
                  name="price"
                  disabled={true}
                  placeholder="Giá trị"
                  value={formData.price} />
              </div>
              <div>
                <Label>Người sở hữu</Label>
                <Select
                  options={userOptions}
                  defaultValue={String(formData.ownerId)}
                  placeholder="Chọn người sở hữu"
                  disabled={true}
                />
              </div>
              <div className="col-span-full">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div>
                    <Label>Hãng sản xuất</Label>
                    <Input type="text"
                      name="manufacturer"
                      value={formData?.manufacturer || ''}
                      placeholder="Hãng sản xuất"
                      disabled={true}
                    />
                  </div>
                  <div>
                    <Label>Xuất xứ</Label>
                    <Input
                      type="text"
                      name="originOfGoods"
                      value={formData?.originOfGoods || ''}
                      placeholder="Xuất xứ"
                      disabled={true}
                    />
                  </div>
                  <div>
                    <Label>Ngày nhập</Label>
                    <DatePicker
                      id="date-picker"
                      placeholder="Nhập ngày nhập"
                      defaultDate={formData.importDate}
                      disabled={true}
                    />
                  </div>
                  <div className="col-span-full">
                    <Label>Thông tin khác</Label>
                    <TextArea
                      rows={3}
                      value={formData.description}
                      placeholder="Thông tin thiết bị"
                      disabled={true}
                    />
                  </div>
                {isBrokenStatus && (
                  <div className="col-span-full grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <Label>Lý do hỏng</Label>
                      <TextArea
                        rows={3}
                        value={formData.reasonBroken ?? ""}
                        placeholder="Mô tả lý do thiết bị bị hỏng"
                        disabled={true}
                      />
                    </div>
                    <div>
                      <Label>Hướng xử lý</Label>
                      <TextArea
                        rows={3}
                        value={formData.solutionBroken ?? ""}
                        placeholder="Nhập phương án xử lý"
                        disabled={true}
                      />
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default EquipmentModal;
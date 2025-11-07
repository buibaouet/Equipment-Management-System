import { useEffect, useMemo, useState } from "react";
import { useGetDepartmentListQuery } from "../../api/useDepartmentApi";
import { useGetUserListQuery } from "../../api/useUserApi";
import { useGetCategoryListQuery } from "../../api/useCategoryApi";
import { EditMode, EquipmentStatusEnum } from "../../utils/enumerations";
import { useCreateOrUpdateEquipmentMutation, useGetEquipmentByIdQuery } from "../../api/useEquipmentApi";
import { useParams } from "react-router";
import { EquipmentEntity, EquipmentErrors } from "../../types/Equipment";
import useGoBack from "../../hooks/useGoBack";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function useEquipmentDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const editMode = id ? EditMode.Edit : EditMode.Add;
  const goBack = useGoBack();

  const { data: equipmentData } = useGetEquipmentByIdQuery({ id: Number(id) }, { skip: !id });
  const { data: departmentData, isLoading: isLoadingDepartments } = useGetDepartmentListQuery({});
  const { data: userData, isLoading: isLoadingUser } = useGetUserListQuery({});
  const { data: categoryData, isLoading: isLoadingCategory } = useGetCategoryListQuery({});
  const [createOrUpdateEquipment, { isLoading: isLoadingSave }] = useCreateOrUpdateEquipmentMutation();
  const [errors, setErrors] = useState<Partial<EquipmentErrors>>({});

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
  });

  useEffect(() => {
    if (equipmentData?.data) {
      const data = { ...equipmentData.data };
      // Convert importDate string to Date object if it exists
      if (data.importDate && typeof data.importDate === 'string') {
        data.importDate = new Date(data.importDate);
      }
      setFormData(data);
    }
  }, [equipmentData]);

  const handleValueChange = (value: string, field: keyof EquipmentEntity) => {
    let valueParsed: any = value;
    
    // Convert importDate ISO string to Date object
    if (field === 'importDate' && value) {
      valueParsed = new Date(value);
    } else if (field === 'price' || field === 'departmentId' || field === 'categoryId' || field === 'ownerId' || field === 'id') {
      valueParsed = Number(value);
    }

    if (valueParsed !== undefined) {
      setFormData((prev: EquipmentEntity) => ({
        ...prev,
        [field]: valueParsed,
      }));

      // Clear error when user starts typing
      if (errors[field as keyof EquipmentErrors]) {
        setErrors(prev => ({
          ...prev,
          [field]: undefined
        }));
      }
    }
  };

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

  // Get status options for dropdown
  const statusOptions = useMemo(() => {
    return Object.values(EquipmentStatusEnum).filter(
      v => typeof v === "number" && v !== EquipmentStatusEnum.Borrowed && v !== EquipmentStatusEnum.Maintenance
    ).map((status: number) => ({
      value: String(status),
      label: status === EquipmentStatusEnum.Available ? "Còn sử dụng" :
        status === EquipmentStatusEnum.Lost ? "Đã mất" :
          status === EquipmentStatusEnum.BrokenPart ? "Hỏng một phần" :
            status === EquipmentStatusEnum.Broken ? "Đã hỏng" :
              "",
    }));
  }, [EquipmentStatusEnum]);

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
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
    });

    goBack();
  };

  const validateForm = () => {
    const newErrors: Partial<EquipmentErrors> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Vui lòng nhập mã thiết bị";
    }
    else if (formData.code.trim().length < 4) {
      newErrors.code = "Mã thiết bị tối thiểu 4 ký tự";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên thiết bị";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục thiết bị";
    }

    if (!formData.price) {
      newErrors.price = "Giá trị thiết bị không được để trống";
    }

    if (!formData.departmentId) {
      newErrors.departmentId = "Vui lòng chọn phòng ban";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let response = await createOrUpdateEquipment(formData).unwrap();

      if (response.data && response.data.isSuccess) {
        toast.success(`${editMode == EditMode.Add ? 'Thêm mới' : 'Cập nhật thông tin'} thiết bị thành công`);
        navigate(`/equipment-list`);
      }
      else if (response.data && !response.data.isSuccess) {
        const newErrors: Partial<EquipmentErrors> = {};

        if (response.data.codeError) {
          newErrors.code = response.data.codeError;
        }
        if (response.data.nameError) {
          newErrors.name = response.data.nameError;
        }
        if (response.data.categoryIdError) {
          newErrors.categoryId = response.data.categoryIdError;
        }
        if (response.data.departmentIdError) {
          newErrors.departmentId = response.data.departmentIdError;
        }
        if (response.data.priceError) {
          newErrors.price = response.data.priceError;
        }

        setErrors(newErrors);
      }
      else {
        toast.error(response?.message || `Có lỗi xảy ra khi ${editMode == EditMode.Add ? 'thêm mới' : 'chỉnh sửa'} thiết bị`);
      }
    } catch (error: any) {
      toast.error(error.data?.message || `Có lỗi xảy ra khi ${editMode == EditMode.Add ? 'thêm mới' : 'chỉnh sửa'} thiết bị`);
    }
  };

  return {
    editMode,
    departmentOptions,
    userOptions,
    categoryOptions,
    statusOptions,
    isLoadingDepartments,
    isLoadingUser,
    isLoadingCategory,
    formData,
    errors,
    isLoadingSave,
    setFormData,
    handleValueChange,
    handleCancel,
    handleSave
  };
}



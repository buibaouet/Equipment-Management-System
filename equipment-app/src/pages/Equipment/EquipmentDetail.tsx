import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import PageMeta from "../../components/common/PageMeta";
import DatePicker from "../../components/form/date-picker";
import { EditMode, EquipmentStatusEnum } from "../../utils/enumerations";
import CurrencyInput from "../../components/form/input/CurrencyInputField";
import { CheckIcon, XIcon } from "lucide-react";
import useEquipmentDetail from "./useEquipmentDetail";
import { useMemo } from "react";

const EquipmentDetail: React.FC = () => {
  const {
    editMode,
    departmentOptions,
    userOptions,
    categoryOptions,
    statusOptions,
    formData,
    errors,
    isLoadingSave,
    isDepartmentDisabled,
    selectedCategoryDescription,
    handleValueChange,
    handleCancel,
    handleSave
  } = useEquipmentDetail();

  const isBrokenStatus = useMemo(() => formData.status == EquipmentStatusEnum.Broken, [formData.status]);

  return (
    <div>
      <PageMeta
        title={editMode === EditMode.Edit ? "Sửa thông tin thiết bị" : "Thêm thiết bị"}
        description={editMode === EditMode.Edit ? "Sửa thông tin thiết bị" : "Thêm thiết bị"}
      />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <h2 className="flex text-lg font-medium text-gray-800 dark:text-white">
                {editMode === EditMode.Edit ? "Sửa thông tin thiết bị" : "Thêm thiết bị"}
              </h2>

              <div className="flex items-center gap-3">
                {editMode !== EditMode.Add && (
                  <>
                    <Label className="mb-0 whitespace-nowrap">Trạng thái:</Label>
                    <div className="w-48">
                      <Select
                        options={statusOptions}
                        defaultValue={String(formData.status)}
                        onChange={(e) => handleValueChange(e, 'status')}
                        placeholder="Chọn trạng thái"
                        disabled={editMode === EditMode.View || formData.status === EquipmentStatusEnum.Borrowed}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 dark:border-gray-800">
            <form>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <Label>Mã thiết bị<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={(e) => handleValueChange(e.target.value, 'code')}
                    error={!!errors.code}
                    hint={errors.code}
                    disabled={editMode === EditMode.View}
                    required
                    placeholder="Nhập mã thiết bị"
                  />
                </div>
                <div>
                  <Label>Tên thiết bị<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleValueChange(e.target.value, 'name')}
                    error={!!errors.name}
                    hint={errors.name}
                    disabled={editMode === EditMode.View}
                    required
                    placeholder="Nhập tên thiết bị"
                  />
                </div>
                <div>
                  <Label>Danh mục<span className="text-error-500">*</span></Label>
                  <Select
                    options={categoryOptions}
                    defaultValue={String(formData.categoryId)}
                    onChange={(e) => handleValueChange(e, 'categoryId')}
                    placeholder="Chọn danh mục"
                    error={!!errors.categoryId}
                    hint={errors.categoryId}
                    disabled={editMode === EditMode.View}
                    required
                  />
                </div>
                <div>
                  <Label>Phòng ban<span className="text-error-500">*</span></Label>
                  <Select
                    options={departmentOptions}
                    defaultValue={String(formData.departmentId)}
                    onChange={(e) => handleValueChange(e, 'departmentId')}
                    placeholder="Chọn phòng ban"
                    error={!!errors.departmentId}
                    hint={errors.departmentId}
                    disabled={editMode === EditMode.View || isDepartmentDisabled}
                    required
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
                  <Label>Giá trị<span className="text-error-500">*</span></Label>
                  <CurrencyInput
                    name="price"
                    onChange={(e) => handleValueChange(String(e), 'price')}
                    error={!!errors.price}
                    hint={errors.price}
                    disabled={editMode === EditMode.View}
                    required
                    placeholder="Giá trị"
                    value={formData.price} />
                </div>
                <div>
                  <Label>Người sở hữu</Label>
                  <Select
                    options={userOptions}
                    defaultValue={String(formData.ownerId)}
                    onChange={(e) => handleValueChange(e, 'ownerId')}
                    placeholder="Chọn người sở hữu"
                    disabled={editMode === EditMode.View}
                  />
                </div>
                <div className="col-span-full">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div>
                      <Label>Hãng sản xuất</Label>
                      <Input type="text"
                        name="manufacturer"
                        value={formData?.manufacturer || ''}
                        onChange={(e) => handleValueChange(e.target.value, 'manufacturer')}
                        placeholder="Hãng sản xuất"
                        disabled={editMode === EditMode.View}
                      />
                    </div>
                    <div>
                      <Label>Xuất xứ</Label>
                      <Input
                        type="text"
                        name="originOfGoods"
                        value={formData?.originOfGoods || ''}
                        onChange={(e) => handleValueChange(e.target.value, 'originOfGoods')}
                        placeholder="Xuất xứ"
                        disabled={editMode === EditMode.View}
                      />
                    </div>
                    <div>
                      <Label>Ngày nhập</Label>
                      <DatePicker
                        id="date-picker"
                        placeholder="Nhập ngày nhập"
                        defaultDate={formData.importDate ? (typeof formData.importDate === 'string' ? new Date(formData.importDate) : formData.importDate) : undefined}
                        onChange={(dates) => {
                          if (dates.length > 0) {
                            const date = new Date(dates[0]);
                            handleValueChange(date.toISOString(), 'importDate');
                          }
                        }}
                        disabled={editMode === EditMode.View}
                      />
                    </div>
                    <div className="col-span-full">
                      <Label>Thông tin khác</Label>
                      <TextArea
                        rows={6}
                        value={formData.description}
                        onChange={(e) => handleValueChange(e, 'description')}
                        placeholder="Thông tin thiết bị"
                        disabled={editMode === EditMode.View}
                      />
                    </div>
                    {isBrokenStatus && (
                      <div className="col-span-full grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                          <Label>
                            Lý do hỏng<span className="text-error-500">*</span>
                          </Label>
                          <TextArea
                            rows={4}
                            value={formData.reasonBroken ?? ""}
                            onChange={(e) => handleValueChange(e, 'reasonBroken')}
                            placeholder="Mô tả lý do thiết bị bị hỏng"
                            disabled={editMode === EditMode.View}
                            error={!!errors.reasonBroken}
                            hint={errors.reasonBroken}
                          />
                        </div>
                        <div>
                          <Label>
                            Hướng xử lý<span className="text-error-500">*</span>
                          </Label>
                          <TextArea
                            rows={4}
                            value={formData.solutionBroken ?? ""}
                            onChange={(e) => handleValueChange(e, 'solutionBroken')}
                            placeholder="Nhập phương án xử lý"
                            disabled={editMode === EditMode.View}
                            error={!!errors.solutionBroken}
                            hint={errors.solutionBroken}
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

        {editMode !== EditMode.View && (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <XIcon className="w-4 h-4" />
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="flex items-center gap-2"
              disabled={isLoadingSave}
            >
              <CheckIcon className="w-4 h-4" />
              {isLoadingSave ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EquipmentDetail;
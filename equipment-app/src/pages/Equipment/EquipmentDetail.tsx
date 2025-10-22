import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import PageMeta from "../../components/common/PageMeta";
import DatePicker from "../../components/form/date-picker";

export default function TaskKanban() {
  const categories = [
    { value: "Laptop", label: "Laptop" },
    { value: "Phone", label: "Phone" },
    { value: "Watch", label: "Watch" },
    { value: "Electronics", label: "Electronics" },
    { value: "Accessories", label: "Accessories" },
  ];
  const brands = [
    { value: "1", label: "Apple" },
    { value: "2", label: "Samsung" },
    { value: "3", label: "LG" },
  ];
  const colors = [
    { value: "1", label: "Silver" },
    { value: "2", label: "Black" },
    { value: "3", label: "White" },
    { value: "4", label: "Gray" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
  return (
    <div>
      <PageMeta
        title="Sửa thông tin thiết bị"
        description="Sửa thông tin thiết bị"
      />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Sửa thông tin thiết bị
            </h2>
          </div>
          <div className="p-4 sm:p-6 dark:border-gray-800">
            <form>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <Label>Mã thiết bị<span className="text-error-500">*</span></Label>
                  <Input placeholder="Nhập mã thiết bị" />
                </div>
                <div>
                  <Label>Tên thiết bị<span className="text-error-500">*</span></Label>
                  <Input placeholder="Nhập tên thiết bị" />
                </div>
                <div>
                  <Label>Danh mục<span className="text-error-500">*</span></Label>
                  <Select
                    options={categories}
                    placeholder="Chọn danh mục"
                    onChange={handleSelectChange}
                    defaultValue=""
                  />
                </div>
                <div>
                  <Label>Dự án<span className="text-error-500">*</span></Label>
                  <Select
                    options={brands}
                    placeholder="Chọn dự án"
                    onChange={handleSelectChange}
                    defaultValue=""
                  />
                </div>
                <div>
                      <Label>Giá trị<span className="text-error-500">*</span></Label>
                      <Input type="number" placeholder="Giá trị" />
                    </div>
                <div>
                  <Label>Người sở hữu</Label>
                  <Select
                    options={colors}
                    placeholder="Select color"
                    onChange={handleSelectChange}
                    defaultValue=""
                  />
                </div>
                <div className="col-span-full">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div>
                      <Label>Hãng sản xuất</Label>
                      <Input type="text" placeholder="Hãng sản xuất" />
                    </div>
                    <div>
                      <Label>Xuất xứ</Label>
                      <Input type="text" placeholder="Xuất xứ" />
                    </div>
                    <div>
                      <Label>Ngày nhập</Label>
                      <DatePicker
                        id="date-picker"
                        placeholder="Nhập nhập"
                      />
                    </div>
                    <div className="col-span-full">
                      <Label>Thông tin khác</Label>
                      <TextArea rows={6} placeholder="Thông tin thiết bị" />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline">Hủy</Button>
          <Button variant="primary">Lưu</Button>
        </div>
      </div>
    </div>
  );
}

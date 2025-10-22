import { useState } from "react";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { Edit3Icon, CheckIcon, XIcon } from "lucide-react";
import DatePicker from "../../components/form/date-picker";

export default function UserInfoCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Musharof",
    lastName: "Chowdhury",
    email: "randomuser@pimjo.com",
    birthDate: "11/11/1999",
    bio: "Team Manager"
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values if needed
  };
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Thông tin cá nhân
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                First Name
              </p>
              {isEditing ? (
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="!py-1 !px-2"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.firstName}
                </p>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              {isEditing ? (
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="!py-1 !px-2"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.lastName}
                </p>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="!py-1 !px-2"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.email}
                </p>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Ngày sinh
              </p>
              {isEditing ? (
                <DatePicker
                  id="date-picker"
                  placeholder="Nhập ngày sinh"
                  defaultDate={formData.birthDate}
                  onChange={(dates) => {
                    if (dates.length > 0) {
                      const date = new Date(dates[0]);
                      handleInputChange('birthDate', date.toLocaleDateString());
                    }
                  }}
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.birthDate}
                </p>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Bio
              </p>
              {isEditing ? (
                <Input
                  type="text"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="!py-1 !px-2"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
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
              >
                <CheckIcon className="w-4 h-4" />
                Lưu
              </Button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            >
              <Edit3Icon className="w-4 h-4" />
              Sửa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

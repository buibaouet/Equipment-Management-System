import { useState } from "react";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { Edit3Icon, CheckIcon, XIcon } from "lucide-react";
import DatePicker from "../../components/form/date-picker";
import TextArea from "../../components/form/input/TextArea";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import { UpdateUserInfo } from "../../types/User";
import { useUpdateUserMutation } from "../../api/useUserApi";

export default function UserInfoCard() {
  const { currentUser } = useAuth();
  if (!currentUser) return;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateUserInfo>({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    birthDate: currentUser?.birthDate ? new Date(currentUser.birthDate) : undefined,
    bio: currentUser?.bio || ''
  });
  const [errors, setErrors] = useState<Partial<UpdateUserInfo>>({});

  const handleInputChange = (field: keyof UpdateUserInfo, value: any) => {
    if (field === 'birthDate' && value) {
      // Ensure we always store birthDate as a Date object
      setFormData(prev => ({
        ...prev,
        [field]: new Date(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));

      // Clear error when user starts typing
      if (errors[field as keyof UpdateUserInfo]) {
        setErrors(prev => ({
          ...prev,
          [field]: undefined
        }));
      }
    }
  };

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const validateForm = () => {
    const newErrors: Partial<UpdateUserInfo> = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Vui lòng nhập họ";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Vui lòng nhập tên";
    }

    setErrors(newErrors);

    // Email validation
    let validEmail = validateEmail(formData.email);

    return Object.keys(newErrors).length === 0 && validEmail;
  };

  const validateEmail = (email: string) => {
    let emailError = '';

    if (!email.trim()) {
      emailError = "Vui lòng nhập email";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      emailError = "Email không hợp lệ";
    }

    setErrors(prev => ({
      ...prev,
      "email": emailError
    }));

    return emailError === "";
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let response = await updateUser({
        id: currentUser.id,
        data: formData // Let the API handle the date format
      }).unwrap();

      if (response.data && response.data.isSuccess) {
        toast.success('Cập nhật thông tin thành công');
        setIsEditing(false);
      }
      else if (response.data && !response.data.isSuccess) {
        const newErrors: Partial<UpdateUserInfo> = {};

        if (response.data.emailError) {
          newErrors.email = response.data.emailError;
        }

        setErrors(newErrors);
      }
      else {
        toast.error(response?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch (error: any) {
      toast.error(error.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      birthDate: currentUser?.birthDate ? new Date(currentUser.birthDate) : undefined,
      bio: currentUser?.bio || ''
    });
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
                Họ
              </p>
              {isEditing ? (
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="!py-1 !px-2"
                  error={!!errors.firstName}
                  hint={errors.firstName}
                  required
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.firstName}
                </p>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Tên
              </p>
              {isEditing ? (
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="!py-1 !px-2"
                  error={!!errors.lastName}
                  hint={errors.lastName}
                  required
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.lastName}
                </p>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="!py-1 !px-2"
                  onBlur={(e) => { validateEmail(e.target.value); }}
                  placeholder="Nhập email"
                  error={!!errors.email}
                  hint={errors.email}
                  required
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
                      handleInputChange('birthDate', date);
                    }
                  }}
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.birthDate ? new Date(formData.birthDate).toLocaleDateString() : ''}
                </p>
              )}
            </div>

            <div className="lg:col-span-2">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Bio
              </p>
              {isEditing ? (
                <TextArea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e)}
                  className="w-full min-h-[100px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:focus:border-primary-500"
                  placeholder="Thông tin bio..."
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
                disabled={isLoading}
              >
                <CheckIcon className="w-4 h-4" />
                {isLoading ? 'Đang lưu...' : 'Lưu'}
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

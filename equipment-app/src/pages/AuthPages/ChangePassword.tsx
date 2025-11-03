import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "../../layout/AuthPageLayout";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { EyeIcon, EyeClosedIcon, ArrowLeftCircle } from "lucide-react";
import { useState } from "react";
import Button from "../../components/ui/button/Button";
import useGoBack from "../../hooks/useGoBack";
import { useChangePasswordMutation } from '../../api/useAuthApi';
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";

export default function ChangePassword() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState<{ error: boolean; message: string }>({ error: false, message: '' });
  const [confirmPasswordError, setConfirmPasswordError] = useState<{ error: boolean; message: string }>({ error: false, message: '' });
  const [oldPasswordError, setOldPasswordError] = useState<{ error: boolean; message: string }>({ error: false, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const goBack = useGoBack();
  const [changePasswordAPI] = useChangePasswordMutation();
  const { logout, currentUser } = useAuth();

  const validatePassword = (password: string): { isValid: boolean; message: string } => {
    const hasMinLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if(password === oldPassword) {
      return { isValid: false, message: 'Mật khẩu mới không được trùng với mật khẩu cũ' };
    }

    if (!hasMinLength || !hasLetter || !hasNumber || !hasSpecialChar) {
      return { isValid: false, message: 'Mật khẩu chứa tối thiểu 8 ký tự bao gồm chữ, số và ký tự đặc biệt' };
    }

    return { isValid: true, message: '' };
  };

  const handleSubmit = async () => {
    // Validate all fields
    if (!oldPassword.trim()) {
      setOldPasswordError({ error: true, message: 'Vui lòng nhập mật khẩu cũ' });
      return;
    }

    const newPasswordValidation = validatePassword(newPassword);
    if (!newPasswordValidation.isValid) {
      setNewPasswordError({ error: true, message: newPasswordValidation.message });
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError({ error: true, message: 'Mật khẩu không khớp' });
      return;
    }

    setIsSubmitting(true);
    try {
      let response = await changePasswordAPI({ userId: currentUser?.id || 0, oldPassword, newPassword });

      if (response.data && response.data?.data && response.data.data.isSuccess) {
        // Password changed successfully
        alert('Đổi mật khẩu thành công, vui lòng đăng nhập lại');
        logout();
      }
      else if (response.data && response.data?.data && !response.data.data.isSuccess) {
        if (response.data.data.oldPasswordError) {
          setOldPasswordError({ error: true, message: response.data.data.oldPasswordError });
        }
        if (response.data.data.newPasswordError) {
          setNewPasswordError({ error: true, message: response.data.data.newPasswordError });
        }
      }
      else {
        // Handle error
        toast.error(response.data?.message || "Có lỗi xảy ra khi đổi mật khẩu");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đổi mật khẩu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Đổi mật khẩu"
        description="Đổi mật khẩu"
      />
      <AuthLayout>
        <div className="flex flex-col flex-1 w-full lg:w-1/2">
          <div className="w-full max-w-md pt-10 mx-auto">
            <button
              onClick={goBack}
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              <ArrowLeftCircle className="w-4 h-4 mr-2" />
              Quay lại
            </button>
          </div>
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Đổi mật khẩu
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Vui lòng nhập mật khẩu tối thiểu chứa 8 ký tự bao gồm chữ, số và ký tự đặc biệt
              </p>
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <Label>
                      Mật khẩu cũ<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Nhập mật khẩu cũ"
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => {
                          setOldPassword(e.target.value);
                          setOldPasswordError({ error: false, message: '' });
                        }}
                        error={oldPasswordError.error}
                        hint={oldPasswordError.message}
                        required
                      />
                      <span
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showOldPassword ? (
                          <EyeIcon className="w-4 h-4" />
                        ) : (
                          <EyeClosedIcon className="w-4 h-4" />
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>
                      Mật khẩu mới<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Nhập mật khẩu mới"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setNewPasswordError({ error: false, message: '' });
                        }}
                        onBlur={(e) => {
                          const validation = validatePassword(e.target.value);
                          setNewPasswordError({
                            error: !validation.isValid,
                            message: validation.message
                          });
                        }}
                        hint={newPasswordError.message}
                        error={newPasswordError.error}
                        required
                      />
                      <span
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showNewPassword ? (
                          <EyeIcon className="w-4 h-4" />
                        ) : (
                          <EyeClosedIcon className="w-4 h-4" />
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>
                      Nhập lại mật khẩu mới<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Xác nhận mật khẩu"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setConfirmPasswordError({ error: false, message: '' });
                        }}
                        onBlur={(e) => {
                          const isValid = newPassword === e.target.value;
                          setConfirmPasswordError({
                            error: !isValid,
                            message: !isValid ? 'Mật khẩu không khớp' : ''
                          });
                        }}
                        hint={confirmPasswordError.message}
                        error={confirmPasswordError.error}
                        required
                      />
                      <span
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeIcon className="w-4 h-4" />
                        ) : (
                          <EyeClosedIcon className="w-4 h-4" />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* <!-- Button --> */}
                  <div>
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={isSubmitting || newPasswordError.error || confirmPasswordError.error}
                    >
                      {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}

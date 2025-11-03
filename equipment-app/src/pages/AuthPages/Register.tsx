import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "../../layout/AuthPageLayout";
import { useState } from "react";
import { Link } from "react-router";
import { EyeIcon, EyeClosedIcon } from "lucide-react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { CreateUserInput } from "../../types/User";
import { useRegisterMutation } from '../../api/useAuthApi';
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<CreateUserInput>({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<Partial<CreateUserInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerAPI] = useRegisterMutation();
  const { logout } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof CreateUserInput]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<CreateUserInput> = {};

    // Username validation
    if (!formData.userName.trim()) {
      newErrors.userName = "Vui lòng nhập tên đăng nhập";
    }
    else if (formData.userName.trim().length < 6) {
      newErrors.userName = "Tên đăng nhập tối thiểu 6 ký tự";
    }

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

    let validPass = validatePassword(formData.password);

    return Object.keys(newErrors).length === 0 && validPass && validEmail;
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

  const validatePassword = (password: string) => {
    let passwordError = '';
    const hasMinLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasMinLength && hasLetter && hasNumber && hasSpecialChar) {
      passwordError = "";
    }
    else {
      passwordError = "Mật khẩu tối thiểu 8 ký tự bao gồm chữ, số và ký tự đặc biệt";
    }

    setErrors(prev => ({
      ...prev,
      "password": passwordError
    }));

    return passwordError === "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let response = await registerAPI({ registerData: formData });

      if (response.data && response.data?.data && response.data.data.isSuccess) {
        // Registration successful
        toast.success('Đăng ký tài khoản thành công.');
        alert('Đăng ký tài khoản thành công! Đăng nhập để sử dụng hệ thống.');
        logout();
      }
      else if (response.data && response.data?.data && !response.data.data.isSuccess) {
        const newErrors: Partial<CreateUserInput> = {};

        if (response.data.data.usernameError) {
          newErrors.userName = response.data.data.usernameError;
        }
        if (response.data.data.emailError) {
          newErrors.email = response.data.data.emailError;
        }
        if (response.data.data.passwordError) {
          newErrors.password = response.data.data.passwordError;
        }

        setErrors(newErrors);
      }
      else {
        toast.error(response.data?.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng ký');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Đăng ký"
        description="Đăng ký"
      />
      <AuthLayout>
        <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Đăng ký
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nhập thông tin tài của bạn để đăng ký tài khoản!
                </p>
              </div>
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    {/* <!-- Username --> */}
                    <div>
                      <Label>
                        Tên đăng nhập<span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        placeholder="Nhập tên đăng nhập"
                        error={!!errors.userName}
                        hint={errors.userName}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* <!-- First Name --> */}
                      <div className="sm:col-span-1">
                        <Label>
                          Họ<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Nhập họ"
                          error={!!errors.firstName}
                          hint={errors.firstName}
                          required
                        />
                      </div>
                      {/* <!-- Last Name --> */}
                      <div className="sm:col-span-1">
                        <Label>
                          Tên<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Nhập tên"
                          error={!!errors.lastName}
                          hint={errors.lastName}
                          required
                        />
                      </div>
                    </div>
                    {/* <!-- Email --> */}
                    <div>
                      <Label>
                        Email<span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={(e) => { validateEmail(e.target.value); }}
                        placeholder="Nhập email"
                        error={!!errors.email}
                        hint={errors.email}
                        required
                      />
                    </div>
                    {/* <!-- Password --> */}
                    <div>
                      <Label>
                        Mật khẩu<span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Nhập mật khẩu"
                          type={showPassword ? "text" : "password"}
                          error={!!errors.password}
                          hint={errors.password}
                          required
                          onBlur={(e) => { validatePassword(e.target.value); }}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="w-4 h-4" />
                          ) : (
                            <EyeClosedIcon className="w-4 h-4" />
                          )}
                        </span>
                      </div>
                    </div>
                    {/* <!-- Button --> */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
                      >
                        {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
                      </button>
                    </div>
                  </div>
                </form>

                <div className="mt-5">
                  <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                    Bạn đã có tài khoản? {""}
                    <Link
                      to="/login"
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Đăng nhập
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}

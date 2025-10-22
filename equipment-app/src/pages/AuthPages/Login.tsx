import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "../../layout/AuthPageLayout";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { EyeIcon, EyeClosedIcon, Loader2 } from "lucide-react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { LoginCredentials } from "../../types/User";
import { useAuth } from "../../hooks/useAuth";
import Alert from "../../components/ui/alert/Alert";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access before login
  const from = (location.state as any)?.from?.pathname || '/';

  const [formData, setFormData] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [loginError, setLoginError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } 

    if (!formData.password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name as keyof LoginCredentials]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Clear login error
    if (loginError) {
      setLoginError('');
    }
  };

  const { login, isLoading: authLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoginError('');

    try {
      const response = await login(formData);

      if (response.success && response.user) {
        // Navigate to the page user was trying to access, or dashboard
        navigate(from, { replace: true });
      } else {
        setLoginError(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Login failed. Please try again.');
    }
  };

  return (
    <>
      <PageMeta
        title="Đăng nhập"
        description="Đăng nhập"
      />
      <AuthLayout>
        <div className="flex flex-col flex-1">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Đăng nhập
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Vui lòng nhập tên đăng nhập và mật khẩu để đăng nhập!
                </p>
              </div>
              <div>
                <form onSubmit={handleSubmit} className="login-form">
                  {loginError && (
                    <div className="mb-3">
                    <Alert
                    variant="error"
                    title=""
                    message={loginError}
                    showLink={false}
                  />
                  </div>
                  )}
                  <div className="space-y-6">
                    <div>
                      <Label>
                        Tên đăng nhập <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`form-input`}
                        error={errors.username ? true : false}
                        placeholder="Nhập tên đăng nhập"
                        hint={errors.username}
                      />
                    </div>
                    <div>
                      <Label>
                        Mật khẩu <span className="text-error-500">*</span>{" "}
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`form-input`}
                          error={errors.password ? true : false}
                          hint={errors.password}
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
                    <div>
                      <button
                        type="submit"
                        className={`w-full inline-flex items-center justify-center gap-2 rounded-lg transition bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm`}
                        disabled={authLoading}
                      >
                        {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {authLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                      </button>
                    </div>
                  </div>
                </form>

                <div className="mt-5">
                  <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                    Bạn chưa có tài khoản? {""}
                    <Link
                      to="/register"
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Đăng ký
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

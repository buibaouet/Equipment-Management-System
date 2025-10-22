import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "../../layout/AuthPageLayout";
import { useState } from "react";
import { Link } from "react-router";
import { EyeIcon, EyeClosedIcon } from "lucide-react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
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
            <form>
              <div className="space-y-5">
                {/* <!-- Username --> */}
                <div>
                  <Label>
                    Tên đăng nhập<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Nhập tên đăng nhập"
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
                      id="fname"
                      name="fname"
                      placeholder="Nhập họ"
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Tên<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Nhập tên"
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
                    id="email"
                    name="email"
                    placeholder="Nhập email"
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Mật khẩu<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Nhập mật khẩu"
                      type={showPassword ? "text" : "password"}
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
                  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    Đăng ký
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

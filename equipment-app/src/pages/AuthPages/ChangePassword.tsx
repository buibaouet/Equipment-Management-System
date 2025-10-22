import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "../../layout/AuthPageLayout";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { EyeIcon, EyeClosedIcon, ArrowLeftCircle } from "lucide-react";
import { useState } from "react";
import Button from "../../components/ui/button/Button";
import useGoBack from "../../hooks/useGoBack";

export default function ChangePassword() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const goBack = useGoBack();
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
              <form>
                <div className="space-y-5">
                  <div>
                    <Label>
                      Mật khẩu cũ<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Nhập mật khẩu cũ"
                        type={showOldPassword ? "text" : "password"}
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
                    <Button className="w-full" size="sm">
                      Xác nhận
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

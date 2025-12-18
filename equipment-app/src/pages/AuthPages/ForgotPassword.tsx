import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "../../layout/AuthPageLayout";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { useState } from "react";
import { useForgotPasswordMutation, useResetPasswordWithOtpMutation } from "../../api/useAuthApi";
import { ForgotPasswordRequest, ResetPasswordWithOtpRequest } from "../../types/Auth";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { ArrowLeftCircle, EyeClosedIcon, EyeIcon } from "lucide-react";
import useGoBack from "../../hooks/useGoBack";
type Step = "email" | "otpAndPassword";

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState<{ error: boolean; message: string }>({
    error: false,
    message: "",
  });
  const [otpError, setOtpError] = useState<{ error: boolean; message: string }>({
    error: false,
    message: "",
  });
  const [newPasswordError, setNewPasswordError] = useState<{ error: boolean; message: string }>({
    error: false,
    message: "",
  });
  const [confirmPasswordError, setConfirmPasswordError] = useState<{
    error: boolean;
    message: string;
  }>({
    error: false,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [forgotPasswordApi] = useForgotPasswordMutation();
  const [resetPasswordApi] = useResetPasswordWithOtpMutation();
  const navigate = useNavigate();
  const goBack = useGoBack();

  const isValidEmail = (value: string) => {
    // Simple email format validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validatePassword = (
    password: string
  ): { isValid: boolean; message: string } => {
    const hasMinLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasMinLength || !hasLetter || !hasNumber || !hasSpecialChar) {
      return {
        isValid: false,
        message:
          "Mật khẩu chứa tối thiểu 8 ký tự bao gồm chữ, số và ký tự đặc biệt",
      };
    }

    return { isValid: true, message: "" };
  };

  const handleRequestOtp = async () => {
    if (!email.trim()) {
      setEmailError({ error: true, message: "Vui lòng nhập email" });
      return;
    }

    if (!isValidEmail(email.trim())) {
      setEmailError({ error: true, message: "Địa chỉ email không hợp lệ" });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: ForgotPasswordRequest = { email };
      const response = await forgotPasswordApi(payload).unwrap();

      if (response.statusCode === 200) {
        toast.success(response.data || "Đã gửi mã OTP tới email của bạn");
        setEmailError({ error: false, message: "" });
        setStep("otpAndPassword");
      } else {
        // Hiển thị lỗi phía dưới input email
        setEmailError({
          error: true,
          message: response.message || "Không thể gửi mã OTP",
        });
      }
    } catch (error) {
      toast.error(error.data || "Có lỗi xảy ra khi gửi mã OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim()) {
      setEmailError({ error: true, message: "Vui lòng nhập email" });
      return;
    }

    if (!isValidEmail(email.trim())) {
      setEmailError({ error: true, message: "Địa chỉ email không hợp lệ" });
      return;
    }

    setIsResending(true);
    try {
      const payload: ForgotPasswordRequest = { email };
      const response = await forgotPasswordApi(payload).unwrap();

      if (response.statusCode === 200) {
        toast.success(response.data || "Đã gửi lại mã OTP tới email của bạn");
        setEmailError({ error: false, message: "" });
      } else {
        setEmailError({
          error: true,
          message: response.message || "Không thể gửi lại mã OTP",
        });
      }
    } catch  (error) {
      toast.error(error.data || "Có lỗi xảy ra khi gửi lại mã OTP");
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const next = [...otpDigits];
    next[index] = value;
    setOtpDigits(next);
    setOtpError({ error: false, message: "" });

    // Tự động chuyển sang ô tiếp theo
    if (value && index < 5) {
      const nextInput = document.querySelector<HTMLInputElement>(
        `input[data-otp-index="${index + 1}"]`
      );
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prevInput = document.querySelector<HTMLInputElement>(
        `input[data-otp-index="${index - 1}"]`
      );
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;

    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < text.length; i++) {
      next[i] = text[i];
    }
    setOtpDigits(next);
    setOtpError({ error: false, message: "" });
  };

  const handleResetPassword = async () => {
    const code = otpDigits.join("");

    if (code.length !== 6) {
      setOtpError({ error: true, message: "Vui lòng nhập đủ 6 chữ số OTP" });
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setNewPasswordError({
        error: true,
        message: passwordValidation.message,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError({
        error: true,
        message: "Mật khẩu xác nhận không khớp",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: ResetPasswordWithOtpRequest = {
        email,
        otpCode: code,
        newPassword,
      };

      const response = await resetPasswordApi(payload);

      if ("data" in response && response.data) {
        if (response.data.data && response.data.data.isSuccess) {
          toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
          setOtpError({ error: false, message: "" });
          setNewPasswordError({ error: false, message: "" });
          setConfirmPasswordError({ error: false, message: "" });
          navigate("/login");
        } else if (response.data.data && !response.data.data.isSuccess) {
          const { otpCodeError, newPasswordError } = response.data.data;
          if (otpCodeError) {
            setOtpError({ error: true, message: otpCodeError });
          } else if (newPasswordError) {
            setNewPasswordError({ error: true, message: newPasswordError });
          } else {
            setNewPasswordError({
              error: true,
              message: response.data.message || "Không thể đặt lại mật khẩu",
            });
          }
        } else {
          setNewPasswordError({
            error: true,
            message: response.data.message || "Không thể đặt lại mật khẩu",
          });
        }
      }
    } catch {
      toast.error("Có lỗi xảy ra khi đặt lại mật khẩu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Quên mật khẩu"
        description="Quên mật khẩu"
      />
      <AuthLayout>
        <div className="flex flex-col flex-1">
        <div className="w-full max-w-md pt-10 mx-auto">
            <button
              onClick={goBack}
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              <ArrowLeftCircle className="w-4 h-4 mr-2" />
              Quay lại trang đăng nhập
            </button>
          </div>
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Quên mật khẩu
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nhập email để nhận mã OTP và đặt lại mật khẩu.
                </p>
              </div>

              {step === "email" && (
                <div className="space-y-5">
                  <div>
                    <Label>
                      Email<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      placeholder="Nhập email đã đăng ký"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError({ error: false, message: "" });
                      }}
                      error={emailError.error}
                      hint={emailError.message}
                    />
                  </div>
                  <div>
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={handleRequestOtp}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Đang gửi..." : "Gửi mã OTP"}
                    </Button>
                  </div>
                </div>
              )}

              {step === "otpAndPassword" && (
                <div className="space-y-5">
                  <div>
                    <Label>
                      Mã OTP<span className="text-error-500">*</span>
                    </Label>
                    <div className="flex items-center justify-between gap-2">
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          data-otp-index={index}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          className={`w-10 h-10 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                            otpError.error ? "border-error-500" : "border-gray-300"
                          }`}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={handleOtpPaste}
                        />
                      ))}
                    </div>
                    {otpError.message && (
                      <p className="mt-1 text-xs text-error-500">{otpError.message}</p>
                    )}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Mã OTP có hiệu lực trong 10 phút.</span>
                    <button
                      type="button"
                      className="text-brand-500 hover:text-brand-600 disabled:text-gray-400"
                      onClick={handleResendOtp}
                      disabled={isResending}
                    >
                      {isResending ? "Đang gửi lại..." : "Gửi lại mã OTP"}
                    </button>
                  </div>
                  <div>
                    <Label>
                      Mật khẩu mới<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setNewPasswordError({ error: false, message: "" });
                        }}
                        onBlur={(e) => {
                          const validation = validatePassword(e.target.value);
                          setNewPasswordError({
                            error: !validation.isValid,
                            message: validation.message,
                          });
                        }}
                        error={newPasswordError.error}
                        hint={newPasswordError.message}
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
                      Xác nhận mật khẩu mới<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setConfirmPasswordError({
                            error: false,
                            message: "",
                          });
                        }}
                        onBlur={(e) => {
                          const isValid = newPassword === e.target.value;
                          setConfirmPasswordError({
                            error: !isValid,
                            message: !isValid ? "Mật khẩu không khớp" : "",
                          });
                        }}
                        error={confirmPasswordError.error}
                        hint={confirmPasswordError.message}
                      />
                      <span
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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
                  <div>
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={handleResetPassword}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}



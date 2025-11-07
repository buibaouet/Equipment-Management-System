import React, { useEffect, useState } from "react";
import type { FC } from "react";

interface InputProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: number) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  required?: boolean;
}

const CurrencyInput: FC<InputProps> = ({
  id,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  required = false,
}) => {
  const [isEmpty, setIsEmpty] = React.useState(false);

  const [displayValue, setDisplayValue] = useState("");

  // Khi prop value thay đổi → format lại
  useEffect(() => {
    if (value) {
      const formatted = new Intl.NumberFormat("vi-VN").format(Number(value)) + " ₫";
      setDisplayValue(formatted);
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Loại bỏ ký tự không phải số
    const raw = val.replace(/[^\d]/g, "");
    const num = raw ? parseInt(raw, 10) : 0;

    // Format hiển thị
    const formatted = num
      ? new Intl.NumberFormat("vi-VN").format(num)
      : "";

    setDisplayValue(formatted);
    // Trả lại số nguyên cho parent
    if (onChange) {
      onChange(num);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (required && e.target.value.trim() === '') {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
    onBlur?.(e);
  };
  let inputClasses = ` h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-90 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-90`;
  } else if (error) {
    inputClasses += `  border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputClasses += `  border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800`;
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={displayValue}
        id={id}
        name={name}
        placeholder={placeholder}
        onChange={(e) => {
          handleChange(e);
          if (e.target.value.trim() !== '') {
            setIsEmpty(false);
          }
        }}
        onBlur={handleBlur}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`${inputClasses} ${isEmpty ? '!border-error-500' : ''}`}
        inputMode="numeric"
        pattern="[0-9]*"
        style={{ MozAppearance: "textfield" }}
        required={required}
      />

      {(hint || (isEmpty && required)) && (
        <p
          className={`mt-1.5 text-xs ${isEmpty || error
            ? "text-error-500"
            : success
              ? "text-success-500"
              : "text-gray-500"
            }`}
        >
          {isEmpty ? "Không được để trống" : hint}
        </p>
      )}
    </div>
  );
};

export default CurrencyInput;

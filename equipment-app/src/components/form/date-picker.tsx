import React, { useEffect } from "react";
import flatpickr from "flatpickr";
import Label from "./Label";
import "flatpickr/dist/flatpickr.css";
import { Calendar1Icon } from 'lucide-react';
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  required?: boolean;
  className?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  disabled = false,
  success = false,
  error = false,
  hint = '',
  required = false,
  className = '',
}: PropsType) {
  const flatPickrRef = React.useRef<flatpickr.Instance | null>(null);
  const [isEmpty, setIsEmpty] = React.useState(false);

  useEffect(() => {
    const flatPickr = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "d/m/Y",
      defaultDate,
      onChange,
    });

    flatPickrRef.current = Array.isArray(flatPickr) ? flatPickr[0] : flatPickr;
    setIsEmpty(false);

    return () => {
      if (flatPickrRef.current) {
        flatPickrRef.current.destroy();
        flatPickrRef.current = null;
      }
    };
  }, [mode, onChange, id]);

  // Update date when defaultDate changes
  useEffect(() => {
    if (flatPickrRef.current && defaultDate !== undefined) {
      // Convert string to Date if needed
      const dateToSet = typeof defaultDate === 'string' ? new Date(defaultDate) : defaultDate;
      flatPickrRef.current.setDate(dateToSet, false);
    } else if (flatPickrRef.current && defaultDate === undefined) {
      flatPickrRef.current.clear();
    }
  }, [defaultDate]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (required && e.target.value.trim() === '') {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
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
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className={`${inputClasses} ${isEmpty ? '!border-error-500' : ''}`}
          disabled={disabled}
          required={required}
          onBlur={handleBlur}
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <Calendar1Icon className="w-4 h-4 mr-2" />
        </span>
      </div>

      {(hint || (isEmpty && required)) && (
        <p
          className={`mt-1.5 text-xs ${
            isEmpty || error
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
}

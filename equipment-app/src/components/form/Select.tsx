import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  required?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  disabled = false,
  success = false,
  error = false,
  hint,
  required = false,
}) => {
  const [isEmpty, setIsEmpty] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(() => {
    if (!defaultValue) return null;
    return options.find(opt => opt.value === defaultValue) || null;
  });
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (defaultValue) {
      const option = options.find(opt => opt.value === defaultValue);
      setSelectedOption(option || null);
    } else {
      setSelectedOption(null);
    }
  }, [defaultValue, options]);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    onChange?.(option.value);
    setIsOpen(false);
    setIsEmpty(false);
  };

  const handleBlur = () => {
    if (required && !selectedOption) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
        return;
      }

      const nextIndex = e.key === 'ArrowDown'
        ? (highlightedIndex + 1) % options.length
        : (highlightedIndex - 1 + options.length) % options.length;
      setHighlightedIndex(nextIndex);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0) {
        handleSelect(options[highlightedIndex]);
      } else {
        setIsOpen(true);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  let inputClasses = ` h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs cursor-pointer select-none flex items-center justify-between ${className}`;

  if (disabled) {
    inputClasses += ` !text-gray-500 border-gray-300 opacity-90 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-90`;
  } else if (error) {
    inputClasses += `  !border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputClasses += `  !border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800`;
  }

  return (
    <div
      className={`relative ${disabled ? "opacity-90 bg-gray-100 cursor-not-allowed pointer-events-none" : ""}`}
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onBlur={handleBlur}
    >
      <div
        className={`${inputClasses}
          ${isOpen ? 'border-brand-300 ring-3 ring-brand-500/10' : ''}
          ${isEmpty ? '!border-error-500' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-gray-800 dark:text-white/90' : 'text-gray-400 dark:text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </div>

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

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-4 py-2.5 text-sm text-gray-400 dark:text-gray-500">
              Không có dữ liệu
            </div>
          ) : (
            options.map((option, index) => (
              <div
                key={option.value}
                className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between
                  ${highlightedIndex === index ? 'bg-brand-50 dark:bg-brand-900/20' : ''}
                  ${selectedOption?.value === option.value ? 'text-brand-600 dark:text-brand-400' : 'text-gray-700 dark:text-gray-200'}
                  hover:bg-brand-50 dark:hover:bg-brand-900/20`}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span>{option.label}</span>
                {selectedOption?.value === option.value && (
                  <Check className="w-4 h-4" />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Select;
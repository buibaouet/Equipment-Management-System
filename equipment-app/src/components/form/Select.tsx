import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
}) => {
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
    onChange(option.value);
    setIsOpen(false);
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

  return (
    <div 
      className="relative"
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className={`h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs cursor-pointer select-none flex items-center justify-between
          ${isOpen ? 'border-brand-300 ring-3 ring-brand-500/10' : ''}
          dark:border-gray-700 dark:bg-gray-900
          ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-gray-800 dark:text-white/90' : 'text-gray-400 dark:text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </div>

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
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error,
  className = "",
  // containerClassName = "",
  disabled = false,
  required = false,
  name,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Find selected label
  const selectedOption = options.find((opt) => {
    const optValue = typeof opt === "object" ? opt.value : opt;
    return String(optValue) === String(value);
  });

  const selectedLabel = selectedOption
    ? typeof selectedOption === "object"
      ? selectedOption.label
      : selectedOption
    : placeholder;

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    const optValue = typeof option === "object" ? option.value : option;

    // Create a synthetic event to match standard standard handleChange(e) pattern
    // This maintains compatibility with existing form handlers
    const syntheticEvent = {
      target: {
        name: name,
        value: optValue,
        type: "select-one", // mimic select element
      },
    };

    onChange(syntheticEvent);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between
          w-full bg-white
          px-4 py-2.5
          rounded-lg border 
          ${error ? "border-error focus:ring-error/10" : isOpen ? "border-primary ring-2 ring-primary/10" : "border-gray-mid hover:border-gray-300"}
          text-sm font-medium
          ${!selectedOption && value === "" ? "text-gray-400" : "text-charcoal"}
          transition-all duration-200
          cursor-pointer
          ${disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed opacity-70" : ""}
        `}
      >
        <span className="truncate mr-2">{selectedLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -5, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -5, scaleY: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden max-h-60 overflow-y-auto"
            style={{ transformOrigin: "top" }}
          >
            <div className="p-1">
              {options.length > 0 ? (
                options.map((option) => {
                  const isObject =
                    typeof option === "object" && option !== null;
                  const optValue = isObject ? option.value : option;
                  const optLabel = isObject ? option.label : option;
                  const isSelected = String(optValue) === String(value);

                  return (
                    <div
                      key={optValue}
                      onClick={() => handleSelect(option)}
                      className={`
                        flex items-center justify-between
                        px-3 py-2.5
                        rounded-lg
                        text-sm font-medium
                        cursor-pointer
                        transition-colors
                        ${isSelected ? "bg-primary/5 text-primary" : "text-charcoal hover:bg-gray-50"}
                      `}
                    >
                      <span className="truncate">{optLabel}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-2" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-sm text-gray-400 text-center">
                  No options available
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="flex items-center gap-1 mt-1.5 text-error text-xs">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

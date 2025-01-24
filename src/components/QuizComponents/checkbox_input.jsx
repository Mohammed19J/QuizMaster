import { h } from "preact";

// Checkbox input component for forms
const CheckboxInput = ({
  label,
  checked,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <div className={`mt-4 flex items-center ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`form-checkbox h-4 w-4 text-blue-600 transition-colors ${
          disabled
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-600 cursor-pointer"
        }`}
      />
      {label && (
        <label
          className={`ml-2 text-sm font-medium ${
            disabled
              ? "text-gray-500 dark:text-gray-400"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default CheckboxInput;
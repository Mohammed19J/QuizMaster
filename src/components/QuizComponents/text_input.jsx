import { h } from "preact";

const TextInput = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
  required = false,
  disabled = false,
}) => {
  return (
    <div className={`mt-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled
            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
        }`}
      />
    </div>
  );
};

export default TextInput;
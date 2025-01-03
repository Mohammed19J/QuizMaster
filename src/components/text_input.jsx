import { h } from "preact";

const TextInput = ({ label, placeholder, value, onChange, type = "text", className = "" }) => {
    return (
        <div className={`mt-4 ${className}`}>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
        </div>
    );
};

export default TextInput;

import { h } from "preact";

// SelectInput component 
const SelectInput = ({ label, options, value, onChange, className = "" }) => {
    return (
        <div className={`mt-4 ${className}`}>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                {label}
            </label>
            <select
                value={value}
                onChange={onChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectInput;

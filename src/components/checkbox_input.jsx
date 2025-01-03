import { h } from "preact";

const CheckboxInput = ({ label, checked, onChange, className = "" }) => {
    return (
        <div className={`mt-4 flex items-center ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="mr-2"
            />
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {label}
            </label>
        </div>
    );
};

export default CheckboxInput;

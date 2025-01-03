import { h } from "preact";

const Button = ({ text, onClick, className = "" }) => {
    return (
        <button
            onClick={onClick}
            className={`text-blue-600 hover:text-blue-800 px-4 py-2 text-base transition-colors duration-200 ${className}`}
        >
            {text}
        </button>
    );
};

export default Button;
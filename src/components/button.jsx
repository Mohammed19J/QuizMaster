const Button = ({ text, onClick, color, className = "" }) => {
    return (
        <button
            onClick={onClick}
            className={`text-white bg-${color}-500 hover:bg-${color}-600 px-4 py-2 rounded transition-colors duration-200 ${className}`}
        >
            {text}
        </button>
    );
};

export default Button;

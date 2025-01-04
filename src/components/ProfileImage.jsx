import { h } from "preact";
import { useState } from "preact/hooks";

const ProfileImage = ({ src, alt, size = "50px", className = "", name = "" }) => {
    const [imageFailed, setImageFailed] = useState(false);

    // Extract the first letter of the name for the fallback
    const initial = name ? name.charAt(0).toUpperCase() : "U";

    const handleImageError = () => {
        // If the image fails to load, set the state to show the fallback initial
        setImageFailed(true);
    };

    return (
        <div
            className={`rounded-full overflow-hidden border-2 border-blue-500 flex items-center justify-center ${className}`}
            style={{ 
                width: size, 
                height: size, 
                backgroundColor: imageFailed || !src ? "#3B82F6" : "transparent", // Blue background if no image
                color: imageFailed || !src ? "white" : "transparent", // White text if no image
                fontSize: `calc(${size} * 0.5)`, // Dynamic font size based on the circle size
                fontWeight: "bold",
            }}
        >
            {imageFailed || !src ? (
                // Show the initial if the image fails to load or is not provided
                <span>{initial}</span>
            ) : (
                // Show the image if it loads successfully
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                />
            )}
        </div>
    );
};

export default ProfileImage;
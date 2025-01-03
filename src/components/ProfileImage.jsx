const ProfileImage = ({ src, alt, size = "50px", className = "" }) => {
    return (
        <div
            className={`rounded-full overflow-hidden border-2 border-blue-500 ${className}`}
            style={{ width: size, height: size }}
        >
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default ProfileImage;

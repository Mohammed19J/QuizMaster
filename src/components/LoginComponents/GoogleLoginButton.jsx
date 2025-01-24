// Google login button component that will be rendered in the LoginLayout component
const GoogleLoginButton = ({ onClick, className }) => {
  return (
      <button className={className} onClick={onClick}>
          Sign in with Google
      </button>
  );
};

export default GoogleLoginButton;

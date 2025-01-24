//Welcome message component that will be rendered in the login layout
const WelcomeMessage = ({ text, className }) => {
  return <h1 className={className}>{text}</h1>;
};

export default WelcomeMessage;

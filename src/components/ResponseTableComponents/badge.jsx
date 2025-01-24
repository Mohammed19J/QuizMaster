import * as React from "react";

// Badge component
const Badge = React.forwardRef(({ variant = "default", className, ...props }, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };
  // Return the badge component
  return (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none ${variants[variant]} ${className}`}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
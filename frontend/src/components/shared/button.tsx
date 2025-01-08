import React from "react";
import { cn } from "src/utils/classname";

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { variant: "primary" | "secondary" };

function Button({ variant, className, ...props }: Props) {
  const buttonVariants = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    variant === "primary"
      ? "bg-grass-700 text-white"
      : variant === "secondary" && "bg-grass-300 text-grass-900",
    className
  );

  return <button className={cn(buttonVariants)} {...props} />;
}

export default Button;

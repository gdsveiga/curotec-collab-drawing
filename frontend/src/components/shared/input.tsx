import React, { ReactNode } from "react";
import { cn } from "src/utils/classname";
import { ClassNameValue } from "tailwind-merge";

type Props = { adornment?: ReactNode } & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

function Input({ className, type, adornment, ...props }: Props) {
  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          adornment ? "pr-5" : null,
          className
        )}
        {...props}
      />

      {adornment ? (
        <div className="absolute top-1/2 -translate-y-1/2 right-2 select-none">
          {adornment}
        </div>
      ) : null}
    </div>
  );
}

export default Input;

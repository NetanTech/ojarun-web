"use client";

import clsx from "clsx";
import Link from "next/link";
import React from "react";




const Button = ({
  onClick,
  isDisabled,
  isLoading,
  children,
  leftIcon,
  rightIcon,
  variant,
  size,
  as,
  className,
  to,
  ...buttonProps
}: ButtonProps) => {
  const sizeStyles = {
    lg: "px-[16px] py-[12px] text-[16px]",
    sm: " px-[12px] py-[8px] text-[14px] leading-[20px]",
  };

  const styleVariants = {
    secondary: 
      "  disabled:bg-green-50 disabled:border disabled:border-grey-100  rounded-[8px] disabled:opacity-10 focus-within:text-green-700 focus-within:border-[2px] focus-within:border-green-700 hover:border-[1.5px] hover:border-green-600 hover:text-green-600  border border-[#E7E7E7] text-black font-medium body-medium",
    primary: "disabled:bg-green-100  rounded-[8px] disabled:opacity-10 focus-within:bg-green-700 focus-within:text-white hover:bg-green-400 focus-within:border-0 hover:border-[0px] hover:text-white bg-green-500 text-white font-medium body-medium"
  };
  return (
    <>
      {as === "link" ? (
        <Link
          href={to ?? "#"}
          className={clsx(
            className,
            "flex items-center justify-center gap-2 transition hover:cursor-pointer duration-200",
            sizeStyles[size],
            styleVariants[variant],
            (isDisabled || isLoading) && "cursor-not-allowed opacity-60",
          )}
        >
          {leftIcon && <span className="flex items-center">{leftIcon}</span>}

          {children}

          {rightIcon && <span className="flex items-center">{rightIcon}</span>}
        </Link>
      ) : (
        <button
          onClick={onClick}
          disabled={isDisabled || isLoading}
          className={clsx(
            className,
            "flex items-center justify-center gap-2 transition hover:cursor-pointer duration-200 text-center",
            sizeStyles[size],
            styleVariants[variant],
            (isDisabled || isLoading) && "cursor-not-allowed opacity-60",
          )}
          {...buttonProps}
        >
          {leftIcon && <span className="flex items-center">{leftIcon}</span>}

          {children}

          {rightIcon && <span className="flex items-center">{rightIcon}</span>}
        </button>
      )}
    </>
  );
};

export default Button;

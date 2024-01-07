import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { twMerge } from "tailwind-merge";

const variants = cva(
  "button font-bold font-mona-sans transition-all hover:brightness-75",
  {
    variants: {
      kind: {
        primary: [
          "bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
        ],
        secondary: [
          "text-slate-100",
          "ring-slate-100",
          "hover:ring-slate-200/60"
        ],
        enum: ["ring-[#a855f7]"],
        model: ["ring-[#0d9488]"],
        plugin: ["ring-[#ec4899]"],
        request: ["ring-[#0891b2]"],
        object: ["ring-[#b91c1c]"],
        event: ["ring-[#c2410c]"],
        ghost: ["ring-transparent"]
      },
      size: {
        sm: ["text-xs", "px-2", "py-1", "ring-1"],
        md: ["text-sm", "px-3", "py-2", "ring-2"],
        lg: ["text-lg", "px-5", "py-4", "ring"]
      },
      rounded: {
        none: ["rounded-none"],
        sm: ["rounded-sm"],
        md: ["rounded-md"],
        lg: ["rounded-lg"],
        full: ["rounded-full"]
      },
      fill: {
        outlined: [],
        filled: ["text-slate-100"]
      },
      status: {
        disabled: ["opacity-80 pointer-events-none"],
        enabled: ["opacity-100 cursor-pointer active:scale-95"]
      }
    },
    compoundVariants: [
      {
        kind: "primary",
        fill: "filled",
        className: "text-slate-100"
      },
      {
        kind: "secondary",
        fill: "filled",
        className: "bg-slate-100"
      },
      {
        kind: "ghost",
        fill: "filled",
        className: "bg-slate-100"
      },
      {
        kind: "enum",
        fill: "filled",
        className: "bg-[#a855f7]"
      },
      {
        kind: "model",
        fill: "filled",
        className: "bg-[#0d9488]"
      },
      {
        kind: "plugin",
        fill: "filled",
        className: "bg-[#ec4899]"
      },
      {
        kind: "request",
        fill: "filled",
        className: "bg-[#0891b2]"
      },
      {
        kind: "object",
        fill: "filled",
        className: "bg-[#b91c1c]"
      },
      {
        kind: "event",
        fill: "filled",
        className: "bg-[#c2410c]"
      },
      {
        kind: "primary",
        fill: "outlined",
        className: "bg-clip-text text-transparent"
      },
      {
        kind: "secondary",
        fill: "outlined",
        className: "text-slate-100"
      },
      {
        kind: "ghost",
        fill: "outlined",
        className: "text-slate-100"
      },
      {
        kind: "enum",
        fill: "outlined",
        className: "text-[#a855f7]"
      },
      {
        kind: "model",
        fill: "outlined",
        className: "text-[#0d9488]"
      },
      {
        kind: "plugin",
        fill: "outlined",
        className: "text-[#ec4899]"
      },
      {
        kind: "request",
        fill: "outlined",
        className: "text-[#0891b2]"
      },
      {
        kind: "object",
        fill: "outlined",
        className: "text-[#b91c1c]"
      },
      {
        kind: "event",
        fill: "outlined",
        className: "text-[#c2410c]"
      },
      {
        rounded: "full",
        size: "sm",
        className: "px-2 py-2"
      },
      {
        rounded: "full",
        size: "md",
        className: "px-3 py-3"
      },
      {
        rounded: "full",
        size: "lg",
        className: "px-5 py-5"
      },
      {
        kind: "ghost",
        status: "enabled",
        className: "active:scale-75"
      }
    ],
    defaultVariants: {
      kind: "primary",
      size: "md",
      rounded: "md",
      fill: "outlined",
      status: "enabled"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {
  /**
   * The content of the button for screen readers.
   *
   * @remarks
   * This value is hidden visually but read aloud by screen readers.
   **/
  screenReader?: string;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  kind,
  size,
  rounded,
  fill,
  children,
  disabled = false,
  screenReader,
  ...props
}: ButtonProps) => (
  <button
    className={twMerge(
      variants({
        kind,
        size,
        className,
        rounded,
        fill,
        status: disabled ? "disabled" : "enabled"
      })
    )}
    {...props}>
    <span className="sr-only">{screenReader ? screenReader : children}</span>
    {children}
  </button>
);

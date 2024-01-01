import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { twMerge } from "tailwind-merge";

const variants = cva("button font-bold font-mona-sans transition-all", {
  variants: {
    nodeType: {
      primary: ["text-slate-100", "ring-slate-100", "hover:ring-slate-200/60"],
      enum: ["ring-[#a855f7]", "hover:ring-violet-700"],
      model: ["ring-[#0d9488]", "hover:ring-teal-700"],
      plugin: ["ring-[#ec4899]", "hover:ring-pink-700"],
      request: ["ring-[#0891b2]", "hover:ring-sky-700"],
      object: ["ring-[#b91c1c]", "hover:ring-red-900"],
      event: ["ring-[#c2410c]", "hover:ring-orange-800"],
      ghost: ["ring-transparent", "hover:ring-slate-200/30"]
    },
    size: {
      small: ["text-xs", "px-2", "py-1", "ring-2"],
      medium: ["text-sm", "px-3", "py-2", "ring"],
      large: ["text-lg", "px-5", "py-4", "ring-4"]
    },
    rounded: {
      none: ["rounded-none"],
      small: ["rounded-sm"],
      medium: ["rounded-md"],
      large: ["rounded-lg"],
      full: ["rounded-full"]
    },
    fill: {
      outlined: ["bg-transparent"],
      filled: ["bg-slate-100 text-slate-700"]
    },
    status: {
      disabled: ["opacity-80 cursor-not-allowed"],
      enabled: ["opacity-100 cursor-pointer active:scale-95"]
    }
  },
  compoundVariants: [
    {
      nodeType: "primary",
      fill: "filled",
      className: "bg-slate-100 hover:bg-slate-200/60"
    },
    {
      nodeType: "ghost",
      fill: "filled",
      className: "bg-slate-100 hover:bg-slate-200/30"
    },
    {
      nodeType: "enum",
      fill: "filled",
      className: "bg-[#a855f7] hover:bg-violet-700"
    },
    {
      nodeType: "model",
      fill: "filled",
      className: "bg-[#0d9488] hover:bg-teal-700"
    },
    {
      nodeType: "plugin",
      fill: "filled",
      className: "bg-[#ec4899] hover:bg-pink-700"
    },
    {
      nodeType: "request",
      fill: "filled",
      className: "bg-[#0891b2] hover:bg-sky-700"
    },
    {
      nodeType: "object",
      fill: "filled",
      className: "bg-[#b91c1c] hover:bg-red-900"
    },
    {
      nodeType: "event",
      fill: "filled",
      className: "bg-[#c2410c] hover:bg-orange-800"
    },
    {
      nodeType: "primary",
      fill: "outlined",
      className: "text-slate-100 hover:text-slate-200/60"
    },
    {
      nodeType: "ghost",
      fill: "outlined",
      className: "text-slate-100 hover:text-slate-200/60"
    },
    {
      nodeType: "enum",
      fill: "outlined",
      className: "text-[#a855f7] hover:text-violet-700"
    },
    {
      nodeType: "model",
      fill: "outlined",
      className: "text-[#0d9488] hover:text-teal-700"
    },
    {
      nodeType: "plugin",
      fill: "outlined",
      className: "text-[#ec4899] hover:text-pink-700"
    },
    {
      nodeType: "request",
      fill: "outlined",
      className: "text-[#0891b2] hover:text-sky-700"
    },
    {
      nodeType: "object",
      fill: "outlined",
      className: "text-[#b91c1c] hover:text-red-900"
    },
    {
      nodeType: "event",
      fill: "outlined",
      className: "text-[#c2410c] hover:text-orange-800"
    },
    {
      rounded: "full",
      size: "small",
      className: "px-2 py-2"
    },
    {
      rounded: "full",
      size: "medium",
      className: "px-3 py-3"
    },
    {
      rounded: "full",
      size: "large",
      className: "px-5 py-5"
    }
  ],
  defaultVariants: {
    nodeType: "primary",
    size: "medium",
    rounded: "medium",
    fill: "outlined",
    status: "enabled"
  }
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {}

export const Button: React.FC<ButtonProps> = ({
  className,
  nodeType,
  size,
  rounded,
  fill,
  ...props
}: ButtonProps) => (
  <button
    className={twMerge(variants({ nodeType, size, className, rounded, fill }))}
    {...props}
  />
);

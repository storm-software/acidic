import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { twMerge } from "tailwind-merge";

const variants = cva(
  "font-mona-sans-light transition-all duration-200 underline-offset-4",
  {
    variants: {
      kind: {
        primary: "text-gray-100",
        secondary: "text-gray-400 underline",
        tertiary: "text-gray-100",
        quarternary: "text-sky-600 underline",
        cta: "text-gray-100 uppercase"
      },
      status: {
        disabled: "opacity-80 pointer-events-none",
        enabled: "opacity-100 cursor-pointer active:scale-95",
        active: "opacity-100 pointer-events-none font-mona-sans font-bold"
      }
    },
    compoundVariants: [
      {
        kind: "primary",
        status: "enabled",
        className: "hover:text-[#1fb2a6] hover:underline"
      },
      {
        kind: "secondary",
        status: "enabled",
        className: "hover:text-gray-100"
      },
      {
        kind: "tertiary",
        status: "enabled",
        className: "hover:text-gray-100 hover:underline"
      },
      {
        kind: "quarternary",
        status: "enabled",
        className: "hover:text-sky-400"
      },
      {
        kind: "cta",
        status: "enabled",
        className: "hover:text-[#1fb2a6] hover:underline"
      }
    ],
    defaultVariants: {
      kind: "primary",
      status: "enabled"
    }
  }
);

export interface LinkProps
  extends React.LinkHTMLAttributes<HTMLParagraphElement>,
    Omit<VariantProps<typeof variants>, "status"> {
  /**
   * The content of the button for screen readers.
   *
   * @remarks
   * This value is hidden visually but read aloud by screen readers.
   **/
  screenReader?: string;

  /**
   * Is the link disabled
   *
   * @default `false`
   */
  disabled?: boolean;

  /**
   * Is the link active
   *
   * @default `false`
   */
  active?: boolean;
}

export const Link: React.FC<LinkProps> = ({
  className,
  kind,
  children,
  screenReader,
  disabled = false,
  ...props
}: LinkProps) => (
  <p
    className={twMerge(
      variants({ kind, className, status: disabled ? "disabled" : "enabled" })
    )}
    {...props}>
    <span className="sr-only">{screenReader ? screenReader : children}</span>
    {children}
  </p>
);

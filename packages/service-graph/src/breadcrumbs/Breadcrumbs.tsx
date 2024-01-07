import clsx from "clsx";
import React from "react";
import { Link } from "../link";

export interface BreadcrumbItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

export interface BreadcrumbsProps
  extends React.BaseHTMLAttributes<HTMLParagraphElement> {
  /**
   * The breadcrumb items to display.
   */
  items?: BreadcrumbItem[];

  /**
   * The kind of links to render.
   *
   * @default "primary"
   */
  kind?: "primary" | "secondary" | "tertiary" | "cta";
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  className,
  kind = "primary",
  items = [],
  ...props
}: BreadcrumbsProps) => {
  return (
    <div className={clsx(className, "flex flex-row gap-0")}>
      {items.map((item, index) => (
        <div key={index} className="flex flex-row items-center gap-1">
          {item.icon && <span className="text-gray-400">{item.icon}</span>}
          <Link
            kind={kind}
            {...props}
            className="text-xs"
            onClick={item.onClick}>
            {item.label}
          </Link>
          {index < items.length - 1 && (
            <span className="mb-1.5 rotate-90 text-gray-400">
              <svg
                className="w-4 origin-center rotate-180"
                viewBox="6 6 15 15"
                fill="none">
                <g strokeWidth="0"></g>
                <g strokeLinecap="round" strokeLinejoin="round"></g>
                <g>
                  <path
                    className="stroke-gray-200"
                    d="m8 10 4 4 4-4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"></path>
                </g>
              </svg>
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

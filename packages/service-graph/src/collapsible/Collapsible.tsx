import clsx from "clsx";
import React, { ReactNode, useState } from "react";
import "reactflow/dist/style.css";
import { useEvent } from "../hooks";

export interface CollapsibleProps {
  className?: string;
  children: ReactNode;
}

export const Collapsible = ({ children, className }: CollapsibleProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const toggleCollapse = useEvent(() => setIsCollapsed(!isCollapsed));

  return (
    <div
      onClick={toggleCollapse}
      className={clsx(
        "group/collapsible flex w-full cursor-pointer flex-col gap-2 overflow-hidden",
        className
      )}>
      <div
        className={clsx(
          "duration-600 flex transform flex-col gap-2 transition ease-in-out",
          {
            "hidden": isCollapsed
          }
        )}>
        {children}
      </div>
      <div
        className={clsx(
          "duration-600 flex w-full origin-center transform justify-center transition ease-in-out",
          { "rotate-180": isCollapsed },
          { "-translate-y-0.0 rotate-0": !isCollapsed }
        )}>
        <svg
          className="w-8 origin-center rotate-180"
          viewBox="6 6 15 15"
          fill="none">
          <g strokeWidth="0"></g>
          <g strokeLinecap="round" strokeLinejoin="round"></g>
          <g>
            <path
              className="stroke-gray-400 transition-colors group-hover/collapsible:stroke-white"
              d="m8 10 4 4 4-4"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"></path>
          </g>
        </svg>
      </div>
    </div>
  );
};

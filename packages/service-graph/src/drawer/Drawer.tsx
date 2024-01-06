import clsx from "clsx";
import React, { ReactNode, useState } from "react";
import "reactflow/dist/style.css";
import { Button } from "../button";
import { useEvent } from "../hooks";

export interface DrawerProps {
  className?: string;
  children: ReactNode;
}

export const Drawer = ({ children, className }: DrawerProps) => {
  const [isOpened, setIsOpened] = useState(true);
  const handleClose = useEvent(() => setIsOpened(false));

  return (
    <div
      className={clsx(
        "start-0 border-e fixed top-0 z-[60]  h-full w-full max-w-xs -translate-x-full transform bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-800",
        className,
        { "hidden": !isOpened },
        { "translate-x-0": isOpened }
      )}
      tabIndex={-1}>
      <div className="flex items-center justify-between border-b py-3 px-4 dark:border-gray-700">
        <h3 className="font-bold text-gray-800 dark:text-white">
          Colored with scrolling
        </h3>

        <Button
          className="group absolute top-1.5 right-2"
          kind="ghost"
          size="small"
          rounded="full"
          screenReader="Close Drawer">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-5 w-5 stroke-slate-200 stroke-2 transition-colors duration-200 group-hover:stroke-slate-200/60">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

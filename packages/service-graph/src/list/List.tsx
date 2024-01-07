import { isSet } from "@storm-stack/utilities";
import clsx from "clsx";
import React, { ReactNode } from "react";

export interface ListProps {
  className?: string;
  children: ReactNode;
  headers: string[];
  footer?: ReactNode | string;
}

export const List = ({ headers, footer, className, children }: ListProps) => {
  return (
    <table
      className={clsx(
        "w-full table-fixed border-collapse border-spacing-4",
        className
      )}>
      <thead className="text-md border-b-[1px] border-b-slate-400 text-left font-mona-sans text-slate-100 transition-all">
        <tr>
          {headers.map(header => (
            <th key={header} className="px-2">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="text-ellipsis font-mona-sans-light">{children}</tbody>
      {isSet(footer) && <caption className="caption-bottom">{footer}</caption>}
    </table>
  );
};

import clsx from "clsx";
import React, { ReactNode } from "react";

export interface TableProps {
  className?: string;
  children: ReactNode;
  headers: string[];
}

export const Table = ({ headers, className, children }: TableProps) => {
  return (
    <table
      className={clsx(
        "w-full table-auto border-collapse border-spacing-2",
        className
      )}>
      <thead className="border-b-[1px] border-b-slate-400 text-left font-mona-sans text-slate-100 transition-all">
        <tr>
          {headers.map(header => (
            <th>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody className="font-mona-sans-light">{children}</tbody>
    </table>
  );
};

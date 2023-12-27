import { NEWLINE_STRING } from "@storm-stack/utilities";
import clsx from "clsx";
import { ReactNode } from "react";
import "reactflow/dist/style.css";

export interface BaseNodeProps {
  name: string;
  comments?: string[];
  className?: string;
  children: ReactNode;
}

export const BaseNode = ({
  name: title,
  comments,
  className,
  children
}: BaseNodeProps) => {
  return (
    <div
      className={clsx(
        className,
        "bg-slate-700 border-slate-600/500 border-2 w-full h-full flex-col p-2 gap-2"
      )}>
      <div className="w-full border-[1px] border-slate-600/500 bg-slate-900 text-white rounded-lg">
        <h1>{title}</h1>
      </div>
      {comments && comments.length > 0 && (
        <div className="w-full border-[1px] border-slate-600/500 bg-slate-900 text-white rounded-lg">
          <p>{comments.join(NEWLINE_STRING)}</p>
        </div>
      )}
      <div className="w-full border-[1px] border-slate-600/500 bg-slate-900 rounded-lg grow">
        {children}
      </div>
    </div>
  );
};

import { NodeKind } from "@acidic/schema";
import clsx from "clsx";
import React, { ReactNode } from "react";
import { NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import { useEvent } from "../hooks";
import { getNodeType } from "../utilities";

export interface BaseNodeComponentProps extends NodeProps {
  name: string;
  kind: NodeKind;
  comments?: string[];
  className?: string;
  children: ReactNode;
  isDraggable?: boolean;
}

export const BaseNode = ({
  name,
  kind,
  comments,
  className,
  isDraggable = true,
  xPos,
  yPos,
  selected,
  children
}: BaseNodeComponentProps) => {
  const onDragStart = useEvent(event => {
    event.dataTransfer.setData("application/reactflow", getNodeType(kind));
    event.dataTransfer.effectAllowed = "move";
  });

  return (
    <div className="group relative flex w-96 flex-col text-ellipsis subpixel-antialiased">
      {isDraggable && (
        <div className="flex flex-row justify-center">
          <div
            draggable={true}
            onDragStart={onDragStart}
            className="acidic-drag z-20 translate-y-12 cursor-grab rounded-t-md border-black bg-gray-700 px-2 transition-transform duration-700 active:cursor-grabbing group-hover:translate-y-1">
            <svg viewBox="0 0 24 24" fill="none" className="h-10">
              <g strokeWidth="0"></g>
              <g strokeLinecap="round" strokeLinejoin="round"></g>
              <g>
                <g>
                  <g>
                    <path
                      d="M18 14C17.4477 14 17 14.4477 17 15C17 15.5523 17.4477 16 18 16C18.5523 16 19 15.5523 19 15C19 14.4477 18.5523 14 18 14Z"
                      stroke="#e2e8f0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"></path>
                    <path
                      d="M12 14C11.4477 14 11 14.4477 11 15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15C13 14.4477 12.5523 14 12 14Z"
                      stroke="#e2e8f0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"></path>
                    <path
                      d="M6 14C5.44772 14 5 14.4477 5 15C5 15.5523 5.44772 16 6 16C6.55228 16 7 15.5523 7 15C7 14.4477 6.55228 14 6 14Z"
                      stroke="#e2e8f0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"></path>
                    <path
                      d="M18 8C17.4477 8 17 8.44772 17 9C17 9.55228 17.4477 10 18 10C18.5523 10 19 9.55228 19 9C19 8.44772 18.5523 8 18 8Z"
                      stroke="#e2e8f0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"></path>
                    <path
                      d="M12 8C11.4477 8 11 8.44772 11 9C11 9.55228 11.4477 10 12 10C12.5523 10 13 9.55228 13 9C13 8.44772 12.5523 8 12 8Z"
                      stroke="#e2e8f0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"></path>
                    <path
                      d="M6 8C5.44772 8 5 8.44772 5 9C5 9.55228 5.44772 10 6 10C6.55228 10 7 9.55228 7 9C7 8.44772 6.55228 8 6 8Z"
                      stroke="#e2e8f0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"></path>
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}
      <div
        className={clsx(
          className,
          "wrapper gradient acidic-no-drag z-30 flex cursor-default rounded-md"
        )}>
        <div
          className={clsx(
            className,
            "z-40 flex cursor-default flex-col gap-2 rounded-md border-2 border-slate-100/10 bg-gray-700"
          )}>
          <div className="bg-slate-200/10">
            <div
              className={clsx(
                "flex w-full justify-center rounded-t-md border-b-4 bg-gradient-to-r p-2",
                {
                  "border-b-[#a855f7] from-[#a855f7]/40": kind === NodeKind.ENUM
                },
                {
                  "border-b-[#0d9488] from-[#0d9488]/40":
                    kind === NodeKind.MODEL
                },
                {
                  "border-b-[#ec4899] from-[#ec4899]/40":
                    kind === NodeKind.PLUGIN
                },
                {
                  "border-b-[#0891b2] from-[#0891b2]/40":
                    kind === NodeKind.OPERATION
                },
                {
                  "border-b-[#b91c1c] from-[#b91c1c]/40":
                    kind === NodeKind.OBJECT
                },
                {
                  "border-b-[#c2410c] from-[#c2410c]/40":
                    kind === NodeKind.EVENT
                }
              )}>
              <h1 className="font-mona-sans text-xl font-bold text-slate-100">
                {name}
              </h1>
            </div>
          </div>
          {comments && comments.length > 0 && (
            <div className="w-full bg-slate-200/10 p-2 py-1 font-mona-sans-light text-slate-200">
              <p className="text-md text-pretty">{comments.join(" ")}</p>
            </div>
          )}
          <div className="w-full grow">{children}</div>
          <div className="flex justify-center p-1 pt-0 pb-2">
            <div
              className={clsx(
                "rounded-md border-2 px-5 pt-1 pb-[0.2rem] font-mona-sans text-sm font-bold leading-none",
                { "border-[#a855f7] text-[#a855f7]": kind === NodeKind.ENUM },
                { "border-[#0d9488] text-[#0d9488]": kind === NodeKind.MODEL },
                {
                  "border-[#ec4899] text-[#ec4899]": kind === NodeKind.PLUGIN
                },
                {
                  "border-[#0891b2] text-[#0891b2]": kind === NodeKind.OPERATION
                },
                { "border-[#b91c1c] text-[#b91c1c]": kind === NodeKind.OBJECT },
                { "border-[#c2410c] text-[#c2410c]": kind === NodeKind.EVENT }
              )}>
              <p>{kind}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

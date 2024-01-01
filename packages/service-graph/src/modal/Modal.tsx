import React, { ReactNode } from "react";
import "reactflow/dist/style.css";
import { Button } from "../button";
import { NodeType } from "../types";

export interface ModalProps {
  className?: string;
  children: ReactNode;
  title: string;
  type: NodeType;
}

export const Modal = ({ children, title, type }: ModalProps) => {
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true">
      <div className="fixed inset-0 animate-fade-in bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative min-h-[300px] transform overflow-hidden rounded-lg border-[1px] border-black bg-slate-700 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <Button
              className="group absolute top-1.5 right-2"
              nodeType="ghost"
              size="small"
              rounded="full">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-5 w-5 stroke-slate-200 stroke-2 transition-colors duration-200 group-hover:stroke-slate-200/60">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </Button>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

import { NodeKind } from "@acidic/definition";
import clsx from "clsx";
import React, { ReactNode } from "react";
import "packages/service-graph/node_modules/reactflow/dist/style.css";

export interface ModalProps {
  className?: string;
  children: ReactNode;
  title: string;
  type: NodeKind;
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
          <div className="relative transform overflow-hidden rounded-lg border-[1px] border-black bg-slate-700 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    className="text-base font-semibold leading-6 text-gray-900"
                    id="modal-title">
                    {title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to deactivate your account? All of
                      your data will be permanently removed. This action cannot
                      be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className={clsx(
                  "mt-3 inline-flex w-full justify-center rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold shadow-sm ring-2 ring-inset hover:bg-slate-600 sm:mt-0 sm:w-auto",
                  { "text-[#a855f7] ring-[#a855f7]": type === NodeKind.ENUM },
                  {
                    "text-[#0d9488] ring-[#0d9488]": type === NodeKind.MODEL
                  },
                  {
                    "text-[#ec4899] ring-[#ec4899]": type === NodeKind.PLUGIN
                  },
                  {
                    "text-[#0891b2] ring-[#0891b2]":
                      type === NodeKind.QUERY ||
                      type === NodeKind.MUTATION ||
                      type === NodeKind.SUBSCRIPTION
                  },
                  {
                    "text-[#b91c1c] ring-[#b91c1c]": type === NodeKind.OBJECT
                  },
                  { "text-[#c2410c] ring-[#c2410c]": type === NodeKind.EVENT }
                )}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

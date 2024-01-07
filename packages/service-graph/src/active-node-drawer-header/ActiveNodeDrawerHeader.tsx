import {
  EnumFieldSchema,
  NodeKind,
  NodeSchema,
  ObjectFieldSchema,
  ServiceSchema
} from "@acidic/schema";
import clsx from "clsx";
import React, { ComponentPropsWithoutRef } from "react";
import "reactflow/dist/style.css";
import { Breadcrumbs } from "../breadcrumbs";

export interface ActiveNodeDrawerHeaderProps
  extends ComponentPropsWithoutRef<"div"> {
  /**
   * The service schema.
   */
  service: ServiceSchema;

  /**
   * The node content of the drawer.
   */
  node: NodeSchema | null;

  /**
   * The current node field displayed in the drawer.
   */
  field: ObjectFieldSchema | EnumFieldSchema | null;
}

export const ActiveNodeDrawerHeader = ({
  className,
  node,
  field,
  service,
  ...props
}: ActiveNodeDrawerHeaderProps) => {
  const breadcrumbs = [{ label: service.name, onClick: () => {} }];
  if (node?.name) {
    breadcrumbs.push({ label: node.name, onClick: () => {} });
  }
  if (field?.name) {
    breadcrumbs.push({ label: field.name, onClick: () => {} });
  }

  return (
    <div
      className={clsx(
        className,
        "z-40 flex cursor-default flex-col gap-2 rounded-md bg-gray-700"
      )}>
      <div className="bg-slate-200/10">
        <div
          className={clsx(
            "flex min-h-[4rem] w-full flex-col gap-2 rounded-t-md border-b-4 bg-gradient-to-r p-2 px-3 transition-colors duration-700 ease-in-out",
            {
              "border-b-[#a855f7] from-[#a855f7]/40":
                node?.kind === NodeKind.ENUM
            },
            {
              "border-b-[#0d9488] from-[#0d9488]/40":
                node?.kind === NodeKind.MODEL
            },
            {
              "border-b-[#ec4899] from-[#ec4899]/40":
                node?.kind === NodeKind.PLUGIN
            },
            {
              "border-b-[#0891b2] from-[#0891b2]/40":
                node?.kind === NodeKind.QUERY ||
                node?.kind === NodeKind.MUTATION ||
                node?.kind === NodeKind.SUBSCRIPTION
            },
            {
              "border-b-[#b91c1c] from-[#b91c1c]/40":
                node?.kind === NodeKind.OBJECT
            },
            {
              "border-b-[#c2410c] from-[#c2410c]/40":
                node?.kind === NodeKind.EVENT
            },
            {
              "border-b-[#4b5563] from-[#4b5563]/40": !!service
            }
          )}>
          <div className="flex">
            <Breadcrumbs kind="tertiary" items={breadcrumbs} />
          </div>
          <div className="flex flex-row justify-center">
            <h2 className="font-mona-sans text-xl font-bold text-slate-100">
              {field?.name ? field.name : node?.name ? node.name : service.name}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

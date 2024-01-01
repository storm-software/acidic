import React from "react";
import "reactflow/dist/style.css";
import { serviceAtoms } from "../state";
import { useGraphStore } from "../state/create-graph-store";
import { BaseNodeProps } from "../types";
import clsx from "clsx";

export interface ServiceNodeProps extends BaseNodeProps {
  className?: string;
}

export const ServiceNode = ({ className, id }: ServiceNodeProps) => {
  const schema = useGraphStore().get.atom(serviceAtoms(id));
  if (!schema) {
    return null;
  }

  return (
    <div className={clsx("border-slate-600/500 border-2 ", className)}></div>
  );
};

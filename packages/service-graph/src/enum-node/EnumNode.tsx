import { NodeKind } from "@acidic/schema";
import React from "react";
import "reactflow/dist/style.css";
import { BaseNode } from "../base-node";
import { NodeFieldTable } from "../node-field-table";
import { enumAtoms, useGraphStore } from "../state";
import { BaseNodeProps } from "../types";

export const EnumNode = ({ id, ...props }: BaseNodeProps) => {
  const schema = useGraphStore().get.atom(enumAtoms(id));
  if (!schema) {
    return null;
  }

  return (
    <BaseNode
      id={id}
      {...props}
      name={schema.name}
      kind={NodeKind.ENUM}
      comments={schema.comments}>
      <div className="bg-slate-200/10 px-2 pb-1">
        <NodeFieldTable
          node={schema}
          kind={NodeKind.ENUM}
          headers={["Enum Field", "Enum Value"]}
        />
      </div>
    </BaseNode>
  );
};

import { NodeKind } from "@acidic/definition";
import React from "react";
import "packages/service-graph/node_modules/reactflow/dist/style.css";
import { BaseNode } from "../base-node";
import { NodeFieldList } from "../node-field-list";
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
      <div className="bg-slate-200/10 pb-1">
        <NodeFieldList
          id={id}
          node={schema}
          kind={NodeKind.ENUM}
          headers={["Enum Field", "Enum Value"]}
        />
      </div>
    </BaseNode>
  );
};

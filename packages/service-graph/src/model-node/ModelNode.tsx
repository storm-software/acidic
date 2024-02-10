import { NodeKind } from "@acidic/definition";
import React from "react";
import "packages/service-graph/node_modules/reactflow/dist/style.css";
import { BaseNode } from "../base-node";
import { NodeFieldList } from "../node-field-list";
import { modelAtoms, useGraphStore } from "../state";
import type { BaseNodeProps } from "../types";

export const ModelNode = ({ id, ...props }: BaseNodeProps) => {
  const schema = useGraphStore().get.atom(modelAtoms(id));
  if (!schema) {
    return null;
  }

  return (
    <BaseNode
      id={id}
      {...props}
      name={schema.name}
      kind={NodeKind.MODEL}
      comments={
        schema.comments && Array.isArray(schema.comments) && schema.comments.length > 0
          ? schema.comments
          : schema.data.comments
      }
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-1 bg-slate-200/10 px-2 py-0.5">
          <p className="font-mona-sans font-bold text-slate-100">Table Name:</p>
          <p className="overflow-hidden font-mona-sans-light text-slate-300">{schema.tableName}</p>
        </div>
        <div className="bg-slate-200/10 pb-1">
          <NodeFieldList id={id} node={schema.data} kind={NodeKind.MODEL} />
        </div>
      </div>
    </BaseNode>
  );
};

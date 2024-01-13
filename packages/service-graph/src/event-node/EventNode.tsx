import { NodeKind } from "@acidic/schema";
import React from "react";
import "reactflow/dist/style.css";
import { BaseNode } from "../base-node";
import { NodeFieldList } from "../node-field-list";
import { eventAtoms, useGraphStore } from "../state";
import { BaseNodeProps } from "../types";

export const EventNode = ({ id, ...props }: BaseNodeProps) => {
  const schema = useGraphStore().get.atom(eventAtoms(id));
  if (!schema) {
    return null;
  }

  return (
    <BaseNode
      id={id}
      {...props}
      name={schema.name}
      kind={NodeKind.EVENT}
      comments={
        schema.comments &&
        Array.isArray(schema.comments) &&
        schema.comments.length > 0
          ? schema.comments
          : schema.data.comments
      }>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-1 bg-slate-200/10 px-2 py-0.5">
          <p className="font-mona-sans font-bold text-slate-100">Topic: </p>
          <p className="overflow-hidden font-mona-sans-light text-slate-300">
            {schema.topic}
          </p>
        </div>
        <div className="bg-slate-200/10 pb-1">
          <NodeFieldList id={id} node={schema.data} kind={NodeKind.EVENT} />
        </div>
      </div>
    </BaseNode>
  );
};

import { NodeKind } from "@acidic/schema";
import React from "react";
import "reactflow/dist/style.css";
import { BaseNode } from "../base-node";
import { NodeFieldList } from "../node-field-list";
import { objectAtoms, useGraphStore } from "../state";
import { BaseNodeProps } from "../types";

export type ObjectNodeProps = BaseNodeProps & {
  kind?: NodeKind;
};

export const ObjectNode = ({ id, kind, ...props }: ObjectNodeProps) => {
  const schema = useGraphStore().get.atom(objectAtoms(id));
  if (!schema) {
    return null;
  }

  return (
    <BaseNode
      id={id}
      {...props}
      name={schema.name}
      kind={kind ? kind : (schema.kind.toLowerCase() as NodeKind)}
      comments={schema.comments}>
      <div className="bg-slate-200/10 pb-1">
        <NodeFieldList
          id={id}
          node={schema}
          kind={kind ? kind : (schema.kind.toLowerCase() as NodeKind)}
        />
      </div>
    </BaseNode>
  );
};

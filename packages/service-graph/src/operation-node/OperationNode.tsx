//import { stringify } from "@storm-stack/serialization";
import { ObjectDefinition } from "@acidic/definition";
import React from "react";
import "packages/service-graph/node_modules/reactflow/dist/style.css";
import { BaseNode } from "../base-node";
import { NodeFieldList } from "../node-field-list";
import { operationAtoms, useGraphStore } from "../state";
import { BaseNodeProps } from "../types";

export const OperationNode = ({ id, ...props }: BaseNodeProps) => {
  const schema = useGraphStore().get.atom(operationAtoms(id));
  if (!schema) {
    return null;
  }

  return (
    <BaseNode
      id={id}
      {...props}
      name={schema.name}
      kind={schema.kind}
      comments={schema.comments}>
      <div className="flex flex-col gap-2">
        {schema.url && (
          <div className="flex flex-row gap-1 bg-slate-200/10 px-2 py-0.5">
            <p className="font-mona-sans font-bold text-slate-100">URL: </p>
            <p className="overflow-hidden font-mona-sans-light text-slate-300">
              {schema.url}
            </p>
          </div>
        )}

        <div className="bg-slate-200/10 pb-1">
          <div className="flex flex-col gap-0">
            <h3 className="text-center font-mona-sans font-bold text-slate-100">
              Request
            </h3>
            <NodeFieldList
              id={id}
              node={schema.request as ObjectDefinition}
              kind={schema.kind}
            />
          </div>
        </div>

        {schema.response?.ref && (
          <div className="bg-slate-200/10 pb-1">
            <div className="flex flex-col gap-0">
              <h3 className="text-center font-mona-sans font-bold text-slate-100">
                Response
              </h3>
              <NodeFieldList
                id={id}
                node={schema.response.ref as ObjectDefinition}
                kind={schema.kind}
              />
            </div>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

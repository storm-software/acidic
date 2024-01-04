//import { stringify } from "@storm-stack/serialization";
import { NodeKind } from "@acidic/schema";
import React from "react";
import "reactflow/dist/style.css";
import { BaseNode } from "../base-node";
import { pluginAtoms, useGraphStore } from "../state";
import { Table } from "../table";
import { BaseNodeProps } from "../types";

export const PluginNode = ({ id, ...props }: BaseNodeProps) => {
  const schema = useGraphStore().get.atom(pluginAtoms(id));
  if (!schema) {
    return null;
  }

  return (
    <BaseNode
      id={id}
      {...props}
      name={schema.name}
      kind={NodeKind.PLUGIN}
      comments={schema.comments}>
      <div className="bg-slate-200/10 px-2 pb-1">
        <Table headers={["Option Name", "Option Value"]}>
          {Object.entries(schema.options).map(([key, value]: [string, any]) => {
            return (
              <tr>
                <td className="flex flex-row gap-0.5">
                  <p className="text-slate-300">{key}</p>
                </td>
                <td>
                  <p className="text-slate-300">{JSON.stringify(value)}</p>
                </td>
              </tr>
            );
          })}
        </Table>
      </div>
    </BaseNode>
  );
};

//import { stringify } from "@storm-stack/serialization";
import React from "react";
import "reactflow/dist/style.css";
import { BaseNode } from "../base-node";
import { pluginAtoms, useGraphStore } from "../state";
import { BaseNodeProps, NodeType } from "../types";

export const PluginNode = ({ id, ...props }: BaseNodeProps) => {
  const schema = useGraphStore().get.atom(pluginAtoms(id));
  if (!schema) {
    return null;
  }

  return (
    <BaseNode
      name={schema.name}
      type={NodeType.PLUGIN}
      comments={schema.comments}>
      <div className="bg-slate-200/10 px-2 pb-1">
        <table className="w-full table-auto border-collapse border-spacing-2">
          <thead className="border-b-[1px] border-b-slate-400 text-left text-slate-100">
            <tr>
              <th>Option Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(schema.options).map(
              ([key, value]: [string, any]) => {
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
              }
            )}
          </tbody>
        </table>
      </div>
    </BaseNode>
  );
};

import clsx from "clsx";
import React from "react";
import "reactflow/dist/style.css";
import { BaseNode } from "../base-node";
import { enumAtoms, useGraphStore } from "../state";
import { BaseNodeProps, NodeType } from "../types";

export const EnumNode = ({ id, data, ...props }: BaseNodeProps) => {
  const schema = useGraphStore().get.atom(enumAtoms(id));
  if (!schema) {
    return null;
  }

  return (
    <BaseNode
      name={schema.name}
      type={NodeType.ENUM}
      comments={schema.comments}>
      <div className="bg-slate-200/10 px-2 pb-1">
        <table className="w-full table-auto border-collapse border-spacing-2">
          <thead className="border-b-[1px] border-b-slate-400 text-left text-slate-100">
            <tr>
              <th>Enum Field</th>
              <th>Enum Value</th>
            </tr>
          </thead>
          <tbody>
            {schema?.fields.map(field => {
              return (
                <tr className="cursor-pointer text-slate-300 hover:bg-slate-200/30 hover:text-violet-800">
                  <td className="flex flex-row gap-0.5">
                    <p
                      className={clsx({
                        "font-bold": field.isRequired
                      })}>
                      {field.name}
                    </p>
                  </td>
                  <td>
                    <p>{field.value}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </BaseNode>
  );
};

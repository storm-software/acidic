import clsx from "clsx";
import React from "react";
import "reactflow/dist/style.css";
import { BaseNode } from "../base-node";
import { modelAtoms, useGraphStore } from "../state";
import { BaseNodeProps, NodeType } from "../types";

export const ModelNode = ({ id, ...props }: BaseNodeProps) => {
  const schema = useGraphStore().get.atom(modelAtoms(id));
  if (!schema) {
    return null;
  }

  return (
    <BaseNode
      name={schema.tableName ? schema.tableName : schema.name}
      type={NodeType.MODEL}
      comments={
        schema.comments &&
        Array.isArray(schema.comments) &&
        schema.comments.length > 0
          ? schema.comments
          : schema.ref.comments
      }>
      <div className="bg-slate-200/10 px-2 pb-1">
        <table className="w-full table-auto border-collapse border-spacing-2">
          <thead className="border-b-[1px] border-b-slate-400 text-left text-slate-100">
            <tr>
              <th>Field Name</th>
              <th>Field Type</th>
            </tr>
          </thead>
          <tbody>
            {schema.ref.fields.map(field => {
              return (
                <tr className="cursor-pointer text-slate-300 hover:bg-slate-200/30 hover:font-semibold hover:text-teal-400">
                  <td className="flex flex-row gap-0.5">
                    <p
                      className={clsx({
                        "font-bold": field.isRequired
                      })}>
                      {field.name}
                    </p>
                    {field.isRequired && (
                      <p className="font-extrabold text-red-500">*</p>
                    )}
                  </td>
                  <td>
                    <p>
                      {field.type}
                      {field.isArray ? "[ ]" : ""}
                    </p>
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

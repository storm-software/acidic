import {
  NodeSchema,
  ObjectFieldSchema,
  ObjectRelationshipSchema,
  isObjectSchema
} from "@acidic/schema";
import clsx from "clsx";
import React from "react";
import { Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import { NodeType } from "../types";

export interface NodeFieldTableRowProps {
  node?: NodeSchema;
  field: ObjectFieldSchema;
}

export const NodeFieldTableRow = ({ field, node }: NodeFieldTableRowProps) => {
  let relationship: ObjectRelationshipSchema | undefined;
  if (isObjectSchema(node) && node.relationships.length > 0) {
    relationship = node.relationships.find(rel =>
      rel.fields.findIndex(foreignKey => foreignKey.name === field.name)
    );
  }

  return (
    <tr
      className={clsx(
        "relative cursor-pointer text-slate-300 hover:bg-slate-200/30 hover:font-semibold",
        { "hover:text-[#a855f7]": node?.kind === NodeType.ENUM },
        {
          "hover:text-[#0d9488]": node?.kind === NodeType.MODEL
        },
        {
          "hover:text-[#ec4899]": node?.kind === NodeType.PLUGIN
        },
        {
          "hover:text-[#0891b2]": node?.kind === NodeType.REQUEST
        },
        {
          "hover:text-[#b91c1c]": node?.kind === NodeType.OBJECT
        },
        { "hover:text-[#c2410c]": node?.kind === NodeType.EVENT }
      )}>
      <td className="flex flex-row gap-0.5 font-mona-sans">
        <p
          className={clsx({
            "font-bold": field.isRequired
          })}>
          {field.name}
        </p>
        {field.isRequired && <p className="font-extrabold text-red-500">*</p>}
      </td>
      <td>
        <p>
          {field.type}
          {field.isArray ? "[ ]" : ""}
        </p>
      </td>
      {relationship && (
        <Handle
          id={`${node?.name}.${field.name}-${relationship.ref.name}.${
            relationship.references[
              relationship.fields.findIndex(
                foreignKey => foreignKey.name === field.name
              )
            ]
          }`}
          type="source"
          className="h-5 w-5 rounded-full border-2 border-white"
          position={Position.Right}
          isConnectable={false}
        />
      )}
    </tr>
  );
};

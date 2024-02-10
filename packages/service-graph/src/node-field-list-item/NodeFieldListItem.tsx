import {
  NodeDefinition,
  NodeKind,
  ObjectFieldDefinition,
  RelationshipDefinition,
  isObjectDefinition
} from "@acidic/definition";
import clsx from "clsx";
import React, { useCallback } from "react";
import { Handle, Position } from "reactflow";
import "packages/service-graph/node_modules/reactflow/dist/style.css";
import { useGraphStore } from "../state";

export interface NodeFieldListItemProps {
  id: string;
  kind: NodeKind;
  node?: NodeDefinition;
  field: ObjectFieldDefinition;
}

export const NodeFieldListItem = ({
  id,
  field,
  node,
  kind
}: NodeFieldListItemProps) => {
  let relationship: RelationshipDefinition | undefined;
  if (isObjectDefinition(node) && node.relationships.length > 0) {
    relationship = node.relationships.find(rel =>
      rel.fields.findIndex(foreignKey => foreignKey.name === field.name)
    );
  }

  const setActiveId = useGraphStore().set.activeId();
  const handleClick = useCallback(() => {
    setActiveId({ nodeId: id, fieldId: field.name });
  }, [setActiveId, id, field.name]);

  return (
    <tr
      onClick={handleClick}
      className="text-md group/node-field-row relative cursor-pointer font-mona-sans-light text-slate-300 transition-all hover:bg-slate-200/30 hover:font-semibold">
      <td className="flex flex-row gap-0.5">
        <p
          className={clsx(
            "overflow-hidden px-2 text-slate-300 transition-all group-hover/node-field-row:font-mona-sans",
            {
              "font-mona-sans font-bold": field.isRequired
            },
            {
              "font-mona-sans-light font-light": !field.isRequired
            },
            {
              "group-hover/node-field-row:text-[#4c1d95]":
                kind === NodeKind.ENUM
            },
            {
              "group-hover/node-field-row:text-[#2dd4bf]":
                kind === NodeKind.MODEL
            },
            {
              "group-hover/node-field-row:text-[#ec4899]":
                kind === NodeKind.PLUGIN
            },
            {
              "group-hover/node-field-row:text-[#0369a1]":
                kind === NodeKind.QUERY ||
                kind === NodeKind.MUTATION ||
                kind === NodeKind.SUBSCRIPTION
            },
            {
              "group-hover/node-field-row:text-[#f87171]":
                kind === NodeKind.OBJECT
            },
            {
              "group-hover/node-field-row:text-[#fb923c]":
                kind === NodeKind.EVENT
            }
          )}>
          {field.name}
        </p>
        {field.isRequired && <p className="font-extrabold text-red-500">*</p>}
      </td>
      <td>
        <p
          className={clsx(
            "px-2 text-slate-300 transition-all group-hover/node-field-row:font-mona-sans",
            {
              "group-hover/node-field-row:text-[#4c1d95]":
                kind === NodeKind.ENUM
            },
            {
              "group-hover/node-field-row:text-[#2dd4bf]":
                kind === NodeKind.MODEL
            },
            {
              "group-hover/node-field-row:text-[#ec4899]":
                kind === NodeKind.PLUGIN
            },
            {
              "group-hover/node-field-row:text-[#0369a1]":
                kind === NodeKind.QUERY ||
                kind === NodeKind.MUTATION ||
                kind === NodeKind.SUBSCRIPTION
            },
            {
              "group-hover/node-field-row:text-[#f87171]":
                kind === NodeKind.OBJECT
            },
            {
              "group-hover/node-field-row:text-[#fb923c]":
                kind === NodeKind.EVENT
            }
          )}>
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

import {
  NodeDefinition,
  NodeKind,
  ObjectDefinition,
  ObjectFieldDefinition
} from "@acidic/schema";
import React from "react";
import "reactflow/dist/style.css";
import { List, ListProps } from "../list";
import { NodeFieldListItem } from "../node-field-list-item";

export type NodeFieldListProps = Partial<ListProps> & {
  id: string;
  headers?: string[];
  kind: NodeKind;
  node: NodeDefinition;
};

export const NodeFieldList = ({
  id,
  headers,
  node,
  kind
}: NodeFieldListProps) => {
  return (
    <List headers={headers ? headers : ["Field Name", "Field Type"]}>
      {(node as ObjectDefinition)?.fields &&
        (node as ObjectDefinition)?.fields?.map(field => (
          <NodeFieldListItem
            id={id}
            key={field.name}
            field={field as ObjectFieldDefinition}
            node={node}
            kind={kind}
          />
        ))}
    </List>
  );
};

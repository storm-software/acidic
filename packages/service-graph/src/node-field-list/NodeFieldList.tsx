import { NodeKind, NodeSchema, ObjectSchema } from "@acidic/schema";
import React from "react";
import "reactflow/dist/style.css";
import { List, ListProps } from "../list";
import { NodeFieldListItem } from "../node-field-list-item";

export type NodeFieldListProps = Partial<ListProps> & {
  id: string;
  headers?: string[];
  kind: NodeKind;
  node: NodeSchema;
};

export const NodeFieldList = ({
  id,
  headers,
  node,
  kind
}: NodeFieldListProps) => {
  return (
    <List headers={headers ? headers : ["Field Name", "Field Type"]}>
      {(node as ObjectSchema)?.fields &&
        (node as ObjectSchema)?.fields?.map(field => (
          <NodeFieldListItem
            id={id}
            key={field.name}
            field={field}
            node={node}
            kind={kind}
          />
        ))}
    </List>
  );
};

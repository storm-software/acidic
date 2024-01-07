import { NodeKind, NodeSchema, ObjectSchema } from "@acidic/schema";
import React from "react";
import "reactflow/dist/style.css";
import { Table, TableProps } from "../table";

export type NodeFieldTableProps = Partial<TableProps> & {
  headers?: string[];
  kind: NodeKind;
  node: NodeSchema;
};

export const NodeFieldTable = ({
  headers,
  node,
  kind
}: NodeFieldTableProps) => {
  return (
    <Table headers={headers ? headers : ["Field Name", "Field Type"]}>
      {(node as ObjectSchema)?.fields &&
        (node as ObjectSchema)?.fields?.map(field => (
          <>
            {/*<NodeFieldTableItem
            key={field.name}
            field={field}
            node={node}
            kind={kind}
        />*/}
          </>
        ))}
    </Table>
  );
};

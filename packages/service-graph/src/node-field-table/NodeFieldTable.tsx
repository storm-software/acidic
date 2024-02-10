import { NodeDefinition, NodeKind, ObjectDefinition } from "@acidic/definition";
import React from "react";
import "packages/service-graph/node_modules/reactflow/dist/style.css";
import { Table, TableProps } from "../table";

export type NodeFieldTableProps = Partial<TableProps> & {
  headers?: string[];
  kind: NodeKind;
  node: NodeDefinition;
};

export const NodeFieldTable = ({
  headers,
  node,
  kind
}: NodeFieldTableProps) => {
  return (
    <Table headers={headers ? headers : ["Field Name", "Field Type"]}>
      {(node as ObjectDefinition)?.fields &&
        (node as ObjectDefinition)?.fields?.map(field => (
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

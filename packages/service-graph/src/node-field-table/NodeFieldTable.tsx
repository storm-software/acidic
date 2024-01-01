import { NodeSchema, ObjectFieldSchema } from "@acidic/schema";
import React from "react";
import "reactflow/dist/style.css";
import { NodeFieldTableRow } from "../node-field-table-row";
import { Table, TableProps } from "../table";

export type NodeFieldTableProps = Partial<TableProps> & {
  node: NodeSchema;
  fields: ObjectFieldSchema[];
};

export const NodeFieldTable = ({ fields, node }: NodeFieldTableProps) => {
  return (
    <Table headers={["Field Name", "Field Type"]}>
      {fields.map(field => (
        <NodeFieldTableRow field={field} node={node} />
      ))}
    </Table>
  );
};

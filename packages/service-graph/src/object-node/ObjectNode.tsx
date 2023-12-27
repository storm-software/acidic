import "reactflow/dist/style.css";
import { BaseNode, BaseNodeProps } from "../base-node";

export type ObjectNodeProps = Omit<BaseNodeProps, "children"> & {};

export const ObjectNode = (props: ObjectNodeProps) => {
  return (
    <BaseNode {...props}>
      <div className="border-slate-600/500 border-2 w-full h-full"></div>
    </BaseNode>
  );
};

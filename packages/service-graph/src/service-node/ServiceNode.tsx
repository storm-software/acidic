import "reactflow/dist/style.css";

export interface ServiceNodeProps {
  className?: string;
}

export const ServiceNode = ({ className }: ServiceNodeProps) => {
  return <div className="border-slate-600/500 border-2 w-full h-full"></div>;
};

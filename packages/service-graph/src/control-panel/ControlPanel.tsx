import React from "react";
import { Controls } from "reactflow";
import { DownloadControl } from "../download-control";

export interface ControlPanelProps {
  className?: string;
}

export const ControlPanel = ({ className }: ControlPanelProps) => {
  return (
    <Controls position="bottom-left">
      <DownloadControl />
    </Controls>
  );
};

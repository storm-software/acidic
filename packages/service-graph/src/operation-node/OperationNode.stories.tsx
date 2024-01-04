import type { Meta, StoryObj } from "@storybook/react";

import { getNodeId } from "../utilities/get-node-id";
import { OperationNode } from "./OperationNode";

const meta: Meta<typeof OperationNode> = {
  title: "Nodes/OperationNode",
  component: OperationNode,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof OperationNode>;

export const Primary: Story = {
  args: {
    id: getNodeId("ExampleQuery", "ExampleService")
  }
};

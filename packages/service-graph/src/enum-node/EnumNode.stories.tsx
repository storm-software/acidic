import type { Meta, StoryObj } from "@storybook/react";

import { getNodeId } from "../utilities/get-node-id";
import { EnumNode } from "./EnumNode";

const meta: Meta<typeof EnumNode> = {
  component: EnumNode,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof EnumNode>;

export const Primary: Story = {
  args: {
    id: getNodeId("ExampleEnum", "ExampleService")
  }
};

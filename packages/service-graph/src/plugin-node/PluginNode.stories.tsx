import type { Meta, StoryObj } from "@storybook/react";

import { getNodeId } from "../utilities/get-node-id";
import { PluginNode } from "./PluginNode";

const meta: Meta<typeof PluginNode> = {
  component: PluginNode,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof PluginNode>;

export const Primary: Story = {
  args: {
    id: getNodeId("examplePlugin", "ExampleService")
  }
};

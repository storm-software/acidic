import type { Meta, StoryObj } from "@storybook/react";

import { getNodeId } from "../utilities/get-node-id";
import { ModelNode } from "./ModelNode";

const meta: Meta<typeof ModelNode> = {
  component: ModelNode,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof ModelNode>;

export const Primary: Story = {
  args: {
    id: getNodeId("ExampleModel", "ExampleService")
  }
};

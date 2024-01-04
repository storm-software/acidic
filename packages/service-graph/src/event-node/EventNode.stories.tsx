import type { Meta, StoryObj } from "@storybook/react";

import { getNodeId } from "../utilities/get-node-id";
import { EventNode } from "./EventNode";

const meta: Meta<typeof EventNode> = {
  title: "Nodes/EventNode",
  component: EventNode,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof EventNode>;

export const Primary: Story = {
  args: {
    id: getNodeId("ExampleEvent", "ExampleService")
  }
};

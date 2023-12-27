import type { Meta, StoryObj } from "@storybook/react";

import { ObjectNode } from "./ObjectNode";

const meta: Meta<typeof ObjectNode> = {
  component: ObjectNode,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof ObjectNode>;

export const Primary: Story = {
  args: {}
};

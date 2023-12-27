import type { Meta, StoryObj } from "@storybook/react";

import { ServiceNode } from "./ServiceNode";

const meta: Meta<typeof ServiceNode> = {
  component: ServiceNode,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof ServiceNode>;

export const Primary: Story = {
  args: {}
};

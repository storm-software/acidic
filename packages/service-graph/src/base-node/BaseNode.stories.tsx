import type { Meta, StoryObj } from "@storybook/react";

import { BaseNode } from "./BaseNode";

const meta: Meta<typeof BaseNode> = {
  component: BaseNode,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof BaseNode>;

export const Primary: Story = {
  args: {
    name: "BaseNode Title",
    comments: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    ]
  }
};

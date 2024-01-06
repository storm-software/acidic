import type { Meta, StoryObj } from "@storybook/react";

import { Drawer } from "./Drawer";

const meta: Meta<typeof Drawer> = {
  title: "General/Drawer",
  component: Drawer,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Primary: Story = {
  args: {
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
};

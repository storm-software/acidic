import type { Meta, StoryObj } from "@storybook/react";

import { ActiveNodeDrawer } from "./ActiveNodeDrawer";

const meta: Meta<typeof ActiveNodeDrawer> = {
  title: "Support/ActiveNodeDrawer",
  component: ActiveNodeDrawer,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof ActiveNodeDrawer>;

export const Primary: Story = {
  args: {
    opened: true
  }
};

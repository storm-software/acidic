import type { Meta, StoryObj } from "@storybook/react";

import { Collapsible } from "./Collapsible";

const meta: Meta<typeof Collapsible> = {
  title: "General/Collapsible",
  component: Collapsible,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Primary: Story = {
  args: {
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
};

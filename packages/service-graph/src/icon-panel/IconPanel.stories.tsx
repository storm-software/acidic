import type { Meta, StoryObj } from "@storybook/react";
import { IconPanel } from "./IconPanel";

const meta: Meta<typeof IconPanel> = {
  title: "Support/IconPanel",
  component: IconPanel,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof IconPanel>;

export const Primary: Story = {
  args: {}
};

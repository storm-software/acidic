import type { Meta, StoryObj } from "@storybook/react";
import { ControlPanel } from "./ControlPanel";

const meta: Meta<typeof ControlPanel> = {
  title: "Support/ControlPanel",
  component: ControlPanel,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof ControlPanel>;

export const Primary: Story = {
  args: {}
};

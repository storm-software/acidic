import type { Meta, StoryObj } from "@storybook/react";
import { MiniMap } from "./MiniMap";

const meta: Meta<typeof MiniMap> = {
  title: "Support/MiniMap",
  component: MiniMap,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof MiniMap>;

export const Primary: Story = {
  args: {
    reactFlowInstance: null
  }
};

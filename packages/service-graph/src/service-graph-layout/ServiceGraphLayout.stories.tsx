import type { Meta, StoryObj } from "@storybook/react";

import { ServiceGraphLayout } from "./ServiceGraphLayout";

const meta: Meta<typeof ServiceGraphLayout> = {
  component: ServiceGraphLayout,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof ServiceGraphLayout>;

export const Primary: Story = {
  args: {}
};

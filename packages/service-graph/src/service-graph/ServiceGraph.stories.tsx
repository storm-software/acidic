import type { Meta, StoryObj } from "@storybook/react";

import { ServiceGraph } from "./ServiceGraph";

const meta: Meta<typeof ServiceGraph> = {
  component: ServiceGraph,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof ServiceGraph>;

export const Primary: Story = {
  args: {}
};

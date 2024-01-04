import type { Meta, StoryObj } from "@storybook/react";

import { ServiceGraphContainer } from "./ServiceGraphContainer";

const meta: Meta<typeof ServiceGraphContainer> = {
  component: ServiceGraphContainer,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof ServiceGraphContainer>;

export const Primary: Story = {
  args: {}
};

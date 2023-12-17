import type { Meta, StoryObj } from "@storybook/react";

import { SchemaTreeView } from "./SchemaTreeView";

const meta: Meta<typeof SchemaTreeView> = {
  component: SchemaTreeView,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof SchemaTreeView>;

export const Primary: Story = {
  args: {
    repository: "Sample Repository"
  }
};

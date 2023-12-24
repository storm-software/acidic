import type { Meta, StoryObj } from "@storybook/react";

import { SchemaTreeItem } from "./SchemaTreeItem";

const meta: Meta<typeof SchemaTreeItem> = {
  component: SchemaTreeItem,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof SchemaTreeItem>;

export const Primary: Story = {
  args: {
    service: "Sample Service"
  }
};

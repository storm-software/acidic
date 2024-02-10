import type { Meta, StoryObj } from "@storybook/react";

import { NodeKind } from "@acidic/definition";
import { BaseNode } from "./BaseNode";

const meta: Meta<typeof BaseNode> = {
  title: "Support/BaseNode",
  component: BaseNode,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof BaseNode>;

export const Object: Story = {
  args: {
    name: "BaseNode Title",
    comments: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    ],
    kind: NodeKind.OBJECT
  }
};

export const Enum: Story = {
  args: {
    name: "BaseNode Title",
    comments: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    ],
    kind: NodeKind.ENUM
  }
};

export const Operation: Story = {
  args: {
    name: "BaseNode Title",
    comments: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    ],
    kind: NodeKind.OPERATION
  }
};

export const event: Story = {
  args: {
    name: "BaseNode Title",
    comments: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    ],
    kind: NodeKind.EVENT
  }
};

export const Model: Story = {
  args: {
    name: "BaseNode Title",
    comments: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    ],
    kind: NodeKind.MODEL
  }
};

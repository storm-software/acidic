import type { Meta, StoryObj } from "@storybook/react";

import { NodeType } from "../types";
import { BaseNode } from "./BaseNode";

const meta: Meta<typeof BaseNode> = {
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
    type: NodeType.OBJECT
  }
};

export const Enum: Story = {
  args: {
    name: "BaseNode Title",
    comments: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    ],
    type: NodeType.ENUM
  }
};

export const Request: Story = {
  args: {
    name: "BaseNode Title",
    comments: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    ],
    type: NodeType.REQUEST
  }
};

export const event: Story = {
  args: {
    name: "BaseNode Title",
    comments: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    ],
    type: NodeType.EVENT
  }
};

export const Model: Story = {
  args: {
    name: "BaseNode Title",
    comments: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    ],
    type: NodeType.MODEL
  }
};

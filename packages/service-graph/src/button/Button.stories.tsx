import type { Meta, StoryObj } from "@storybook/react";

import { NodeType } from "../types";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "General/Button",
  component: Button,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Button Text"
  }
};

export const Enum: Story = {
  args: {
    children: "Button Text",
    nodeType: NodeType.ENUM
  }
};

export const Object: Story = {
  args: {
    children: "Button Text",
    nodeType: NodeType.OBJECT
  }
};

export const Model: Story = {
  args: {
    children: "Button Text",
    nodeType: NodeType.MODEL
  }
};

export const Event: Story = {
  args: {
    children: "Button Text",
    nodeType: NodeType.EVENT
  }
};

export const Plugin: Story = {
  args: {
    children: "Button Text",
    nodeType: NodeType.PLUGIN
  }
};

export const Request: Story = {
  args: {
    children: "Button Text",
    nodeType: NodeType.REQUEST
  }
};

export const Small: Story = {
  args: {
    children: "Button Text",
    size: "small"
  }
};

export const Medium: Story = {
  args: {
    children: "Button Text",
    size: "medium"
  }
};

export const Large: Story = {
  args: {
    children: "Button Text",
    size: "large"
  }
};

export const RoundedLarge: Story = {
  args: {
    children: "Button Text",
    rounded: "large"
  }
};

export const RoundedMedium: Story = {
  args: {
    children: "Button Text",
    rounded: "medium"
  }
};

export const RoundedSmall: Story = {
  args: {
    children: "Button Text",
    rounded: "small"
  }
};

export const Rectangle: Story = {
  args: {
    children: "Button Text",
    rounded: "none"
  }
};

export const Outlined: Story = {
  args: {
    children: "Button Text",
    fill: "outlined"
  }
};

export const Filled: Story = {
  args: {
    children: "Button Text",
    fill: "filled"
  }
};

export const FilledEnum: Story = {
  args: {
    children: "Button Text",
    fill: "filled",
    nodeType: NodeType.ENUM
  }
};

export const FilledObject: Story = {
  args: {
    children: "Button Text",
    fill: "filled",
    nodeType: NodeType.OBJECT
  }
};

export const FilledModel: Story = {
  args: {
    children: "Button Text",
    fill: "filled",
    nodeType: NodeType.MODEL
  }
};

export const FilledEvent: Story = {
  args: {
    children: "Button Text",
    fill: "filled",
    nodeType: NodeType.EVENT
  }
};

export const FilledPlugin: Story = {
  args: {
    children: "Button Text",
    fill: "filled",
    nodeType: NodeType.PLUGIN
  }
};

export const FilledRequest: Story = {
  args: {
    children: "Button Text",
    fill: "filled",
    nodeType: NodeType.REQUEST
  }
};

export const Disabled: Story = {
  args: {
    children: "Button Text",
    disabled: true
  }
};

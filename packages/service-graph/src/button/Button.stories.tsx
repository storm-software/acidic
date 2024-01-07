import type { Meta, StoryObj } from "@storybook/react";

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

export const Secondary: Story = {
  args: {
    children: "Button Text",
    kind: "secondary"
  }
};

export const Enum: Story = {
  args: {
    children: "Button Text",
    kind: "enum"
  }
};

export const Object: Story = {
  args: {
    children: "Button Text",
    kind: "object"
  }
};

export const Model: Story = {
  args: {
    children: "Button Text",
    kind: "model"
  }
};

export const Event: Story = {
  args: {
    children: "Button Text",
    kind: "event"
  }
};

export const Plugin: Story = {
  args: {
    children: "Button Text",
    kind: "plugin"
  }
};

export const Request: Story = {
  args: {
    children: "Button Text",
    kind: "request"
  }
};

export const Small: Story = {
  args: {
    children: "Button Text",
    size: "sm"
  }
};

export const Medium: Story = {
  args: {
    children: "Button Text",
    size: "md"
  }
};

export const Large: Story = {
  args: {
    children: "Button Text",
    size: "lg"
  }
};

export const RoundedLarge: Story = {
  args: {
    children: "Button Text",
    rounded: "lg"
  }
};

export const RoundedMedium: Story = {
  args: {
    children: "Button Text",
    rounded: "md"
  }
};

export const RoundedSmall: Story = {
  args: {
    children: "Button Text",
    rounded: "sm"
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
    kind: "enum"
  }
};

export const FilledObject: Story = {
  args: {
    children: "Button Text",
    fill: "filled",
    kind: "object"
  }
};

export const FilledModel: Story = {
  args: {
    children: "Button Text",
    fill: "filled",
    kind: "model"
  }
};

export const FilledEvent: Story = {
  args: {
    children: "Button Text",
    fill: "filled",
    kind: "event"
  }
};

export const FilledPlugin: Story = {
  args: {
    children: "Button Text",
    fill: "filled",
    kind: "plugin"
  }
};

export const FilledRequest: Story = {
  args: {
    children: "Button Text",
    fill: "filled",
    kind: "request"
  }
};

export const Disabled: Story = {
  args: {
    children: "Button Text",
    disabled: true
  }
};

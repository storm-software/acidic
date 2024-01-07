import type { Meta, StoryObj } from "@storybook/react";

import { Link } from "./Link";

const meta: Meta<typeof Link> = {
  title: "General/Link",
  component: Link,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Primary: Story = {
  args: {
    children: "Link Text",
    kind: "primary"
  }
};

export const Secondary: Story = {
  args: {
    children: "Link Text",
    kind: "secondary"
  }
};

export const Tertiary: Story = {
  args: {
    children: "Link Text",
    kind: "tertiary"
  }
};

export const Quarternary: Story = {
  args: {
    children: "Link Text",
    kind: "quarternary"
  }
};

export const CallToAction: Story = {
  args: {
    children: "Link Text",
    kind: "cta"
  }
};

export const Enabled: Story = {
  args: {
    children: "Link Text",
    kind: "primary",
    disabled: false
  }
};

export const Disabled: Story = {
  args: {
    children: "Link Text",
    kind: "primary",
    disabled: true
  }
};

export const Active: Story = {
  args: {
    children: "Link Text",
    kind: "primary",
    active: true
  }
};

import type { Meta, StoryObj } from "@storybook/react";

import React from "react";
import { Drawer } from "./Drawer";

const meta: Meta<typeof Drawer> = {
  title: "General/Drawer",
  component: Drawer,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Primary: Story = {
  args: {
    opened: true,
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
};

export const Opened: Story = {
  args: {
    opened: true,
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
};

export const Closed: Story = {
  args: {
    opened: false,
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
};

export const Closable: Story = {
  args: {
    opened: true,
    closable: true,
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
};

export const Unclosable: Story = {
  args: {
    opened: true,
    closable: false,
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
};

export const ExtraSmall: Story = {
  args: {
    size: "xs",
    opened: true,
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
};

export const Small: Story = {
  args: {
    size: "sm",
    opened: true,
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
};

export const Medium: Story = {
  args: {
    size: "md",
    opened: true,
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
};

export const Large: Story = {
  args: {
    size: "lg",
    opened: true,
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
};

export const ExtraLarge: Story = {
  args: {
    size: "xl",
    opened: true,
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
};

export const Header: Story = {
  args: {
    header: "Custom Header",
    opened: true,
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
};

export const Footer: Story = {
  args: {
    header: "Custom Header",
    opened: true,
    footer: (
      <div className="flex h-full w-full items-center justify-between bg-slate-200/10 px-4 text-lg text-gray-200">
        Custom Footer
      </div>
    ),
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
};

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { List } from "./List";

const meta: Meta<typeof List> = {
  title: "General/List",
  component: List,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof List>;

export const Primary: Story = {
  args: {
    headers: ["Column 1", "Column 2", "Column 3"],
    children: (
      <>
        <tr className="relative cursor-pointer text-slate-300 hover:bg-slate-200/30 hover:font-semibold">
          <td className="px-2">Value 1</td>
          <td className="px-2">Value 2</td>
          <td className="px-2">Value 3</td>
        </tr>
        <tr className="relative cursor-pointer text-slate-300 hover:bg-slate-200/30 hover:font-semibold">
          <td className="px-2">Value 1</td>
          <td className="px-2">Value 2</td>
          <td className="px-2">Value 3</td>
        </tr>
        <tr className="relative cursor-pointer text-slate-300 hover:bg-slate-200/30 hover:font-semibold">
          <td className="px-2">Value 1</td>
          <td className="px-2">Value 2</td>
          <td className="px-2">Value 3</td>
        </tr>
      </>
    )
  }
};

export const Footer: Story = {
  args: {
    headers: ["Column 1", "Column 2", "Column 3"],
    footer: "This is a custom footer label",
    children: (
      <>
        <tr className="relative cursor-pointer text-slate-300 hover:bg-slate-200/30 hover:font-semibold">
          <td className="px-2">Value 1</td>
          <td className="px-2">Value 2</td>
          <td className="px-2">Value 3</td>
        </tr>
        <tr className="relative cursor-pointer text-slate-300 hover:bg-slate-200/30 hover:font-semibold">
          <td className="px-2">Value 1</td>
          <td className="px-2">Value 2</td>
          <td className="px-2">Value 3</td>
        </tr>
        <tr className="relative cursor-pointer text-slate-300 hover:bg-slate-200/30 hover:font-semibold">
          <td className="px-2">Value 1</td>
          <td className="px-2">Value 2</td>
          <td className="px-2">Value 3</td>
        </tr>
      </>
    )
  }
};

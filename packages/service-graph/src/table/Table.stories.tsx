import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Table } from "./Table";

const meta: Meta<typeof Table> = {
  title: "General/Table",
  component: Table,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Primary: Story = {
  args: {
    headers: ["Column 1", "Column 2", "Column 3"],
    children: (
      <>
        <tr className="relative cursor-pointer text-slate-300 hover:bg-slate-200/30 hover:font-semibold">
          <td>Value 1</td>
          <td>Value 2</td>
          <td>Value 3</td>
        </tr>
        <tr className="relative cursor-pointer text-slate-300 hover:bg-slate-200/30 hover:font-semibold">
          <td>Value 1</td>
          <td>Value 2</td>
          <td>Value 3</td>
        </tr>
        <tr className="relative cursor-pointer text-slate-300 hover:bg-slate-200/30 hover:font-semibold">
          <td>Value 1</td>
          <td>Value 2</td>
          <td>Value 3</td>
        </tr>
      </>
    )
  }
};

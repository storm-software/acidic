import type { Meta, StoryObj } from "@storybook/react";
import { SettingsControl } from "./SettingsControl";

const meta: Meta<typeof SettingsControl> = {
  title: "Support/SettingsControl",
  component: SettingsControl,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof SettingsControl>;

export const Primary: Story = {
  args: {}
};

import type { Meta, StoryObj } from "@storybook/react";
import { DownloadControl } from "./DownloadControl";

const meta: Meta<typeof DownloadControl> = {
  title: "Support/DownloadControl",
  component: DownloadControl,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof DownloadControl>;

export const Primary: Story = {
  args: {}
};

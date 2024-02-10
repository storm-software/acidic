import type { Meta, StoryObj } from "@storybook/react";

import { NodeKind } from "@acidic/definition";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "General/Modal",
  component: Modal,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Primary: Story = {
  args: {
    title: "Modal title",
    type: NodeKind.MODEL
  }
};

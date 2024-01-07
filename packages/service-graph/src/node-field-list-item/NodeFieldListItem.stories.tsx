import { NodeKind, ObjectSchema } from "@acidic/schema";
import type { Meta, StoryObj } from "@storybook/react";
import { NodeFieldListItem } from "./NodeFieldListItem";

const meta: Meta<typeof NodeFieldListItem> = {
  title: "Support/NodeFieldListItem",
  component: NodeFieldListItem,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof NodeFieldListItem>;

export const Primary: Story = {
  args: {
    kind: NodeKind.MODEL,
    node: {
      kind: "object",
      name: "ExampleObject",
      comments: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      ],
      fields: [
        {
          name: "exampleString",
          type: "String",
          isRequired: false,
          isArray: false,
          attributes: [],
          defaultValue: "Example Default"
        },
        {
          name: "exampleDecimal",
          type: "Decimal",
          isArray: false,
          attributes: [],
          defaultValue: 5.005
        },
        {
          name: "exampleStringArray",
          type: "String",
          isRequired: false,
          isArray: true,
          attributes: []
        },
        {
          name: "exampleBooleanRequired",
          type: "Boolean",
          isRequired: true,
          isArray: false,
          attributes: []
        }
      ],
      relationships: [],
      extends: [],
      isExtend: false,
      attributes: []
    } as ObjectSchema,
    field: {
      name: "exampleStringArray",
      type: "String",
      isRequired: false,
      isArray: true,
      attributes: []
    }
  }
};

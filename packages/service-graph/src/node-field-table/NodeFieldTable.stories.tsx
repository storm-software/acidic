import type { Meta, StoryObj } from "@storybook/react";

import { ObjectSchema } from "@acidic/engine";
import { NodeFieldTable } from "./NodeFieldTable";

const meta: Meta<typeof NodeFieldTable> = {
  component: NodeFieldTable,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof NodeFieldTable>;

export const Primary: Story = {
  args: {
    node: {
      kind: "Object",
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
    ]
  }
};

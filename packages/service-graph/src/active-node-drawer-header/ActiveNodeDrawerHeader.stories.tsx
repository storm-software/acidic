import type { Meta, StoryObj } from "@storybook/react";

import { ModelSchema } from "@acidic/definition";
import { ActiveNodeDrawerHeader } from "./ActiveNodeDrawerHeader";

const meta: Meta<typeof ActiveNodeDrawerHeader> = {
  title: "Support/ActiveNodeDrawerHeader",
  component: ActiveNodeDrawerHeader,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof ActiveNodeDrawerHeader>;

export const Primary: Story = {
  args: {
    field: {
      name: "exampleString",
      type: "String",
      isRequired: false,
      isArray: false,
      attributes: [],
      defaultValue: "Example Default"
    },
    node: {
      kind: "model",
      name: "ExampleModel",
      tableName: "example_object",
      ref: {
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
      }
    } as ModelSchema
  }
};

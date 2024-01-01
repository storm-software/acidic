import { Preview } from "@storybook/react";
import React from "react";
import theme from "../../../.storybook/themes/storm.theme";
import "../../../.storybook/themes/tailwind.css";
import { GraphStoreProvider } from "../src/state/GraphStoreProvider";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};

const preview: Preview = {
  decorators: [
    Story =>
      (
        <GraphStoreProvider
          initialValues={{
            schemas: [
              {
                name: "ExampleService",
                kind: "Service",
                plugins: [
                  {
                    kind: "Plugin",
                    name: "examplePlugin",
                    comments: [
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    ],
                    provider: "@example/provider",
                    output: "node_modules/.storm/examplePlugin",
                    dependencies: ["exampleDependency1", "exampleDependency2"],
                    dependencyOf: "exampleDependency3",
                    options: {
                      exampleOption: "exampleValue",
                      anotherOption: 1,
                      thirdOption: [1, 2, 3],
                      lastOption: true
                    }
                  }
                ],
                models: [
                  {
                    kind: "Model",
                    name: "ExampleModel",
                    tableName: "example_object",
                    ref: {
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
                    }
                  }
                ],
                objects: [
                  {
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
                  }
                ],
                enums: [
                  {
                    kind: "Enum",
                    name: "ExampleEnum",
                    comments: [
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    ],

                    fields: [
                      {
                        name: "FIELD_NAME1",
                        type: "Int",
                        value: 0
                      },
                      {
                        name: "FIELD_NAME2",
                        type: "Int",
                        value: 1
                      },
                      {
                        name: "FIELD_NAME3",
                        type: "Int",
                        value: 2
                      },
                      {
                        name: "FIELD_NAME4",
                        type: "Int",
                        value: 3
                      }
                    ],
                    attributes: []
                  }
                ],
                events: [
                  {
                    kind: "Event",
                    name: "ExampleEvent",
                    topic: "storm.example.topic",
                    ref: {
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
                    }
                  }
                ],
                imports: [],
                queries: [],
                mutations: [],
                subscriptions: []
              }
            ]
          }}>
          <Story />
        </GraphStoreProvider>
      ) as React.ReactElement<
        unknown,
        string | React.JSXElementConstructor<any>
      >
  ],
  parameters: {
    docs: {
      theme
    }
  }
};

export default preview;

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
          schemas={[
            {
              name: "ExampleService",
              kind: "service",
              comments: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              ],
              dataSource: {
                kind: "data_source",
                name: "exampleDataSource",
                provider: "mysql",
                comments: [
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                ],
                "url":
                  "https://github.com/bluwy/publint/blob/master/pkg/src/index.js",
                directUrl:
                  "https://www.google.com/search?client=avast-a-1&q=publint&oq=publint&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQABhAMgYIAhAAGEAyBggDEAAYQDIGCAQQABhAMgYIBRAAGEAyBggGEAAYQDIGCAcQABhA0gEIMTYwMWowajSoAgCwAgA&ie=UTF-8"
              },
              plugins: [
                {
                  kind: "plugin",
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
              queries: [
                {
                  kind: "query",
                  name: "ExampleQuery",
                  comments: [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                  ],
                  url: "https://stormcloud.dev/graphql",
                  request: {
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
                    },
                    isArray: false
                  },
                  response: {
                    isArray: true,
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
                  },
                  isLive: true,
                  emits: [],
                  attributes: []
                }
              ],
              models: [
                {
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
                }
              ],
              objects: [
                {
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
              ],
              enums: [
                {
                  kind: "enum",
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
                  kind: "event",
                  name: "ExampleEvent",
                  topic: "storm.example.topic",
                  data: {
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
                    },
                    isArray: false
                  }
                }
              ],
              imports: [],
              mutations: [],
              subscriptions: []
            }
          ]}>
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

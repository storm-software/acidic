import type { Meta, StoryObj } from "@storybook/react";

import { ServiceGraph } from "./ServiceGraph";
import { DataSourceType, FieldType, NodeKind } from "@acidic/definition";

const meta: Meta<typeof ServiceGraph> = {
  title: "Nodes/ServiceGraph",
  component: ServiceGraph,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof ServiceGraph>;

export const Primary: Story = {
  args: {
    schemas: [
      {
        name: "ExampleService",
        kind: NodeKind.SERVICE,
        comments: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        ],
        dataSource: {
          kind: NodeKind.DATA_SOURCE,
          name: "exampleDataSource",
          provider: DataSourceType.POSTGRES,
          comments: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          ],
          url: "https://github.com/bluwy/publint/blob/master/pkg/src/index.js",
          directUrl:
            "https://www.google.com/search?client=avast-a-1&q=publint&oq=publint&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQABhAMgYIAhAAGEAyBggDEAAYQDIGCAQQABhAMgYIBRAAGEAyBggGEAAYQDIGCAcQABhA0gEIMTYwMWowajSoAgCwAgA&ie=UTF-8"
        },
        plugins: [
          {
            kind: NodeKind.PLUGIN,
            name: "examplePlugin",
            comments: [
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            ],
            provider: "@example/provider",
            output: "node_modules/.storm/examplePlugin",
            dependencies: ["exampleDependency1", "exampleDependency2"],
            options: {
              exampleOption: "exampleValue",
              anotherOption: 1,
              thirdOption: [1, 2, 3],
              lastOption: true
            },
            attributes: []
          }
        ],
        queries: [
          {
            kind: NodeKind.QUERY,
            name: "ExampleQuery",
            comments: [
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            ],
            url: "https://stormcloud.dev/graphql",
            request: {
              kind: NodeKind.OBJECT,
              name: "ExampleObject",
              comments: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              ],
              fields: [
                {
                  name: "exampleString",
                  comments: [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                  ],
                  type: FieldType.STRING,
                  isRequired: false,
                  isArray: false,
                  attributes: [],
                  defaultValue: "Example Default"
                },
                {
                  name: "exampleDecimal",
                  comments: [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                  ],
                  type: FieldType.DECIMAL,
                  isArray: false,
                  isRequired: true,
                  attributes: [],
                  defaultValue: 5.005
                },
                {
                  name: "exampleStringArray",
                  comments: [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                  ],
                  type: FieldType.STRING,
                  isRequired: false,
                  isArray: true,
                  attributes: []
                },
                {
                  name: "exampleBooleanRequired",
                  comments: [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                  ],
                  type: FieldType.BOOLEAN,
                  isRequired: true,
                  isArray: false,
                  attributes: []
                }
              ],
              relationships: [],
              extends: [],
              isExtending: false,
              attributes: []
            },
            response: {
              isArray: true,
              ref: {
                kind: NodeKind.OBJECT,
                name: "ExampleObject",
                comments: [
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                ],
                fields: [
                  {
                    name: "exampleString",
                    comments: [
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                    ],
                    type: FieldType.STRING,
                    isRequired: false,
                    isArray: false,
                    attributes: [],
                    defaultValue: "Example Default"
                  },
                  {
                    name: "exampleDecimal",
                    comments: [
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                    ],
                    type: FieldType.DECIMAL,
                    isArray: false,
                    isRequired: true,
                    attributes: [],
                    defaultValue: 5.005
                  },
                  {
                    name: "exampleStringArray",
                    comments: [
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                    ],
                    type: FieldType.STRING,
                    isRequired: false,
                    isArray: true,
                    attributes: []
                  },
                  {
                    name: "exampleBooleanRequired",
                    comments: [
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                    ],
                    type: FieldType.BOOLEAN,
                    isRequired: true,
                    isArray: false,
                    attributes: []
                  }
                ],
                relationships: [],
                extends: [],
                isExtending: false,
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
            kind: NodeKind.MODEL,
            comments: [
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            ],
            name: "ExampleModel",
            tableName: "example_object",
            attributes: [],
            data: {
              kind: NodeKind.OBJECT,
              name: "ExampleObject",
              comments: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              ],
              fields: [
                {
                  name: "exampleString",
                  comments: [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                  ],
                  type: FieldType.STRING,
                  isRequired: false,
                  isArray: false,
                  attributes: [],
                  defaultValue: "Example Default"
                },
                {
                  name: "exampleDecimal",
                  comments: [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                  ],
                  type: FieldType.DECIMAL,
                  isArray: false,
                  isRequired: true,
                  attributes: [],
                  defaultValue: 5.005
                },
                {
                  name: "exampleStringArray",
                  comments: [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                  ],
                  type: FieldType.STRING,
                  isRequired: false,
                  isArray: true,
                  attributes: []
                },
                {
                  name: "exampleBooleanRequired",
                  comments: [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                  ],
                  type: FieldType.BOOLEAN,
                  isRequired: true,
                  isArray: false,
                  attributes: []
                }
              ],
              relationships: [],
              extends: [],
              isExtending: false,
              attributes: []
            }
          }
        ],
        objects: [
          {
            kind: NodeKind.OBJECT,
            name: "ExampleObject",
            comments: [
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            ],
            fields: [
              {
                name: "exampleString",
                comments: [
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                ],
                type: FieldType.STRING,
                isRequired: false,
                isArray: false,
                attributes: [],
                defaultValue: "Example Default"
              },
              {
                name: "exampleDecimal",
                comments: [
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                ],
                type: FieldType.DECIMAL,
                isArray: false,
                isRequired: true,
                attributes: [],
                defaultValue: 5.005
              },
              {
                name: "exampleStringArray",
                comments: [
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                ],
                type: FieldType.STRING,
                isRequired: false,
                isArray: true,
                attributes: []
              },
              {
                name: "exampleBooleanRequired",
                comments: [
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                ],
                type: FieldType.BOOLEAN,
                isRequired: true,
                isArray: false,
                attributes: []
              }
            ],
            relationships: [],
            extends: [],
            isExtending: false,
            attributes: []
          }
        ],
        enums: [
          {
            kind: NodeKind.ENUM,
            name: "ExampleEnum",
            comments: [
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            ],

            fields: [
              {
                name: "FIELD_NAME1",
                comments: [
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                ],
                type: FieldType.STRING,
                value: "FIELD_NAME1"
              },
              {
                name: "FIELD_NAME2",
                comments: [
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                ],
                type: FieldType.STRING,
                value: "FIELD_NAME2"
              },
              {
                name: "FIELD_NAME3",
                comments: [
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                ],
                type: FieldType.STRING,
                value: "FIELD_NAME3"
              },
              {
                name: "FIELD_NAME4",
                comments: [
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                ],
                type: FieldType.STRING,
                value: "FIELD_NAME4"
              }
            ]
          }
        ],
        events: [
          {
            kind: NodeKind.EVENT,
            comments: [
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            ],
            name: "ExampleEvent",
            topic: "storm.example.topic",
            data: {
              kind: NodeKind.OBJECT,
              name: "ExampleObject",
              comments: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              ],
              fields: [
                {
                  name: "exampleString",
                  comments: [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                  ],
                  type: FieldType.STRING,
                  isRequired: false,
                  isArray: false,
                  attributes: [],
                  defaultValue: "Example Default"
                },
                {
                  name: "exampleDecimal",
                  comments: [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                  ],
                  type: FieldType.DECIMAL,
                  isArray: false,
                  isRequired: true,
                  attributes: [],
                  defaultValue: 5.005
                },
                {
                  name: "exampleStringArray",
                  comments: [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                  ],
                  type: FieldType.STRING,
                  isRequired: false,
                  isArray: true,
                  attributes: []
                },
                {
                  name: "exampleBooleanRequired",
                  comments: [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                  ],
                  type: FieldType.BOOLEAN,
                  isRequired: true,
                  isArray: false,
                  attributes: []
                }
              ],
              relationships: [],
              extends: [],
              isExtending: false,
              attributes: []
            },
            attributes: []
          }
        ],
        imports: [],
        mutations: [],
        subscriptions: [],
        attributes: []
      }
    ]
  }
};

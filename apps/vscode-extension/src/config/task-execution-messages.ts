export interface GlobalConfigurationData {
  enableTaskExecutionDryRunOnChange: boolean;
}

// Task execution output messages
export type TaskExecutionOutputMessage =
  | TaskExecutionFormInitOutputMessage
  | TaskExecutionRunCommandOutputMessage;

export enum TaskExecutionOutputMessageType {
  TaskExecutionFormInit = "output-init",
  RunCommand = "run-command"
}

export class TaskExecutionRunCommandOutputMessage {
  readonly payloadType = TaskExecutionOutputMessageType.RunCommand;

  constructor(public readonly payload: TaskExecutionMessage) {}
}

export class TaskExecutionFormInitOutputMessage {
  readonly payloadType = TaskExecutionOutputMessageType.TaskExecutionFormInit;
}

// Task execution input messages
export type TaskExecutionInputMessage =
  | TaskExecutionSchemaInputMessage
  | TaskExecutionGlobalConfigurationInputMessage
  | TaskExecutionSetStylesMessage;

export enum TaskExecutionInputMessageType {
  SetTaskExecutionSchema = "generator",
  SetGlobalConfiguration = "config",
  SetStyles = "style"
}

export class TaskExecutionSchemaInputMessage {
  readonly payloadType = TaskExecutionInputMessageType.SetTaskExecutionSchema;

  constructor(public readonly payload: TaskExecutionSchema) {}
}

export class TaskExecutionGlobalConfigurationInputMessage {
  readonly payloadType = TaskExecutionInputMessageType.SetGlobalConfiguration;

  constructor(public readonly payload: GlobalConfigurationData) {}
}

export class TaskExecutionSetStylesMessage {
  readonly payloadType = TaskExecutionInputMessageType.SetStyles;

  constructor(
    public readonly payload: {
      backgroundColor: string;
      highlightTextColor: string;
      secondaryTextColor: string;
      fieldBackground: string;
      fontFamily: string;
      fontSize: string;
    }
  ) {}
}

export interface TaskExecutionMessage {
  command: string;
  positional: string;
  flags: string[];
}

export interface DefaultValue {
  name: string;
  defaultValue: string | undefined;
}

export interface TargetConfiguration {
  name: string;
  defaultValues: DefaultValue[];
}

export interface TaskExecutionSchema {
  name: string;
  command: string;
  collection?: string;
  positional: string;
  builder?: string;
  description: string;
  configurations?: TargetConfiguration[];
  options: any[];
  contextValues?: {
    path?: string;
    directory?: string;
    project?: string;
    projectName?: string;
  };
}

import type {
  EnumDefinition,
  EventDefinition,
  ModelDefinition,
  ObjectDefinition,
  OperationDefinition,
  PluginDefinition,
  ServiceDefinition
} from "@acidic/definition";
import { NodeType } from "../utilities/node-types";
import type { Node } from "reactflow";
import { getNodeId } from "../utilities/get-node-id";

export const getServiceNodes = (
  schema: ServiceDefinition,
  _existingNodes: Node<any>[],
  _serviceNodes: Node<any>[]
): Node<any>[] => {
  let serviceNodes = _serviceNodes;

  serviceNodes = schema.enums.reduce((ret: Node<any>[], enumDefinition: EnumDefinition) => {
    const node: Node<any> = {
      id: getNodeId(enumDefinition.name, schema.name),
      type: NodeType.ENUM_NODE,
      data: {
        name: enumDefinition.name
      },
      position: { x: 50, y: serviceNodes.length * 100 },
      dragHandle: "acidic-drag",
      draggable: true,
      focusable: true,
      parentNode: schema.name,
      extent: "parent"
    };
    ret.push(node);

    return ret;
  }, serviceNodes);

  serviceNodes = schema.models.reduce((ret: Node<any>[], modelDefinition: ModelDefinition) => {
    const node: Node<any> = {
      id: getNodeId(modelDefinition.name, schema.name),
      type: NodeType.MODEL_NODE,
      data: {
        name: modelDefinition.name
      },
      position: { x: 200, y: serviceNodes.length * 100 },
      dragHandle: "acidic-drag",
      draggable: true,
      focusable: true,
      parentNode: schema.name,
      extent: "parent"
    };
    ret.push(node);

    return ret;
  }, serviceNodes);
  serviceNodes = schema.objects.reduce((ret: Node<any>[], objectDefinition: ObjectDefinition) => {
    if (!ret.some((existing) => existing.id === objectDefinition.name)) {
      const node: Node<any> = {
        id: getNodeId(objectDefinition.name, schema.name),
        type: NodeType.OBJECT_NODE,
        data: {
          name: objectDefinition.name
        },
        position: { x: 600, y: serviceNodes.length * 100 },
        dragHandle: "acidic-drag",
        draggable: true,
        focusable: true,
        parentNode: schema.name,
        extent: "parent"
      };
      ret.push(node);
    }

    return ret;
  }, serviceNodes);

  serviceNodes = schema.events.reduce((ret: Node<any>[], eventDefinition: EventDefinition) => {
    if (!ret.some((existing) => existing.id === eventDefinition.name)) {
      const node: Node<any> = {
        id: getNodeId(eventDefinition.name, schema.name),
        type: NodeType.EVENT_NODE,
        data: {
          name: eventDefinition.name
        },
        position: { x: 400, y: serviceNodes.length * 100 },
        dragHandle: "acidic-drag",
        draggable: true,
        focusable: true,
        expandParent: true,
        parentNode: schema.name,
        extent: "parent"
      };
      ret.push(node);
    }

    return ret;
  }, serviceNodes);
  serviceNodes = schema.queries.reduce(
    (ret: Node<any>[], operationDefinition: OperationDefinition) => {
      if (!ret.some((existing) => existing.id === operationDefinition.name)) {
        const node: Node<any> = {
          id: getNodeId(operationDefinition.name, schema.name),
          type: NodeType.OPERATION_NODE,
          data: {
            name: operationDefinition.name
          },
          position: { x: 600, y: serviceNodes.length * 100 },
          dragHandle: "acidic-drag",
          draggable: true,
          focusable: true,
          parentNode: schema.name,
          extent: "parent"
        };
        ret.push(node);
      }

      return ret;
    },
    serviceNodes
  );
  serviceNodes = schema.mutations.reduce(
    (ret: Node<any>[], operationDefinition: OperationDefinition) => {
      if (!ret.some((existing) => existing.id === operationDefinition.name)) {
        const node: Node<any> = {
          id: getNodeId(operationDefinition.name, schema.name),
          type: NodeType.OPERATION_NODE,
          data: {
            name: operationDefinition.name
          },
          position: { x: 600, y: serviceNodes.length * 100 },
          dragHandle: "acidic-drag",
          draggable: true,
          focusable: true,
          parentNode: schema.name,
          extent: "parent"
        };
        ret.push(node);
      }

      return ret;
    },
    serviceNodes
  );
  serviceNodes = schema.subscriptions.reduce(
    (ret: Node<any>[], operationDefinition: OperationDefinition) => {
      if (!ret.some((existing) => existing.id === operationDefinition.name)) {
        const node: Node<any> = {
          id: getNodeId(operationDefinition.name, schema.name),
          type: NodeType.OPERATION_NODE,
          data: {
            name: operationDefinition.name
          },
          position: { x: 600, y: serviceNodes.length * 100 },
          dragHandle: "acidic-drag",
          draggable: true,
          focusable: true,
          parentNode: schema.name,
          extent: "parent"
        };
        ret.push(node);
      }

      return ret;
    },
    serviceNodes
  );

  serviceNodes = schema.plugins.reduce((ret: Node<any>[], pluginDefinition: PluginDefinition) => {
    if (!ret.some((existing) => existing.id === pluginDefinition.name)) {
      const node: Node<any> = {
        id: getNodeId(pluginDefinition.name, schema.name),
        type: NodeType.PLUGIN_NODE,
        data: {
          name: pluginDefinition.name
        },
        position: { x: 600, y: serviceNodes.length * 100 },
        dragHandle: "acidic-drag",
        draggable: true,
        focusable: true,
        parentNode: schema.name,
        extent: "parent"
      };
      ret.push(node);
    }

    return ret;
  }, serviceNodes);

  return serviceNodes;
};

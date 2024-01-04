import {
  EnumSchema,
  EventSchema,
  ModelSchema,
  ObjectSchema,
  OperationSchema,
  PluginSchema,
  ServiceSchema
} from "@acidic/schema";
import { Atom, atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { getNodeId } from "../utilities/get-node-id";
import { graphStore } from "./create-graph-store";

export const serviceAtoms = atomFamily<string, Atom<ServiceSchema | undefined>>(
  (name: string) =>
    atom(get =>
      get(graphStore.atom.schemas).find(schema => schema.name === name)
    )
);

export const pluginAtoms = atomFamily<string, Atom<PluginSchema | undefined>>(
  (id: string) =>
    atom(get => {
      const serviceSchema = get(graphStore.atom.schemas).find(schema =>
        schema.plugins.some(
          pluginSchema => getNodeId(pluginSchema.name, schema.name) === id
        )
      );

      return serviceSchema?.plugins.find(
        pluginSchema => getNodeId(pluginSchema.name, serviceSchema.name) === id
      );
    })
);

export const operationAtoms = atomFamily<
  string,
  Atom<OperationSchema | undefined>
>((id: string) =>
  atom(get => {
    const serviceSchema = get(graphStore.atom.schemas).find(
      schema =>
        schema.queries.some(
          operationSchema => getNodeId(operationSchema.name, schema.name) === id
        ) ||
        schema.mutations.some(
          operationSchema => getNodeId(operationSchema.name, schema.name) === id
        ) ||
        schema.subscriptions.some(
          operationSchema => getNodeId(operationSchema.name, schema.name) === id
        )
    );

    return (
      serviceSchema?.queries.find(
        operationSchema =>
          getNodeId(operationSchema.name, serviceSchema.name) === id
      ) ??
      serviceSchema?.mutations.find(
        operationSchema =>
          getNodeId(operationSchema.name, serviceSchema.name) === id
      ) ??
      serviceSchema?.subscriptions.find(
        operationSchema =>
          getNodeId(operationSchema.name, serviceSchema.name) === id
      )
    );
  })
);

export const modelAtoms = atomFamily<string, Atom<ModelSchema | undefined>>(
  (id: string) =>
    atom(get => {
      const serviceSchema = get(graphStore.atom.schemas).find(schema =>
        schema.models.some(
          modelSchema => getNodeId(modelSchema.name, schema.name) === id
        )
      );

      return serviceSchema?.models.find(
        modelSchema => getNodeId(modelSchema.name, serviceSchema.name) === id
      );
    })
);

export const eventAtoms = atomFamily<string, Atom<EventSchema | undefined>>(
  (id: string) =>
    atom(get => {
      const serviceSchema = get(graphStore.atom.schemas).find(schema =>
        schema.events.some(
          eventSchema => getNodeId(eventSchema.name, schema.name) === id
        )
      );

      return serviceSchema?.events.find(
        eventSchema => getNodeId(eventSchema.name, serviceSchema.name) === id
      );
    })
);

export const objectAtoms = atomFamily<string, Atom<ObjectSchema | undefined>>(
  (id: string) =>
    atom(get => {
      const serviceSchema = get(graphStore.atom.schemas).find(schema =>
        schema.objects.some(
          objectSchema => getNodeId(objectSchema.name, schema.name) === id
        )
      );

      return serviceSchema?.objects.find(
        objectSchema => getNodeId(objectSchema.name, serviceSchema.name) === id
      );
    })
);

export const enumAtoms = atomFamily<string, Atom<EnumSchema | undefined>>(
  (id: string) =>
    atom(get => {
      const serviceSchema = get(graphStore.atom.schemas).find(schema =>
        schema.enums.some(
          enumSchema => getNodeId(enumSchema.name, schema.name) === id
        )
      );

      return serviceSchema?.enums.find(
        enumSchema => getNodeId(enumSchema.name, serviceSchema.name) === id
      );
    })
);

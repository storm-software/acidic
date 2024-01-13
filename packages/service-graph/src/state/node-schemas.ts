import {
  EnumDefinition,
  EventDefinition,
  ModelDefinition,
  ObjectDefinition,
  OperationDefinition,
  PluginDefinition,
  ServiceDefinition
} from "@acidic/schema";
import { Atom, atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { getNodeId } from "../utilities/get-node-id";
import { graphStore } from "./create-graph-store";

export const serviceAtoms = atomFamily<
  string,
  Atom<ServiceDefinition | undefined>
>((name: string) =>
  atom(get => get(graphStore.atom.schemas).find(schema => schema.name === name))
);

export const pluginAtoms = atomFamily<
  string,
  Atom<PluginDefinition | undefined>
>((id: string) =>
  atom(get => {
    const serviceDefinition = get(graphStore.atom.schemas).find(schema =>
      schema.plugins.some(
        pluginDefinition => getNodeId(pluginDefinition.name, schema.name) === id
      )
    );

    return serviceDefinition?.plugins.find(
      pluginDefinition =>
        getNodeId(pluginDefinition.name, serviceDefinition.name) === id
    );
  })
);

export const operationAtoms = atomFamily<
  string,
  Atom<OperationDefinition | undefined>
>((id: string) =>
  atom(get => {
    const serviceDefinition = get(graphStore.atom.schemas).find(
      schema =>
        schema.queries.some(
          operationDefinition =>
            getNodeId(operationDefinition.name, schema.name) === id
        ) ||
        schema.mutations.some(
          operationDefinition =>
            getNodeId(operationDefinition.name, schema.name) === id
        ) ||
        schema.subscriptions.some(
          operationDefinition =>
            getNodeId(operationDefinition.name, schema.name) === id
        )
    );

    return (
      serviceDefinition?.queries.find(
        operationDefinition =>
          getNodeId(operationDefinition.name, serviceDefinition.name) === id
      ) ??
      serviceDefinition?.mutations.find(
        operationDefinition =>
          getNodeId(operationDefinition.name, serviceDefinition.name) === id
      ) ??
      serviceDefinition?.subscriptions.find(
        operationDefinition =>
          getNodeId(operationDefinition.name, serviceDefinition.name) === id
      )
    );
  })
);

export const modelAtoms = atomFamily<string, Atom<ModelDefinition | undefined>>(
  (id: string) =>
    atom(get => {
      const serviceDefinition = get(graphStore.atom.schemas).find(schema =>
        schema.models.some(
          modelDefinition => getNodeId(modelDefinition.name, schema.name) === id
        )
      );

      return serviceDefinition?.models.find(
        modelDefinition =>
          getNodeId(modelDefinition.name, serviceDefinition.name) === id
      );
    })
);

export const eventAtoms = atomFamily<string, Atom<EventDefinition | undefined>>(
  (id: string) =>
    atom(get => {
      const serviceDefinition = get(graphStore.atom.schemas).find(schema =>
        schema.events.some(
          eventDefinition => getNodeId(eventDefinition.name, schema.name) === id
        )
      );

      return serviceDefinition?.events.find(
        eventDefinition =>
          getNodeId(eventDefinition.name, serviceDefinition.name) === id
      );
    })
);

export const objectAtoms = atomFamily<
  string,
  Atom<ObjectDefinition | undefined>
>((id: string) =>
  atom(get => {
    const serviceDefinition = get(graphStore.atom.schemas).find(schema =>
      schema.objects.some(
        objectDefinition => getNodeId(objectDefinition.name, schema.name) === id
      )
    );

    return serviceDefinition?.objects.find(
      objectDefinition =>
        getNodeId(objectDefinition.name, serviceDefinition.name) === id
    );
  })
);

export const enumAtoms = atomFamily<string, Atom<EnumDefinition | undefined>>(
  (id: string) =>
    atom(get => {
      const serviceDefinition = get(graphStore.atom.schemas).find(schema =>
        schema.enums.some(
          enumDefinition => getNodeId(enumDefinition.name, schema.name) === id
        )
      );

      return serviceDefinition?.enums.find(
        enumDefinition =>
          getNodeId(enumDefinition.name, serviceDefinition.name) === id
      );
    })
);

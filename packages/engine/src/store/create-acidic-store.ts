import { BentoCache, bentostore } from "bentocache";
import { memoryDriver } from "bentocache/drivers/memory";
import { fileDriver } from "bentocache/drivers/file";
import type { AcidicStore, ServiceStoreItem } from "../types";
import type { MaybePromise } from "@storm-stack/utilities";
import { StormTrace } from "@storm-stack/telemetry";
import type { AcidicConfig } from "@acidic/definition";
import { snowflake } from "@storm-stack/unique-identifier";
import { notificationBusDriver } from "./notification-bus-driver";

export const createAcidicStore = async (
  config: AcidicConfig,
  logger?: StormTrace
): Promise<AcidicStore> => {
  const _logger = logger ?? StormTrace.create(config, "Acidic Store");

  const cache = new BentoCache({
    default: "store",
    logger: _logger,
    // ttl: "20s",
    // earlyExpiration: 0.8,
    // gracePeriod: {
    //   enabled: true,
    //   duration: "30m",
    //   fallbackDuration: "5m"
    // },
    stores: {
      store: bentostore()
        .useL1Layer(
          memoryDriver({
            maxSize: 20 * 1024 * 1024,
            maxItems: 6000
          })
        )
        .useL2Layer(
          fileDriver({
            directory: config.extensions.acidic.cacheDirectory,
            prefix: "acidic-"
          })
        )
        .useBus(notificationBusDriver())
    }
  });

  const servicesNamespace = cache.namespace("services");
  await servicesNamespace.set("paths", []);
  const definitionsNamespace = cache.namespace("definitions");

  const settingsNamespace = cache.namespace("settings");
  await settingsNamespace.set("config", config);

  /*const handlers = {} as Record<
    string,
    (arg: {
      key: string;
      store: string;
      value: any;
    }) => MaybePromise<void>
  >;*/

  return {
    getServices: async () => {
      const paths = await servicesNamespace.get<string[]>("paths");

      return Promise.all(
        paths?.map(
          (path) => definitionsNamespace.get<ServiceStoreItem>(path) as Promise<ServiceStoreItem>
        ) ?? []
      );
    },
    getService: (path: string) => {
      return definitionsNamespace.get<ServiceStoreItem>(path);
    },
    setService: async (path: string, item: ServiceStoreItem) => {
      try {
        _logger.info(`Setting service: ${path}`);
        await definitionsNamespace.set(path, item);

        const current = await servicesNamespace.get<string[]>("paths");
        const paths = current ?? [];
        if (!paths.includes(path)) {
          await servicesNamespace.set("paths", [...paths, path]);
        }
      } catch (_) {
        _logger.error(`Error setting service: ${path}`);
      }
      // } finally {
      //   // await Promise.all(
      //   //   Object.values(handlers).map((handler) =>
      //   //     Promise.resolve(handler({ key: path, store: "services", value: item }))
      //   //   )
      //   // );
      // }
    },
    deleteService: async (path: string) => {
      definitionsNamespace.delete(path);
      const paths = (await servicesNamespace.get<string[]>("paths")) ?? [];
      if (paths.includes(path)) {
        await servicesNamespace.set(
          "paths",
          paths.filter((existing) => existing !== path)
        );
      }
    },
    clearServices: async () => {
      await Promise.all([servicesNamespace.set("paths", []), definitionsNamespace.clear()]);
    },
    getSetting: <T>(key: string) => {
      return settingsNamespace.get<T>(key);
    },
    setSetting: async <T>(key: string, setting: T) => {
      await settingsNamespace.set(key, setting);
    },
    subscribe: (
      callback: (arg: { key: string; store: string; value: any }) => MaybePromise<void>
    ): (() => void) => {
      const id = snowflake();
      const callbackFn = (arg: { key: string; store: string; value: any }) => {
        _logger.info(`Subscribe callback invoked for service: ${id}`);
        callback(arg);
      };

      cache.on("cache:written", callbackFn);
      // handlers[id] = callbackFn;

      return () => {
        cache.off("cache:written", callbackFn);
        // delete handlers[id];
      };
    }
  };
};

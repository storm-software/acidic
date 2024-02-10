import type { AcidicPluginOptions } from "@acidic/definition";
import { StormError } from "@storm-stack/errors";
import { joinPaths } from "@storm-stack/file-system";
import {
  type PluginDefinition,
  type PluginInstance,
  PluginLoader as BasePluginLoader,
  PluginSystemErrorCode
} from "@storm-stack/plugin-system";
import type { AcidicContext, AcidicPluginModule } from "../types";

export class PluginLoader extends BasePluginLoader<AcidicContext, AcidicPluginModule> {
  public override load = async (
    definition: PluginDefinition,
    options: Record<string, any> = {}
  ): Promise<PluginInstance<AcidicContext, AcidicPluginModule>> => {
    let module: AcidicPluginModule<AcidicPluginOptions>;
    let resolvedPath = definition.provider;
    try {
      module = await this.resolve(definition);
    } catch (_) {
      resolvedPath = this._getPluginModulePath(definition.provider);
      module = await this.resolve({ ...definition, provider: resolvedPath });
    }

    if (!this.isValid(module)) {
      throw new StormError(PluginSystemErrorCode.plugin_loading_failure, {
        message: `The plugin module "${definition.provider}" does not contain the required exports.`
      });
    }

    return this.instantiate(definition, module, resolvedPath, options);
  };

  public override process = async (
    context: AcidicContext,
    instance: PluginInstance<AcidicContext, AcidicPluginModule>,
    options: Record<string, any> = {}
  ) => {
    if (instance.module.process) {
      return await instance.module.process(
        context,
        options as AcidicPluginOptions,
        instance.module.generator
      );
    }
  };

  private _getPluginModulePath(provider: string) {
    let pluginModulePath = provider;
    if (pluginModulePath.startsWith("@acidic/")) {
      pluginModulePath = `file://${joinPaths(
        pluginModulePath.replace("@acidic/", joinPaths(__dirname, "../../../../../plugins/")),
        "index.js"
      )}`;
    }

    return pluginModulePath;
  }
}

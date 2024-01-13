import { AcidicPluginOptions } from "@acidic/schema";
import { StormError } from "@storm-stack/errors";
import { joinPaths } from "@storm-stack/file-system";
import {
  PluginDefinition,
  PluginInstance,
  PluginLoader,
  PluginSystemErrorCode
} from "@storm-stack/plugin-system";
import { AcidicContext, AcidicPluginModule } from "../types";

export class AcidicPluginLoader extends PluginLoader<
  AcidicContext,
  AcidicPluginModule
> {
  public override load = async (
    definition: PluginDefinition,
    options: Record<string, any> = {}
  ): Promise<PluginInstance<AcidicContext, AcidicPluginModule>> => {
    let module;
    let resolvedPath = definition.provider;
    try {
      module = await import(resolvedPath);
    } catch (error) {
      resolvedPath = this._getPluginModulePath(definition.provider);
      module = await import(resolvedPath);
    }

    if (!this.isValid(module)) {
      throw new StormError(PluginSystemErrorCode.plugin_loading_failure, {
        message: `The plugin module "${definition.provider}" does not contain the required exports.`
      });
    }

    return this.instantiate(definition, module, resolvedPath, options);
  };

  public override execute = async (
    instance: PluginInstance<AcidicContext, AcidicPluginModule>,
    context: AcidicContext,
    options: AcidicPluginOptions
  ) => {
    if (instance.module.execute) {
      return await instance.module.execute(
        options,
        context,
        instance.module.generator
      );
    }
  };

  private _getPluginModulePath(provider: string) {
    let pluginModulePath = provider;
    if (pluginModulePath.startsWith("@acidic/")) {
      pluginModulePath = `file://${joinPaths(
        pluginModulePath.replace(
          "@acidic/",
          joinPaths(__dirname, "../../../../../plugins/")
        ),
        "index.cjs"
      )}`;
    }

    return pluginModulePath;
  }
}

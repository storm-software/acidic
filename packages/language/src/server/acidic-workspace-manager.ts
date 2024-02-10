import { PLUGIN_MODULE_NAME, STD_LIB_MODULE_NAME } from "../constants";
import { getLiteral } from "../utilities";
import { isAcidicPlugin, type AcidicSchema } from "../ast";
import { DefaultWorkspaceManager, type LangiumDocument, interruptAndCheck } from "langium";
import path from "node:path";
import { CancellationToken, type WorkspaceFolder } from "vscode-languageserver";
import { URI, Utils } from "vscode-uri";

/**
 * Custom Langium WorkspaceManager implementation which automatically loads stdlib.storm
 */
export default class AcidicWorkspaceManager extends DefaultWorkspaceManager {
  public pluginModels = new Set<string>();

  protected override async loadAdditionalDocuments(
    _folders: WorkspaceFolder[],
    _collector: (document: LangiumDocument) => void
  ): Promise<void> {
    await super.loadAdditionalDocuments(_folders, _collector);
    const stdLibUri = URI.file(path.join(__dirname, "../res", STD_LIB_MODULE_NAME));
    console.log(`Adding stdlib document from ${stdLibUri}`);
    const stdlib = this.langiumDocuments.getOrCreateDocument(stdLibUri);
    _collector(stdlib);
  }

  override async initializeWorkspace(
    folders: WorkspaceFolder[],
    cancelToken = CancellationToken.None
  ): Promise<void> {
    try {
      const fileExtensions = this.serviceRegistry.all.flatMap(
        (e) => e.LanguageMetaData.fileExtensions
      );
      const documents: LangiumDocument[] = [];
      const collector = (document: LangiumDocument) => {
        documents.push(document);
        if (!this.langiumDocuments.hasDocument(document.uri)) {
          this.langiumDocuments.addDocument(document);
        }
      };

      await this.loadAdditionalDocuments(folders, collector);
      await Promise.all(
        folders
          .map((wf) => [wf, this.getRootFolder(wf)] as [WorkspaceFolder, URI])
          .map(async (entry) => this.traverseFolder(...entry, fileExtensions, collector))
      );

      // find plugin models
      for (const document of documents) {
        const parsed = document.parseResult.value as AcidicSchema;
        for (const decl of parsed.declarations) {
          if (isAcidicPlugin(decl)) {
            const providerField = decl.fields.find((f) => f.name === "provider");
            if (providerField) {
              const provider = getLiteral<string>(providerField.value);
              if (provider) {
                this.pluginModels.add(provider);
              }
            }
          }
        }
      }

      if (this.pluginModels.size > 0) {
        console.log(`Used plugin documents: ${Array.from(this.pluginModels)}`);

        const unLoadedPluginModels = new Set(this.pluginModels);

        await Promise.all(
          folders
            .map((wf) => [wf, this.getRootFolder(wf)] as [WorkspaceFolder, URI])
            .map(async (entry) => this.loadPluginModels(...entry, unLoadedPluginModels, collector))
        );
        if (unLoadedPluginModels.size > 0) {
          console.warn(
            `The following plugin documents could not be loaded: ${Array.from(
              unLoadedPluginModels
            )}`
          );
        }

        // the loaded plugin models would be removed from the set
        /*const unLoadedPluginModels = new Set(this.pluginModels);

        await Promise.all(
          folders
            .map((wf) => [wf, this.getRootFolder(wf)] as [WorkspaceFolder, URI])
            .map(async (entry) => this.loadPluginModels(...entry, unLoadedPluginModels, collector))
        );

        if (unLoadedPluginModels.size > 0) {
          console.warn(
            `The following plugin documents could not be loaded: ${Array.from(unLoadedPluginModels)}`
          );
        }*/
      }

      // Only after creating all documents do we check whether we need to cancel the initialization
      // The document builder will later pick up on all unprocessed documents
      await interruptAndCheck(cancelToken);
      await this.documentBuilder.build(documents, undefined, cancelToken);
    } catch (e) {
      console.error("An error occured initializing the Acidic Workspace...");
      console.error(e);
    }
  }

  protected async loadPluginModels(
    workspaceFolder: WorkspaceFolder,
    folderPath: URI,
    pluginModels: Set<string>,
    collector: (document: LangiumDocument) => void
  ): Promise<void> {
    const content = (await this.fileSystemProvider.readDirectory(folderPath)).sort((a, b) => {
      // make sure the node_modules folder is always the first one to be checked
      // so it could be early exited if the plugin is found
      if (a.isDirectory && b.isDirectory) {
        const aName = Utils.basename(a.uri);
        if (aName === "node_modules") {
          return -1;
        }
        return 1;
      }
      return 0;
    });

    for (const entry of content) {
      if (entry.isDirectory) {
        const name = Utils.basename(entry.uri);
        if (name === "node_modules") {
          for (const plugin of Array.from(pluginModels)) {
            const path = Utils.joinPath(entry.uri, plugin, PLUGIN_MODULE_NAME);
            try {
              this.fileSystemProvider.readFileSync(path);
              const document = this.langiumDocuments.getOrCreateDocument(path);
              collector(document);
              console.log(`Adding plugin document from ${path.path}`);

              pluginModels.delete(plugin);
              // early exit if all plugins are loaded
              if (pluginModels.size === 0) {
                return;
              }
            } catch {
              // no-op. The module might be found in another node_modules folder
              // will show the warning message eventually if not found
            }
          }
        } else {
          await this.loadPluginModels(workspaceFolder, entry.uri, pluginModels, collector);
        }
      }
    }
  }
}

import {
  AcidicGeneratedModule,
  AcidicGeneratedSharedModule
} from "@acidic/language";
import {
  DefaultAstNodeDescriptionProvider,
  DefaultAstNodeLocator,
  DefaultCommentProvider,
  DefaultCompletionProvider,
  DefaultConfigurationProvider,
  DefaultDefinitionProvider,
  DefaultDocumentBuilder,
  DefaultDocumentHighlightProvider,
  DefaultDocumentSymbolProvider,
  DefaultDocumentValidator,
  DefaultFoldingRangeProvider,
  DefaultFuzzyMatcher,
  DefaultIndexManager,
  DefaultJsonSerializer,
  DefaultLangiumDocumentFactory,
  DefaultLangiumDocuments,
  DefaultLanguageServer,
  DefaultLexer,
  DefaultLinker,
  DefaultModuleContext,
  DefaultNameProvider,
  DefaultNodeKindProvider,
  DefaultReferenceDescriptionProvider,
  DefaultReferences,
  DefaultReferencesProvider,
  DefaultRenameProvider,
  DefaultScopeComputation,
  DefaultScopeProvider,
  DefaultServiceRegistry,
  DefaultSharedModuleContext,
  DefaultTokenBuilder,
  DefaultValueConverter,
  JSDocDocumentationProvider,
  LangiumDefaultServices,
  LangiumDefaultSharedServices,
  LangiumParserErrorMessageProvider,
  LangiumServices,
  LangiumSharedServices,
  Module,
  MultilineCommentHoverProvider,
  MutexLock,
  PartialLangiumServices,
  ValidationRegistry,
  createCompletionParser,
  createGrammarConfig,
  inject
} from "langium";
import { TextDocument } from "vscode-languageserver-textdocument";
import { TextDocuments } from "vscode-languageserver/lib/common/textDocuments";
import { AcidicCodeActionProvider } from "./acidic-code-action";
import { AcidicDefinitionProvider } from "./acidic-definition";
import { AcidicFormatter } from "./acidic-formatter";
import { AcidicLinker } from "./acidic-linker";
import { createAcidicParser } from "./acidic-parser";
import { AcidicScopeComputation, AcidicScopeProvider } from "./acidic-scope";
import AcidicWorkspaceManager from "./acidic-workspace-manager";
import {
  AcidicValidationRegistry,
  AcidicValidator
} from "./validators/acidic-validator";

/**
 * Declaration of custom services - add your own service classes here.
 */
export type AcidicAddedServices = {
  validation: {
    AcidicValidator: AcidicValidator;
  };
};

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type AcidicServices = LangiumServices & AcidicAddedServices;

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const AcidicModule: Module<
  AcidicServices,
  PartialLangiumServices & AcidicAddedServices
> = {
  references: {
    ScopeComputation: services => new AcidicScopeComputation(services),
    Linker: services => new AcidicLinker(services),
    ScopeProvider: services => new AcidicScopeProvider(services)
  },
  validation: {
    ValidationRegistry: services => new AcidicValidationRegistry(services),
    AcidicValidator: services => new AcidicValidator(services)
  },
  lsp: {
    Formatter: () => new AcidicFormatter(),
    CodeActionProvider: services => new AcidicCodeActionProvider(services),
    DefinitionProvider: services => new AcidicDefinitionProvider(services)
  }
};

// this duplicates createDefaultSharedModule except that a custom WorkspaceManager is used
export function createSharedModule(
  context: DefaultSharedModuleContext
): Module<LangiumSharedServices, LangiumDefaultSharedServices> {
  return {
    ServiceRegistry: () => new DefaultServiceRegistry(),
    lsp: {
      Connection: () => context.connection,
      LanguageServer: services => new DefaultLanguageServer(services),
      NodeKindProvider: new DefaultNodeKindProvider(),
      FuzzyMatcher: new DefaultFuzzyMatcher()
    },
    workspace: {
      LangiumDocuments: services => new DefaultLangiumDocuments(services),
      LangiumDocumentFactory: services =>
        new DefaultLangiumDocumentFactory(services),
      DocumentBuilder: services => new DefaultDocumentBuilder(services),
      TextDocuments: _services => new TextDocuments(TextDocument) as any,
      IndexManager: services => new DefaultIndexManager(services),
      WorkspaceManager: services => new AcidicWorkspaceManager(services),
      FileSystemProvider: services => context.fileSystemProvider(services),
      MutexLock: () => new MutexLock(),
      ConfigurationProvider: services =>
        new DefaultConfigurationProvider(services)
    }
  };
}

export function createDefaultModule(
  context: DefaultModuleContext
): Module<LangiumServices, LangiumDefaultServices> {
  return {
    documentation: {
      CommentProvider: services => new DefaultCommentProvider(services),
      DocumentationProvider: services =>
        new JSDocDocumentationProvider(services)
    },
    parser: {
      GrammarConfig: services => createGrammarConfig(services),
      LangiumParser: services => createAcidicParser(services),
      CompletionParser: services => createCompletionParser(services),
      ValueConverter: () => new DefaultValueConverter(),
      TokenBuilder: () => new DefaultTokenBuilder(),
      Lexer: services => new DefaultLexer(services),
      ParserErrorMessageProvider: () => new LangiumParserErrorMessageProvider()
    },
    lsp: {
      CompletionProvider: services => new DefaultCompletionProvider(services),
      DocumentSymbolProvider: services =>
        new DefaultDocumentSymbolProvider(services),
      HoverProvider: services => new MultilineCommentHoverProvider(services),
      FoldingRangeProvider: services =>
        new DefaultFoldingRangeProvider(services),
      ReferencesProvider: services => new DefaultReferencesProvider(services),
      DefinitionProvider: services => new DefaultDefinitionProvider(services),
      DocumentHighlightProvider: services =>
        new DefaultDocumentHighlightProvider(services),
      RenameProvider: services => new DefaultRenameProvider(services)
    },
    workspace: {
      AstNodeLocator: () => new DefaultAstNodeLocator(),
      AstNodeDescriptionProvider: services =>
        new DefaultAstNodeDescriptionProvider(services),
      ReferenceDescriptionProvider: services =>
        new DefaultReferenceDescriptionProvider(services)
    },
    references: {
      Linker: services => new DefaultLinker(services),
      NameProvider: () => new DefaultNameProvider(),
      ScopeProvider: services => new DefaultScopeProvider(services),
      ScopeComputation: services => new DefaultScopeComputation(services),
      References: services => new DefaultReferences(services)
    },
    serializer: {
      JsonSerializer: services => new DefaultJsonSerializer(services)
    },
    validation: {
      DocumentValidator: services => new DefaultDocumentValidator(services),
      ValidationRegistry: services => new ValidationRegistry(services)
    },
    shared: () => context.shared
  };
}

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createAcidicServices(context: DefaultSharedModuleContext): {
  shared: LangiumSharedServices;
  Acidic: AcidicServices;
} {
  const shared = inject(
    createSharedModule(context),
    AcidicGeneratedSharedModule
  );

  const Acidic = inject(
    createDefaultModule({ shared }),
    AcidicGeneratedModule,
    AcidicModule
  );
  shared.ServiceRegistry.register(Acidic);

  // registerValidationChecks(Acidic);
  return { shared, Acidic };
}

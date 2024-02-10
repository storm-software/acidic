import { joinPaths } from "@storm-stack/file-system";
import {
  type Event,
  EventEmitter,
  type ExtensionContext,
  type TreeDataProvider,
  type TreeItem,
  Uri
} from "vscode";
import { SupportTreeItem } from "./support-tree-item";

export class SupportTreeProvider implements TreeDataProvider<SupportTreeItem> {
  #onDidChangeTreeData: EventEmitter<SupportTreeItem | undefined> = new EventEmitter<
    SupportTreeItem | undefined
  >();

  constructor(private readonly context: ExtensionContext) {}

  public readonly onDidChangeTreeData: Event<SupportTreeItem | undefined> =
    this.#onDidChangeTreeData.event;

  public refresh(): void {
    this.#onDidChangeTreeData.fire();
  }

  public getTreeItem(element: SupportTreeItem): TreeItem {
    return element;
  }

  public getParent(_: SupportTreeItem | TreeItem) {
    return null;
  }

  public async getChildren(): Promise<SupportTreeItem[] | null | undefined> {
    return (
      [
        [
          "Website",
          "https://acidic.io",
          Uri.file(joinPaths(this.context.extensionPath, "assets", "vscode", "acidic.svg"))
        ],
        [
          "Documentation",
          "https://acidic.io/docs",
          Uri.file(joinPaths(this.context.extensionPath, "assets", "vscode", "book.svg"))
        ],
        [
          "Learn to use Acidic",
          "https://acidic.io/docs/acidic-workspace",
          {
            light: Uri.file(
              joinPaths(this.context.extensionPath, "assets", "vscode", "graduation.light.svg")
            ),
            dark: Uri.file(
              joinPaths(this.context.extensionPath, "assets", "vscode", "graduation.dark.svg")
            )
          }
        ],
        [
          "Report a Bug",
          "https://stormsoftware.org/issues",
          Uri.file(joinPaths(this.context.extensionPath, "assets", "vscode", "bug.svg"))
        ],
        [
          "Suggest a Feature",
          "https://stormsoftware.org/suggestions/acidic",
          Uri.file(joinPaths(this.context.extensionPath, "assets", "vscode", "lightbulb.svg"))
        ],
        [
          "Storm Software",
          "https://stormsoftware.org",
          Uri.file(joinPaths(this.context.extensionPath, "assets", "vscode", "storm.svg"))
        ]
      ] as const
    ).map(([title, link, icon]) => new SupportTreeItem(title, link, icon));
  }
}

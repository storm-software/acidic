import { joinPaths } from "@storm-stack/file-system";
import {
  Event,
  EventEmitter,
  ExtensionContext,
  TreeDataProvider,
  TreeItem,
  Uri
} from "vscode";
import { SupportTreeItem } from "./support-tree-item";

export class SupportTreeProvider implements TreeDataProvider<SupportTreeItem> {
  private _onDidChangeTreeData: EventEmitter<SupportTreeItem | undefined> =
    new EventEmitter<SupportTreeItem | undefined>();

  constructor(private readonly context: ExtensionContext) {}

  public readonly onDidChangeTreeData: Event<SupportTreeItem | undefined> =
    this._onDidChangeTreeData.event;

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
          {
            light: Uri.file(
              joinPaths(
                this.context.extensionPath,
                "assets",
                "vscode",
                "acidic.svg"
              )
            ),
            dark: Uri.file(
              joinPaths(
                this.context.extensionPath,
                "assets",
                "vscode",
                "acidic.svg"
              )
            )
          }
        ],
        [
          "Documentation",
          "https://acidic.io/docs",
          Uri.file(
            joinPaths(
              this.context.extensionPath,
              "assets",
              "vscode",
              "book.svg"
            )
          )
        ],
        [
          "Learn to use Acidic",
          "https://acidic.io/docs/acidic-workspace",
          {
            light: Uri.file(
              joinPaths(
                this.context.extensionPath,
                "assets",
                "vscode",
                "graduation.light.svg"
              )
            ),
            dark: Uri.file(
              joinPaths(
                this.context.extensionPath,
                "assets",
                "vscode",
                "graduation.dark.svg"
              )
            )
          }
        ],
        [
          "Report a Bug",
          "https://stormsoftware.org/issues",
          Uri.file(
            joinPaths(this.context.extensionPath, "assets", "vscode", "bug.svg")
          )
        ],
        [
          "Suggest a Feature",
          "https://stormsoftware.org/suggestions/acidic",
          Uri.file(
            joinPaths(
              this.context.extensionPath,
              "assets",
              "vscode",
              "lightbulb.svg"
            )
          )
        ],
        [
          "Storm Software",
          "https://stormsoftware.org",
          {
            light: Uri.file(
              joinPaths(
                this.context.extensionPath,
                "assets",
                "vscode",
                "storm.svg"
              )
            ),
            dark: Uri.file(
              joinPaths(
                this.context.extensionPath,
                "assets",
                "vscode",
                "storm.svg"
              )
            )
          }
        ]
      ] as const
    ).map(([title, link, icon]) => new SupportTreeItem(title, link, icon));
  }
}

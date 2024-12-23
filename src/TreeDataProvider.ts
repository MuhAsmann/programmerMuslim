import * as vscode from "vscode";

export class MyTreeDataProvider implements vscode.TreeDataProvider<MyTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<MyTreeItem | undefined | void> = new vscode.EventEmitter<MyTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<MyTreeItem | undefined | void> = this._onDidChangeTreeData.event;

  private data: MyTreeItem[] = [];

  constructor() {}

  refresh(data: MyTreeItem[]): void {
    this.data = data;
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: MyTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: MyTreeItem): Thenable<MyTreeItem[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      return Promise.resolve(this.data);
    }
  }
}

export class MyTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.tooltip = label; // Set tooltip to show full text
  }
}
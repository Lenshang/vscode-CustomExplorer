"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomNode = exports.CustomExplorerProvider = void 0;
const vscode = require("vscode");
class CustomExplorerProvider {
    constructor() {
        var _items = vscode.workspace.getConfiguration().get('custom-explorer.content');
        this.content = [];
        vscode.commands.registerCommand('customexplorer.showInfo', (msg) => this.showMessage(msg));
        if (_items) {
            _items.forEach(item => {
                this.content.push(new CustomNode(item));
            });
        }
    }
    getTreeItem(element) {
        //return element
        if (element.isFolder) {
            return element;
        }
        else if (typeof element.content === "string") {
            return {
                resourceUri: element.resourceUri,
                collapsibleState: vscode.TreeItemCollapsibleState.None,
                label: element.label,
                command: {
                    command: 'customexplorer.showInfo',
                    arguments: [element.content],
                    title: 'Show Infomation'
                }
            };
        }
        else {
            return {
                resourceUri: element.resourceUri,
                collapsibleState: vscode.TreeItemCollapsibleState.None,
                label: element.label,
                command: {
                    command: 'vscode.open',
                    arguments: [element.resourceUri],
                    title: 'Open Resource'
                }
            };
        }
    }
    getChildren(element) {
        if (element) {
            if (element.content instanceof Array) {
                return element.content;
            }
            else {
                return null;
            }
        }
        else {
            return this.content;
        }
    }
    showMessage(message) {
        vscode.window.showInformationMessage(message);
    }
}
exports.CustomExplorerProvider = CustomExplorerProvider;
class CustomNode extends vscode.TreeItem {
    //contentStr:string;
    constructor(data, collapsibleState) {
        if (data.content) {
            if (typeof data.content === "string") {
                super(data.label, vscode.TreeItemCollapsibleState.None);
                this.isFolder = false;
                this.content = data.content;
            }
            else {
                super(data.label, vscode.TreeItemCollapsibleState.Collapsed);
                this.isFolder = true;
                this.content = [];
                data.content.forEach(item => {
                    let _new = new CustomNode(item);
                    this.content.push(_new);
                });
            }
        }
        else {
            let resourceUri = vscode.Uri.file(data.path);
            super(resourceUri, vscode.TreeItemCollapsibleState.None);
            this.isFolder = false;
            this.content = [];
        }
    }
}
exports.CustomNode = CustomNode;
//# sourceMappingURL=CustomExplorerProvider.js.map
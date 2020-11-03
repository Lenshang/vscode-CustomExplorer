"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomNode = exports.CustomExplorerProvider = void 0;
const vscode = require("vscode");
const WebViewHelper_1 = require("./utils/WebViewHelper");
class CustomExplorerProvider {
    constructor(context) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        var _items = vscode.workspace.getConfiguration().get('custom-explorer.content');
        this.content = [];
        vscode.commands.registerCommand('customexplorer.showInfo', (lb, node_type, msg) => this.showMessage(lb, node_type, msg));
        vscode.commands.registerCommand('customexplorer.refresh', () => this.refresh());
        if (vscode.workspace.workspaceFolders) {
            this.workUri = vscode.workspace.workspaceFolders.filter(folder => folder.uri.scheme === 'file')[0];
        }
        if (_items) {
            _items.forEach(item => {
                this.content.push(new CustomNode(item, this.workUri));
            });
        }
        this.context = context;
    }
    refresh() {
        this.content = [];
        var _items = vscode.workspace.getConfiguration().get('custom-explorer.content');
        if (_items) {
            _items.forEach(item => {
                this.content.push(new CustomNode(item, this.workUri));
            });
        }
        this._onDidChangeTreeData.fire();
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
                    arguments: [element.label, element.node_type, element.content],
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
    showMessage(label, node_type, message) {
        if (node_type == "notify") {
            vscode.window.showInformationMessage(message);
        }
        else if (node_type == "script") {
            let func = eval(message);
            let r = func();
            if (typeof r === "string") {
                vscode.window.showInformationMessage(r);
            }
        }
        else if (node_type == "html") {
            let lb = "UnNamedPage";
            if (label) {
                lb = label;
            }
            let view = WebViewHelper_1.createWebViewByHtml(this.context, vscode.ViewColumn.Active, lb, message);
            this.context.subscriptions.push(view);
        }
        else if (node_type == "link") {
            var lb = message;
            if (label) {
                lb = label;
            }
            const webView = WebViewHelper_1.createWebView(this.context, vscode.ViewColumn.Active, lb, message);
            this.context.subscriptions.push(webView);
        }
    }
}
exports.CustomExplorerProvider = CustomExplorerProvider;
class CustomNode extends vscode.TreeItem {
    //contentStr:string;
    constructor(data, workUri, collapsibleState) {
        if (data.node_type == "link") {
            super(data.label, vscode.TreeItemCollapsibleState.None);
            this.isFolder = false;
            this.content = data.content;
            this.node_type = data.node_type;
        }
        else if (data.node_type == "script" || data.node_type == "html") {
            super(data.label, vscode.TreeItemCollapsibleState.None);
            this.isFolder = false;
            this.content = data.content;
            this.node_type = data.node_type;
        }
        else if (data.content) {
            if (typeof data.content === "string") {
                super(data.label, vscode.TreeItemCollapsibleState.None);
                this.isFolder = false;
                this.content = data.content;
                this.node_type = "notify";
            }
            else {
                super(data.label, vscode.TreeItemCollapsibleState.Collapsed);
                this.isFolder = true;
                this.content = [];
                this.node_type = "folder";
                data.content.forEach(item => {
                    let _new = new CustomNode(item, workUri);
                    this.content.push(_new);
                });
            }
        }
        else {
            let resourceUri = null;
            if (workUri) {
                resourceUri = vscode.Uri.joinPath(workUri.uri, data.path);
            }
            else {
                resourceUri = vscode.Uri.file(data.path);
            }
            super(data.label, vscode.TreeItemCollapsibleState.None);
            this.node_type = "file";
            this.resourceUri = resourceUri;
            this.isFolder = false;
            this.content = [];
        }
    }
}
exports.CustomNode = CustomNode;
//# sourceMappingURL=CustomExplorerProvider.js.map
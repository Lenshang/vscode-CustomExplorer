import { AnyARecord } from 'dns';
import * as vscode from 'vscode';
import {createWebView,createWebViewByHtml} from './utils/WebViewHelper';
interface ContentModel{
    label:string;
    path:string;
    content:Array<ContentModel>|string;
    node_type:"notify"|"folder"|"file"|"link"|"script"|"html"|undefined|null;
}
export class CustomExplorerProvider implements vscode.TreeDataProvider<CustomNode>{
    private _onDidChangeTreeData: vscode.EventEmitter<CustomNode | undefined | void> = new vscode.EventEmitter<CustomNode | undefined | void>();
    onDidChangeTreeData?: vscode.Event<void | CustomNode | null | undefined> | undefined = this._onDidChangeTreeData.event;
    content:Array<CustomNode>;
    workUri:vscode.WorkspaceFolder|undefined;
    context:vscode.ExtensionContext;
    constructor(context:vscode.ExtensionContext){
        var _items=vscode.workspace.getConfiguration().get('custom-explorer.content');
        this.content=[]
        vscode.commands.registerCommand('customexplorer.showInfo', (lb,node_type,msg) => this.showMessage(lb,node_type,msg));
        vscode.commands.registerCommand('customexplorer.refresh', () => this.refresh());
        if(vscode.workspace.workspaceFolders){
            this.workUri=vscode.workspace.workspaceFolders.filter(folder => folder.uri.scheme === 'file')[0];
        }
        if(_items){
            (_items as Array<ContentModel>).forEach(item => {
                this.content.push(new CustomNode(item,this.workUri));
            });
        }
        this.context=context;
    }
    refresh(){
        this.content=[]
        var _items=vscode.workspace.getConfiguration().get('custom-explorer.content');
        if(_items){
            (_items as Array<ContentModel>).forEach(item => {
                this.content.push(new CustomNode(item,this.workUri));
            });
        }
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element: CustomNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        //return element
        if(element.isFolder){
            return element;
        }
        else if(typeof element.content === "string"){
            return {
                resourceUri: element.resourceUri,
                collapsibleState: vscode.TreeItemCollapsibleState.None,
                label:element.label,
                command:  {
                    command: 'customexplorer.showInfo',
                    arguments: [element.label,element.node_type,element.content],
                    title: 'Show Infomation'
                }
            };
        }
        else{
            return {
                resourceUri: element.resourceUri,
                collapsibleState: vscode.TreeItemCollapsibleState.None,
                label:element.label,
                command:  {
                    command: 'vscode.open',
                    arguments: [element.resourceUri],
                    title: 'Open Resource'
                }
            };
        }

    }
    getChildren(element?: CustomNode): vscode.ProviderResult<CustomNode[]> {
        if(element){
            if(element.content instanceof Array){
                return element.content as Array<CustomNode>;
            }
            else{
                return null;
            }
        }
        else{
            return this.content;
        }

    }
	private showMessage(label:string|undefined,node_type:string,message: string): void {
        if(node_type=="notify"){
            vscode.window.showInformationMessage(message);
        }
        else if(node_type=="script"){
            let func:any=eval(message);
            let r:any=func();
            if(typeof r==="string"){
                vscode.window.showInformationMessage(r);
            }
        }
        else if(node_type=="html"){
            let lb="UnNamedPage"
            if(label){
                lb=label
            }
            let view=createWebViewByHtml(this.context, vscode.ViewColumn.Active, lb,message);
            this.context.subscriptions.push(view);
        }
		else if(node_type=="link"){
            var lb:string=message;
            if(label){
                lb=label
            }
            const webView = createWebView(this.context, vscode.ViewColumn.Active, lb,message);
            this.context.subscriptions.push(webView);
        }
	}
}

export class CustomNode extends vscode.TreeItem{
    isFolder:boolean;
    content:Array<CustomNode>|string;
    node_type:"notify"|"folder"|"file"|"link"|"script"|"html";
    //contentStr:string;
    constructor(data:ContentModel,workUri:vscode.WorkspaceFolder|undefined, collapsibleState?: vscode.TreeItemCollapsibleState){
        if(data.node_type=="link"){
            super(data.label,vscode.TreeItemCollapsibleState.None);
            this.isFolder=false;
            this.content=data.content as string;
            this.node_type=data.node_type
        }
        else if(data.node_type=="script" || data.node_type=="html"){
            super(data.label,vscode.TreeItemCollapsibleState.None);
            this.isFolder=false;
            this.content=data.content as string;
            this.node_type=data.node_type;
        }
        else if(data.content){
            if(typeof data.content === "string"){
                super(data.label,vscode.TreeItemCollapsibleState.None);
                this.isFolder=false;
                this.content=data.content;
                this.node_type="notify"
            }
            else{
                super(data.label,vscode.TreeItemCollapsibleState.Collapsed);
                this.isFolder=true;
                this.content=[];
                this.node_type="folder"
                data.content.forEach(item => {
                    let _new=new CustomNode(item,workUri);
                    (this.content as Array<CustomNode>).push(_new);
                });
            }

        }
        else{
            let resourceUri=null;
            if(workUri){
                resourceUri=vscode.Uri.joinPath(workUri.uri,data.path);
            }
            else{
                resourceUri=vscode.Uri.file(data.path);
            }
            super(data.label,vscode.TreeItemCollapsibleState.None);
            this.node_type="file"
            this.resourceUri=resourceUri;
            this.isFolder=false;
            this.content=[];
        }
        
    }
}
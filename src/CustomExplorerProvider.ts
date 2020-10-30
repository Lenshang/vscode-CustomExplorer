import * as vscode from 'vscode';
interface ContentModel{
    label:string;
    path:string;
    content:Array<ContentModel>|string;
}
export class CustomExplorerProvider implements vscode.TreeDataProvider<CustomNode>{
    onDidChangeTreeData?: vscode.Event<void | CustomNode | null | undefined> | undefined;
    content:Array<CustomNode>;
    constructor(){
        var _items=vscode.workspace.getConfiguration().get('custom-explorer.content');
        this.content=[]
        vscode.commands.registerCommand('customexplorer.showInfo', (msg) => this.showMessage(msg));
        if(_items){
            (_items as Array<ContentModel>).forEach(item => {
                this.content.push(new CustomNode(item));
            });
        }
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
                    arguments: [element.content],
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
	private showMessage(message: string): void {
		vscode.window.showInformationMessage(message);
	}
}

export class CustomNode extends vscode.TreeItem{
    isFolder:boolean;
    content:Array<CustomNode>|string;
    //contentStr:string;
    constructor(data:ContentModel, collapsibleState?: vscode.TreeItemCollapsibleState){
        if(data.content){
            if(typeof data.content === "string"){
                super(data.label,vscode.TreeItemCollapsibleState.None);
                this.isFolder=false;
                this.content=data.content;
            }
            else{
                super(data.label,vscode.TreeItemCollapsibleState.Collapsed);
                this.isFolder=true;
                this.content=[];
                data.content.forEach(item => {
                    let _new=new CustomNode(item);
                    (this.content as Array<CustomNode>).push(_new);
                });
            }

        }
        else{
            let resourceUri=vscode.Uri.file(data.path);
            super(resourceUri,vscode.TreeItemCollapsibleState.None);
            this.isFolder=false;
            this.content=[];
        }
        
    }
}
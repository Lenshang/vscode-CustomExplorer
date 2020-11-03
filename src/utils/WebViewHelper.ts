import { ExtensionContext, ViewColumn, WebviewPanel, window, commands } from 'vscode';

let webviewPanel: WebviewPanel | undefined;

export function createWebView(
    context: ExtensionContext,
    viewColumn: ViewColumn,
    label: string,
    url: string
) {

    if (webviewPanel === undefined) {

        webviewPanel = window.createWebviewPanel(

            'webView',                          // 标识，随意命名
            label,                              // 面板标题
            viewColumn,                         // 展示在哪个面板上
            {
                retainContextWhenHidden: true,  // 控制是否保持webview面板的内容（iframe），即使面板不再可见。
                enableScripts: true             // 下面的 html 页可以使用 Scripts
            }

        )

        webviewPanel.webview.html = getIframeHtml(url);

    } else {
        webviewPanel.title = label;
        webviewPanel.reveal();
    }

    webviewPanel.onDidDispose(() => {
        webviewPanel = undefined;
    });

    return webviewPanel;
}
export function createWebViewByHtml(
    context: ExtensionContext,
    viewColumn: ViewColumn,
    label: string,
    html: string) {
    if (webviewPanel === undefined) {
        webviewPanel = window.createWebviewPanel(
            'webView',                          // 标识，随意命名
            label,                              // 面板标题
            viewColumn,                         // 展示在哪个面板上
            {
                retainContextWhenHidden: true,  // 控制是否保持webview面板的内容（iframe），即使面板不再可见。
                enableScripts: true             // 下面的 html 页可以使用 Scripts
            }
        )
        webviewPanel.webview.html = html;
    } else {
        webviewPanel.title = label;
        webviewPanel.reveal();
    }
    webviewPanel.onDidDispose(() => {
        webviewPanel = undefined;
    });
    return webviewPanel;
}

export function getIframeHtml(url: string) {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
            html,
            body {
                margin: 0 !important;
                padding: 0 !important;
                width: 100%;
                height: 100%;
            }
            .iframeDiv {
                width: 100%;
                height: 100%;
            }
        </style>
        </head>

        <body>
        <iframe id='iframe1' class="iframeDiv" src="${url}" scrolling="auto"></iframe>
        </body>
    </html>
    `;
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIframeHtml = exports.createWebViewByHtml = exports.createWebView = void 0;
const vscode_1 = require("vscode");
let webviewPanel;
function createWebView(context, viewColumn, label, url) {
    if (webviewPanel === undefined) {
        webviewPanel = vscode_1.window.createWebviewPanel('webView', // 标识，随意命名
        label, // 面板标题
        viewColumn, // 展示在哪个面板上
        {
            retainContextWhenHidden: true,
            enableScripts: true // 下面的 html 页可以使用 Scripts
        });
        webviewPanel.webview.html = getIframeHtml(url);
    }
    else {
        webviewPanel.title = label;
        webviewPanel.reveal();
    }
    webviewPanel.onDidDispose(() => {
        webviewPanel = undefined;
    });
    return webviewPanel;
}
exports.createWebView = createWebView;
function createWebViewByHtml(context, viewColumn, label, html) {
    if (webviewPanel === undefined) {
        webviewPanel = vscode_1.window.createWebviewPanel('webView', // 标识，随意命名
        label, // 面板标题
        viewColumn, // 展示在哪个面板上
        {
            retainContextWhenHidden: true,
            enableScripts: true // 下面的 html 页可以使用 Scripts
        });
        webviewPanel.webview.html = html;
    }
    else {
        webviewPanel.title = label;
        webviewPanel.reveal();
    }
    webviewPanel.onDidDispose(() => {
        webviewPanel = undefined;
    });
    return webviewPanel;
}
exports.createWebViewByHtml = createWebViewByHtml;
function getIframeHtml(url) {
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
exports.getIframeHtml = getIframeHtml;
//# sourceMappingURL=WebViewHelper.js.map
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

interface WebviewMessage {
  command: string;
  data?: unknown;
}

class MyToolsViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private _context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this._context = context;
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        this._context.extensionUri,
        vscode.Uri.joinPath(this._context.extensionUri, "dist", "webview"),
      ],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(
      (message: WebviewMessage) => this._handleMessage(message),
      undefined,
      this._context.subscriptions
    );

    webviewView.onDidDispose(() => {
      this._view = undefined;
    }, null, this._context.subscriptions);
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const webviewDistPath = vscode.Uri.joinPath(this._context.extensionUri, "dist", "webview");
    
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewDistPath, "index.js"));
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewDistPath, "index.css"));
    const codiconCssUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewDistPath, "codicon.css"));

    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; font-src ${webview.cspSource};">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${codiconCssUri}" rel="stylesheet">
    <link href="${styleUri}" rel="stylesheet">
    <title>QTest Webview</title>
</head>
<body>
    <div id="root"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }

  private _handleMessage(message: WebviewMessage) {
    switch (message.command) {
      case "ready":
        this._sendToWebview({ command: "init", data: { framework: "react" } });
        vscode.window.showInformationMessage("Webview connected!");
        break;

      case "frameworkSelected":
        vscode.window.showInformationMessage(`Framework selected: ${message.data}`);
        break;

      case "debugAction":
        this._handleDebugAction(message.data as string);
        break;

      case "download":
        this._handleDownload(message.data as { framework?: string });
        break;

      case "clearMessages":
        console.log("Messages cleared from webview");
        break;

      default:
        console.log("Unknown message:", message);
    }
  }

  private _handleDebugAction(action: string) {
    const commands: Record<string, string> = {
      continue: "workbench.action.debug.continue",
      stepOver: "workbench.action.debug.stepOver",
      stepInto: "workbench.action.debug.stepInto",
      stepOut: "workbench.action.debug.stepOut",
      stop: "workbench.action.debug.stop",
    };

    const command = commands[action];
    if (command) {
      vscode.commands.executeCommand(command);
      vscode.window.showInformationMessage(`Debug action: ${action}`);
    }
  }

  private _handleDownload(data: { framework?: string }) {
    const framework = data.framework || "unknown";
    vscode.window.showInformationMessage(`Download requested for ${framework}`);
    
    this._sendToWebview({ 
      command: "downloadComplete", 
      data: { framework, timestamp: new Date().toISOString() } 
    });
  }

  private _sendToWebview(message: WebviewMessage) {
    this._view?.webview.postMessage(message);
  }

  public sendMessageToWebview(message: WebviewMessage) {
    this._sendToWebview(message);
  }
}

export function activate(context: vscode.ExtensionContext) {
  const provider = new MyToolsViewProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("myToolsView", provider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("myext.sendToWebview", () => {
      provider.sendMessageToWebview({ 
        command: "updateFramework", 
        data: "vue" 
      });
      vscode.window.showInformationMessage("Sent 'updateFramework: vue' to webview");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("myext.run", () => {
      vscode.window.showInformationMessage("Run clicked");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("myext.debug", () => {
      vscode.window.showInformationMessage("debug!!!");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("myext.download", async () => {
      provider.sendMessageToWebview({ command: "download", data: {} });
      vscode.window.showInformationMessage("Download command sent to webview");
    })
  );
}

export function deactivate() {}

function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
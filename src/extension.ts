import * as vscode from "vscode";

class MyToolsViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly context: vscode.ExtensionContext) {
    this.m_context = context;
  }
  m_context: vscode.ExtensionContext;

  resolveWebviewView(view: vscode.WebviewView) {
    const webview = view.webview;
    webview.options = { enableScripts: true };

    webview.html = this.getHtml(webview);

    webview.onDidReceiveMessage(async (msg) => {
      switch (msg.command) {
        case "continue":
          // vscode.commands.executeCommand('workbench.action.debug.continue');
          break;
        case "stepOver":
          // vscode.commands.executeCommand('workbench.action.debug.stepOver');
          break;
        case "stepInto":
          // vscode.commands.executeCommand('workbench.action.debug.stepInto');
          break;
        case "stepOut":
          // vscode.commands.executeCommand('workbench.action.debug.stepOut');
          break;
        case "stop":
          // vscode.commands.executeCommand('workbench.action.debug.stop');
          break;
      }

      vscode.window.showInformationMessage(`${msg.command} clicked`);
    });
  }

  getHtml(webview: vscode.Webview) {
    const extensionUri = this.m_context.extensionUri;

    const codiconsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        extensionUri,
        "node_modules",
        "@vscode/codicons",
        "dist",
        "codicon.css",
      ),
    );

    return `
     <html>
       <head>
         <link href="${codiconsUri}" rel="stylesheet"/>
       </head>
       <body>
         <div class="toolbar-container">
          <div class="debug-toolbar">
             <button onclick="send('continue')"><i class="codicon codicon-debug-continue"></i></button>
             <button onclick="send('stepOver')" class="icon-btn"><i class="codicon codicon-debug-step-over"></i></button>
             <button onclick="send('stepInto')" class="icon-btn"><i class="codicon codicon-debug-step-into"></i></button>
             <button onclick="send('stepOut')" class="icon-btn"><i class="codicon codicon-debug-step-out"></i></button>
             <button onclick="send('stop')" class="icon-btn"><i class="codicon codicon-debug-stop"></i></button>
          </div>
         </div>

         <style>
           .toolbar-container {
             display: flex;
             justify-content: center;
             align-items: center;
             padding: 12px;
           }
           .debug-toolbar {
             display: flex;
             gap: 4px;
             padding: 8px;
             background: var(--vscode-editor-background);
             border-bottom: 1px solid var(--vscode-panel-border);
           }
           .debug-toolbar button {
             width: 32px;
             height: 32px;
             font-size: 16px;
             border: none;
             border-radius: 4px;
             background: var(--vscode-button-secondaryBackground);
             color: var(--vscode-foreground);
             cursor: pointer;
           }
           .debug-toolbar button:hover {
             background: var(--vscode-button-hoverBackground);
           }
         </style>

         <script>
           const vscode = acquireVsCodeApi();
           function send(cmd) {
             vscode.postMessage({ command: cmd });
           }
         </script>
      </body>
      </html>`;
  }
}

export function activate(context: vscode.ExtensionContext) {
  vscode.window.registerWebviewViewProvider(
    "myToolsView",
    new MyToolsViewProvider(context),
  );

  vscode.commands.registerCommand("myext.run", () => {
    vscode.window.showInformationMessage("Run clicked");
  });

  vscode.commands.registerCommand("myext.debug", () => {
    vscode.window.showInformationMessage("debug!!!");
  });

  vscode.commands.registerCommand("myext.download", async () => {
    vscode.window.showInformationMessage("Download clicked");
  });
}

export function deactivate() {}

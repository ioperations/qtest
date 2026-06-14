import * as vscode from "vscode";

class MyToolsViewProvider implements vscode.WebviewViewProvider {
  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly id: number,
  ) {
    this.m_context = context;
    this.m_id = id;
  }
  m_context: vscode.ExtensionContext;
  m_id: number;

  resolveWebviewView(view: vscode.WebviewView) {
    const webview = view.webview;
    webview.options = { enableScripts: true };

    if (this.m_id === 1) {
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
    } else {
      webview.html = this.getHtml2(webview);
      let value = "";

      webview.onDidReceiveMessage(async (msg) => {
        switch (msg.command) {
          case "alertSelection":
            // vscode.commands.executeCommand('workbench.action.debug.continue');
            value = msg.value;
            break;
          case "download":
            // vscode.commands.executeCommand('workbench.action.debug.stop');
            break;
        }

        vscode.window.showInformationMessage(`${msg.command} clicked, value ${value}`);
      });
    }
  }

  getHtml2(webview: vscode.Webview) {
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
             <select id="framework-select" name="frameworks">
               <option value=""> - Please choose an option - </option>
               <option value="react">React</option>
               <option value="vue">Vue.js</option>
               <option value="angular">Angular</option>
             </select>
             <span style="width: 12px"></span>
             <button onclick="send('download')"><i class="codicon codicon-download"></i></button>
          </div>
         </div>
         <style>
         select {
           background-color: var(--vscode-dropdown-background);
           color: var(--vscode-dropdown-foreground);
           border: 1px solid var(--vscode-dropdown-border);
           padding: 4px 8px;
           border-radius: 2px;
         }
         .toolbar-container {
            align-items: center;
         }
         .debug-toolbar {
           display: flex;
           justify-content: center;
           align-items: center;
           padding: 12px;
         }
         </style>
         <script>
             const vscode = acquireVsCodeApi();
             const dropdown = document.getElementById('framework-select');

             dropdown.addEventListener('change', (event) => {
               // Send message to extension backend
               vscode.postMessage({
                 command: 'alertSelection',
                 value: event.target.value
               });
             });

             function send(cmd) {
              vscode.postMessage({ command: cmd });
             }
         </script>
       </body>
      </html> `;
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
           }
           .debug-toolbar {
             display: flex;
             gap: 4px;
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
    new MyToolsViewProvider(context, 1),
  );
  vscode.window.registerWebviewViewProvider(
    "myToolsView2",
    new MyToolsViewProvider(context, 2),
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

import * as vscode from "vscode";

class MyToolsViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

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
    const nonce = String(Date.now());

    return `
    <div class="toolbar-container">

    <div class="debug-toolbar">
  <button onclick="send('continue')">▶ </button>
  <button onclick="send('stepOver')">↷ </button>
  <button onclick="send('stepInto')">↓ </button>
  <button onclick="send('stepOut')">↑ </button>
  <button onclick="send('stop')">■ </button>
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
`;
    return `
      <html>
      <body>
        <div class="toolbar">
          <button class="btn" data-action="run">
            <span class="codicon codicon-play"></span>
          </button>
          <button class="btn" data-action="debug">
            <span class="codicon codicon-debug-alt"></span>
          </button>
          <button class="btn" data-action="download">
            <span class="codicon codicon-cloud-download"></span>
          </button>
        </div>

        <script nonce="${nonce}">
          const vscode = acquireVsCodeApi();
          document.querySelectorAll(".btn").forEach(btn => {
            btn.addEventListener("click", () => {
              vscode.postMessage({ action: btn.dataset.action });
            });
          });
        </script>

        <style>

            padding: 0;
            margin: 0;
            background: var(--vscode-sideBar-background);
            color: var(--vscode-foreground);
            font-family: var(--vscode-font-family);
          }

          .toolbar {
  			display: flex;
  			flex-direction: row;
  			align-items: center;
            gap: 6px;
            padding: 8px;
            background: var(--vscode-editor-background);
            border-bottom: 1px solid var(--vscode-panel-border);
          }

          .btn {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            border: 1px solid transparent;
            background: var(--vscode-button-secondaryBackground);
            cursor: pointer;
          }

          .btn:hover {
            background: var(--vscode-button-hoverBackground);
            border-color: var(--vscode-focusBorder);
          }

          .btn:active {
            background: var(--vscode-button-background);
          }

          .codicon {
            font-size: 16px;
            color: var(--vscode-foreground);
          }
        </style>
      </body>
      </html>
    `;
  }
}

export function activate(context: vscode.ExtensionContext) {
  vscode.window.registerWebviewViewProvider(
    "myToolsView",
    new MyToolsViewProvider(context),
  );
  // console.log('Congratulations, your extension "qtest" is now active!');
  // 1. Register backend functionality for your individual actions
  vscode.commands.registerCommand("myext.run", () => {
    vscode.window.showInformationMessage("Run clicked");
  });

  vscode.commands.registerCommand("myext.debug", () => {
    // vscode.debug.startDebugging(undefined, {
    //   type: "node",
    //   request: "launch",
    //   program: "${file}"
    // });
    vscode.window.showInformationMessage("debug!!!");
  });

  vscode.commands.registerCommand("myext.download", async () => {
    vscode.window.showInformationMessage("Download clicked");
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}

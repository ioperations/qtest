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

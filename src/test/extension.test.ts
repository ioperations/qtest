import * as assert from "assert";
import * as vscode from "vscode";
import { MyToolsViewProvider, activate } from "../extension";

suite("Extension", () => {
  const createMockContext = (): vscode.ExtensionContext =>
    ({
      subscriptions: [],
      extensionUri: vscode.Uri.file("/test"),
      extensionMode: vscode.ExtensionMode.Test,
      extension: {} as vscode.Extension<unknown>,
      secrets: {} as vscode.SecretStorage,
      environmentVariableCollection:
        {} as vscode.EnvironmentVariableCollection,
      globalState: {} as vscode.Memento,
      workspaceState: {} as vscode.Memento,
      globalStorageUri: vscode.Uri.file("/global"),
      logUri: vscode.Uri.file("/log"),
      asAbsolutePath: (p: string) => p,
    }) as unknown as vscode.ExtensionContext;

  suite("activate", () => {
    test("adds subscriptions to context", () => {
      const context = createMockContext();
      activate(context);
      assert.ok(context.subscriptions.length > 0);
    });

    test("registers webview view provider", () => {
      const context = createMockContext();
      activate(context);
      const provider = context.subscriptions.find(
        (s) =>
          typeof s === "object" &&
          "dispose" in (s as object) &&
          (s as { dispose: () => void }).dispose !== undefined,
      );
      assert.ok(provider, "expected at least one disposable subscription");
    });
  });

  suite("MyToolsViewProvider", () => {
    test("constructor creates provider with context", () => {
      const context = createMockContext();
      const provider = new MyToolsViewProvider(context);
      assert.ok(provider);
    });

    test("sendMessageToWebview does not throw when no view", () => {
      const context = createMockContext();
      const provider = new MyToolsViewProvider(context);
      provider.sendMessageToWebview({ command: "test", data: {} });
    });
  });
});

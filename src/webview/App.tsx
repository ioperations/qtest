import React, { useState, useEffect, useCallback } from "react";
import { Toolbar } from "./components/Toolbar";
import { MessagePanel } from "./components/MessagePanel";

interface ExtensionMessage {
  command: string;
  data?: unknown;
}

interface VsCodeApi {
  postMessage: (message: unknown) => void;
  getState: () => unknown;
  setState: (state: unknown) => void;
}

declare global {
  interface Window {
    acquireVsCodeApi: () => VsCodeApi;
  }
}

function useVsCodeApi(): VsCodeApi {
  return React.useMemo(() => {
    if (typeof window !== "undefined" && window.acquireVsCodeApi) {
      return window.acquireVsCodeApi();
    }
    return {
      postMessage: (message: unknown) => console.log("[Mock VS Code] postMessage:", message),
      getState: () => ({}),
      setState: (state: unknown) => console.log("[Mock VS Code] setState:", state),
    };
  }, []);
}

const App: React.FC = () => {
  const vscode = useVsCodeApi();
  const [messages, setMessages] = useState<string[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);

  const addMessage = useCallback((msg: string) => {
    setMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  const sendMessage = useCallback((command: string, data?: unknown) => {
    vscode.postMessage({ command, data });
    addMessage(`Sent: ${command}${data ? ` (${JSON.stringify(data)})` : ""}`);
  }, [vscode, addMessage]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data as ExtensionMessage;
      if (message) {
        addMessage(`Received: ${message.command}${message.data ? ` (${JSON.stringify(message.data)})` : ""}`);

        switch (message.command) {
          case "init":
            setIsConnected(true);
            if (message.data) {
              const initData = message.data as { framework?: string };
              if (initData.framework) {
                setSelectedFramework(initData.framework);
              }
            }
            break;
          case "updateFramework":
            if (message.data) {
              setSelectedFramework(message.data as string);
            }
            break;
          case "downloadComplete":
            break;
          case "clearMessages":
            setMessages([]);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("message", handleMessage);
    sendMessage("ready");

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [sendMessage, addMessage]);

  const handleFrameworkChange = (framework: string) => {
    setSelectedFramework(framework);
    sendMessage("frameworkSelected", framework);
  };

  const handleDebugAction = (action: string) => {
    sendMessage("debugAction", action);
  };

  const handleDownload = () => {
    sendMessage("download", { framework: selectedFramework });
  };

  const handleClear = () => {
    setMessages([]);
    sendMessage("clearMessages");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>QTest React Webview</h1>
        <div className="connection-status">
          <span className={isConnected ? "connected" : "disconnected"} />
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </header>

      <Toolbar
        selectedFramework={selectedFramework}
        onFrameworkChange={handleFrameworkChange}
        onDebugAction={handleDebugAction}
        onDownload={handleDownload}
        isConnected={isConnected}
      />

      <main className="app-main">
        <MessagePanel messages={messages} onClear={handleClear} />
      </main>
    </div>
  );
};

export default App;
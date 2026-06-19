import assert from "assert";
import React from "react";
import { render, screen, act } from "@testing-library/react";
import App from "../../webview/App";

describe("App", () => {
  let postMessageLog: unknown[];

  beforeEach(() => {
    postMessageLog = [];
    window.acquireVsCodeApi = () => ({
      postMessage: (msg: unknown) => {
        postMessageLog.push(msg);
      },
      getState: () => ({}),
      setState: () => {},
    });
  });

  it("renders the app header", () => {
    render(<App />);
    assert.ok(screen.getByText("QTest React Webview"));
  });

  it("shows disconnected status initially", () => {
    render(<App />);
    assert.ok(screen.getByText("Disconnected"));
  });

  it("sends ready message on mount", () => {
    render(<App />);
    const readyMsg = postMessageLog.find(
      (m: unknown) => (m as { command: string }).command === "ready",
    );
    assert.ok(readyMsg, "Expected ready message to be sent");
  });

  it("shows connected status after receiving init message", () => {
    render(<App />);
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { command: "init", data: { framework: "react" } },
        }),
      );
    });
    assert.ok(screen.getByText("Connected"));
  });

  it("renders Toolbar with framework selector", () => {
    render(<App />);
    assert.ok(screen.getByLabelText("Select Framework"));
  });

  it("adds received messages to the panel", () => {
    render(<App />);
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { command: "test", data: "hello" },
        }),
      );
    });
    assert.ok(screen.getByText(/hello/));
  });
});

import assert from "assert";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MessagePanel } from "../../webview/components/MessagePanel";

describe("MessagePanel", () => {
  it("renders empty state when no messages", () => {
    render(<MessagePanel messages={[]} onClear={() => {}} />);
    assert.ok(screen.getByText("No messages yet. Actions will appear here."));
  });

  it("renders a list of messages", () => {
    render(<MessagePanel messages={["[10:00:00] Hello"]} onClear={() => {}} />);
    assert.ok(screen.getByText(/Hello/));
  });

  it("calls onClear when clear button is clicked", () => {
    let cleared = false;
    render(
      <MessagePanel
        messages={["[10:00:00] Test"]}
        onClear={() => {
          cleared = true;
        }}
      />,
    );
    fireEvent.click(screen.getByText("Clear"));
    assert.strictEqual(cleared, true);
  });
});

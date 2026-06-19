import assert from "assert";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Toolbar } from "../../webview/components/Toolbar";

describe("Toolbar", () => {
  const defaultProps = {
    selectedFramework: "",
    onFrameworkChange: () => {},
    onDebugAction: () => {},
    onDownload: () => {},
    isConnected: true,
  };

  it("renders framework selector", () => {
    render(<Toolbar {...defaultProps} />);
    assert.ok(screen.getByLabelText("Select Framework"));
  });

  it("disables controls when not connected", () => {
    render(<Toolbar {...defaultProps} isConnected={false} />);
    const select = screen.getByLabelText("Select Framework") as HTMLSelectElement;
    assert.strictEqual(select.disabled, true);
  });

  it("enables controls when connected", () => {
    render(<Toolbar {...defaultProps} isConnected={true} />);
    const select = screen.getByLabelText("Select Framework") as HTMLSelectElement;
    assert.strictEqual(select.disabled, false);
  });

  it("calls onFrameworkChange on select change", () => {
    let selected = "";
    render(
      <Toolbar
        {...defaultProps}
        onFrameworkChange={(fw: string) => {
          selected = fw;
        }}
      />,
    );
    fireEvent.change(screen.getByLabelText("Select Framework"), {
      target: { value: "react" },
    });
    assert.strictEqual(selected, "react");
  });

  it("calls onDebugAction when debug button clicked", () => {
    let action = "";
    render(
      <Toolbar
        {...defaultProps}
        onDebugAction={(a: string) => {
          action = a;
        }}
      />,
    );
    fireEvent.click(screen.getByTitle("Step Over"));
    assert.strictEqual(action, "stepOver");
  });

  it("disables download button when no framework selected", () => {
    render(<Toolbar {...defaultProps} selectedFramework="" />);
    const btn = screen.getByText("Download") as HTMLButtonElement;
    assert.strictEqual(btn.disabled, true);
  });

  it("enables download button when framework selected and connected", () => {
    render(<Toolbar {...defaultProps} selectedFramework="react" />);
    const btn = screen.getByText("Download") as HTMLButtonElement;
    assert.strictEqual(btn.disabled, false);
  });

  it("calls onDownload when download button clicked", () => {
    let downloaded = false;
    render(
      <Toolbar
        {...defaultProps}
        selectedFramework="react"
        onDownload={() => {
          downloaded = true;
        }}
      />,
    );
    fireEvent.click(screen.getByText("Download"));
    assert.strictEqual(downloaded, true);
  });
});

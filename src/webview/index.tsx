import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "@vscode/codicons/dist/codicon.css";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
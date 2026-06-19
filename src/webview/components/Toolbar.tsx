import React from "react";

interface ToolbarProps {
  selectedFramework: string;
  onFrameworkChange: (framework: string) => void;
  onDebugAction: (action: string) => void;
  onDownload: () => void;
  isConnected: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedFramework,
  onFrameworkChange,
  onDebugAction,
  onDownload,
  isConnected,
}) => {
  const frameworks = [
    { value: "", label: " - Please choose an option - " },
    { value: "react", label: "React" },
    { value: "vue", label: "Vue.js" },
    { value: "angular", label: "Angular" },
  ];

  const debugActions = [
    { id: "continue", label: "Continue", icon: "▶" },
    { id: "stepOver", label: "Step Over", icon: "⏭" },
    { id: "stepInto", label: "Step Into", icon: "⏬" },
    { id: "stepOut", label: "Step Out", icon: "⏫" },
    { id: "stop", label: "Stop", icon: "■" },
  ];

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <label htmlFor="framework-select" className="visually-hidden">
          Select Framework
        </label>
        <select
          id="framework-select"
          value={selectedFramework}
          onChange={(e) => onFrameworkChange(e.target.value)}
          disabled={!isConnected}
          className="framework-select"
        >
          {frameworks.map((fw) => (
            <option key={fw.value} value={fw.value}>
              {fw.label}
            </option>
          ))}
        </select>
      </div>

      <div className="toolbar-section debug-actions">
        {debugActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onDebugAction(action.id)}
            disabled={!isConnected}
            className="debug-btn"
            title={action.label}
          >
            {action.icon}
          </button>
        ))}
      </div>

      <div className="toolbar-section">
        <button
          onClick={onDownload}
          disabled={!isConnected || !selectedFramework}
          className="download-btn"
        >
          Download
        </button>
      </div>
    </div>
  );
};
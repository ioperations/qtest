import React from "react";

interface MessagePanelProps {
  messages: string[];
  onClear: () => void;
}

export const MessagePanel: React.FC<MessagePanelProps> = ({
  messages,
  onClear,
}) => {
  return (
    <div className="message-panel">
      <div className="message-panel-header">
        <h2>Messages</h2>
        <button onClick={onClear} className="clear-btn">
          Clear
        </button>
      </div>
      <div className="message-list">
        {messages.length === 0 ? (
          <div className="no-messages">
            No messages yet. Actions will appear here.
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="message-item">
              <span className="message-time">{msg.split("]")[0]}]</span>
              <span className="message-text">{msg.split("]")[1]}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

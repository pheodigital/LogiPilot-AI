"use client";

import { useChat } from "@ai-sdk/react";

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat();
  const isBusy = status === "submitted" || status === "streaming";

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 24,
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>
        LogiPilot AI — Freight Ops Copilot
      </h1>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              style={{
                alignSelf: isUser ? "flex-end" : "flex-start",
                maxWidth: "75%",
                background: isUser ? "#2563eb" : "#f1f5f9",
                color: isUser ? "#fff" : "#111",
                padding: "8px 12px",
                borderRadius: 12,
                whiteSpace: "pre-wrap",
              }}
            >
              {message.parts.map((part, i) =>
                part.type === "text" ? <span key={i}>{part.text}</span> : null,
              )}
            </div>
          );
        })}

        {isBusy && (
          <div
            style={{
              alignSelf: "flex-start",
              color: "#888",
              fontStyle: "italic",
              padding: "8px 12px",
            }}
          >
            Copilot is thinking...
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem(
            "message",
          ) as HTMLInputElement;
          if (input.value.trim() && !isBusy) {
            sendMessage({ text: input.value });
            input.value = "";
          }
        }}
        style={{ display: "flex", gap: 8 }}
      >
        <input
          name="message"
          placeholder="Ask about freight orders..."
          disabled={isBusy}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          disabled={isBusy}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            cursor: isBusy ? "not-allowed" : "pointer",
          }}
        >
          {isBusy ? "Sending..." : "Send"}
        </button>
      </form>

      <div
        style={{
          margin: "20px auto",
          padding: 25,
          border: "1px solid #ccc",
        }}
      >
        <p>Examples prompts as follows</p>
        <ul>
          <li>
            <p>Show me all delayed shipments to Germany this week</p>
          </li>
          <li>
            <p>What is the status of freight order 4500001234?</p>
          </li>
          <li>
            <p>Which carrier has the most late deliveries this month?</p>
          </li>
          <li>
            <p>Summarize shipment costs by carrier for Q3</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

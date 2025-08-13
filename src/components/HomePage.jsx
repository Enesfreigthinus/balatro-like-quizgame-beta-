import React from "react";

export default function HomePage({ onStart }) {
  return (
    <div
      className="container"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="card"
        style={{ maxWidth: 500, padding: 32, textAlign: "center" }}
      >
        <div className="h1" style={{ marginBottom: 16 }}>
          Başarılar
        </div>
        <div style={{ marginBottom: 20, color: "#555" }}>
          <b>How to Play:</b>
          <ul style={{ textAlign: "left", margin: "16px auto", maxWidth: 400 }}>
            <li>Answer quiz questions to earn points and coins.</li>
            <li>
              Use <b>Joker Cards</b> for special effects (50/50, Extra Time,
              Hint, etc).
            </li>
            <li>
              Buy new cards from the shop between questions to build your deck.
            </li>
            <li>
              Every 5th question is a <b>Boss Round</b> with special rules.
            </li>
            <li>Try to build a high score streak and maximize your coins!</li>
          </ul>
        </div>
        <button
          className="button"
          style={{ fontSize: 20, padding: "12px 32px" }}
          onClick={onStart}
        >
          Start Game
        </button>
        <div style={{ marginTop: 24, fontSize: 13, color: "#888" }}>
          Inspired by Balatro. No data is sent to any server.
        </div>
      </div>
    </div>
  );
}

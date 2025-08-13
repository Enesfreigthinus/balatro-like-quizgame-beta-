import React from "react";

export default function Hand({ deck, onPlay, disabled }) {
  return (
    <div className="card">
      <div className="small" style={{ marginBottom: 8 }}>
        Hand
      </div>
      <div className="grid">
        {deck.map((c, idx) => (
          <button
            key={idx}
            className={`button ${disabled ? "disabled" : ""}`}
            onClick={() => onPlay(c)}
            disabled={disabled}
          >
            <div style={{ fontWeight: 700 }}>{c.name}</div>
            <div className="small">{c.description}</div>
            <div className="tag">{c.rarity}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

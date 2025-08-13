import React from "react";

export default function Store({ shop, coins, onBuy, onReroll }) {
  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="h1">Shop</div>
        <button className="button" onClick={onReroll}>
          Reroll (20)
        </button>
      </div>
      <div className="grid" style={{ marginTop: 12 }}>
        {shop.map((c, i) => (
          <button
            key={i}
            className={`button ${coins < c.cost ? "disabled" : ""}`}
            onClick={() => onBuy(c)}
            disabled={coins < c.cost}
          >
            <div style={{ fontWeight: 700 }}>{c.name}</div>
            <div className="small">{c.description}</div>
            <div className="tag">{c.rarity}</div>
            <div className="tag">Cost: {c.cost}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

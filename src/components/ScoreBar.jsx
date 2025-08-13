import React from "react";

export default function ScoreBar({ score, coins, chain, questionNumber }) {
  return (
    <div
      className="card"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div className="small">Question</div>
        <div className="h1">{questionNumber}</div>
      </div>
      <div>
        <div className="small">Score</div>
        <div className="h1">{score}</div>
      </div>
      <div>
        <div className="small">Coins</div>
        <div className="h1">{coins}</div>
      </div>
      <div>
        <div className="small">Streak</div>
        <div className="h1">{chain}</div>
      </div>
    </div>
  );
}

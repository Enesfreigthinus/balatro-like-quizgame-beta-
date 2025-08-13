import React, { useEffect, useState } from "react";

export default function ScoreBar({
  score,
  coins,
  chain,
  questionNumber,
  scoreDelta,
}) {
  const [showDelta, setShowDelta] = useState(false);
  const [displayDelta, setDisplayDelta] = useState(0);

  useEffect(() => {
    if (scoreDelta !== 0) {
      setDisplayDelta(scoreDelta);
      setShowDelta(true);
      const timeout = setTimeout(() => setShowDelta(false), 1200);
      return () => clearTimeout(timeout);
    }
  }, [scoreDelta]);

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
      <div style={{ position: "relative", minWidth: 90 }}>
        <div className="small">Score</div>
        <div className="h1" style={{ display: "flex", alignItems: "center" }}>
          {score}
          {showDelta && displayDelta !== 0 && (
            <span
              style={{
                marginLeft: 10,
                fontSize: 22,
                fontWeight: 700,
                color: displayDelta > 0 ? "#4caf50" : "#e53935",
                opacity: showDelta ? 1 : 0,
                transition: "opacity 0.4s, transform 0.4s",
                transform: showDelta ? "translateY(0px)" : "translateY(-10px)",
              }}
            >
              {displayDelta > 0 ? "+" : ""}
              {displayDelta}
            </span>
          )}
        </div>
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

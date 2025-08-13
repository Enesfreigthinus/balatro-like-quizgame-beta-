import React, { useEffect, useMemo, useState } from "react";
import { applyPreAnswerModifiers } from "../game/effects";

// Unbiased shuffle (Fisher–Yates)
function fisherYates(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuestionView({
  question,
  baseTime,
  flags,
  boss,
  onAnswered,
}) {
  const initial = useMemo(() => {
    let s = { timeLeft: baseTime, flags, eliminated: 0, hideOptions: false };
    s = applyPreAnswerModifiers(s);
    if (boss) {
      s.timeLeft = Math.ceil(s.timeLeft * 0.5);
      s.eliminated = Math.max(s.eliminated, 2);
    }
    return s;
  }, [question.id, baseTime, JSON.stringify(flags), boss]);

  const [timeLeft, setTimeLeft] = useState(initial.timeLeft);
  const [extraTimeUsed, setExtraTimeUsed] = useState(
    flags.includes("EXTRA_TIME")
  );
  const [showExtraTimeAnim, setShowExtraTimeAnim] = useState(false);
  // Reactively add 5 seconds if EXTRA_TIME flag is added after question starts
  React.useEffect(() => {
    if (flags.includes("EXTRA_TIME") && !extraTimeUsed) {
      setTimeLeft((prev) => prev + 5);
      setExtraTimeUsed(true);
      setShowExtraTimeAnim(true);
      setTimeout(() => setShowExtraTimeAnim(false), 1200);
    }
    // If question changes, reset extraTimeUsed
    if (!flags.includes("EXTRA_TIME") && extraTimeUsed) {
      setExtraTimeUsed(false);
    }
  }, [flags, extraTimeUsed, question.id]);
  const [locked, setLocked] = useState(false);
  const [eliminateCount, setEliminateCount] = useState(initial.eliminated);
  // Reactively update eliminateCount if ELIMINATE_TWO is played after question starts
  useEffect(() => {
    if (flags.includes("ELIMINATE_TWO")) {
      setEliminateCount(2);
    } else {
      setEliminateCount(initial.eliminated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flags, initial.eliminated, question.id]);
  const [hideOptions] = useState(initial.hideOptions);

  useEffect(() => {
    if (locked) return;
    if (timeLeft <= 0) {
      setLocked(true);
      onAnswered({ correct: false, choiceIndex: null, timeLeft: 0 });
      return;
    }
    const t = setTimeout(() => setTimeLeft((tl) => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, locked, onAnswered]);

  const eliminatedSet = useMemo(() => {
    // randomly pick N wrong options to hide (unbiased shuffle)
    if (eliminateCount <= 0) return new Set();
    const wrong = question.options
      .map((opt, idx) => ({ idx, wrong: idx !== question.answerIndex }))
      .filter((x) => x.wrong)
      .map((x) => x.idx);
    const shuffled = fisherYates(wrong);
    return new Set(shuffled.slice(0, eliminateCount));
  }, [question.id, eliminateCount]);

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div className="tag">{question.category}</div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {showExtraTimeAnim && (
            <span
              style={{
                marginRight: 8,
                fontSize: 18,
                fontWeight: 700,
                color: "#2196f3",
                opacity: showExtraTimeAnim ? 1 : 0,
                transition: "opacity 0.4s, transform 0.4s",
                transform: showExtraTimeAnim
                  ? "translateY(0px)"
                  : "translateY(-10px)",
                whiteSpace: "nowrap",
              }}
            >
              +5
            </span>
          )}
          <div className="tag" style={{ position: "relative", minWidth: 90 }}>
            Time: {timeLeft}s
          </div>
        </div>
      </div>
      <div className="h1" style={{ marginBottom: 10 }}>
        {question.question}
      </div>
      {/* Show hint if HINT flag is active and question has a hint property */}
      {flags && flags.includes("HINT") && question.hint && (
        <div
          className="hint"
          style={{ marginBottom: 10, color: "#4caf50", fontStyle: "italic" }}
        >
          Hint: {question.hint}
        </div>
      )}
      <div className="grid">
        {(!hideOptions
          ? question.options
          : ["Type your answer mentally and click Guess"]
        ).map((opt, idx) => {
          const hidden = eliminatedSet.has(idx);
          return (
            <button
              key={idx}
              className={`button ${locked || hidden ? "disabled" : ""}`}
              onClick={() => {
                if (locked) return;
                setLocked(true);
                onAnswered({
                  correct: idx === question.answerIndex,
                  choiceIndex: idx,
                  timeLeft,
                });
              }}
            >
              {hideOptions ? "Guess" : opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

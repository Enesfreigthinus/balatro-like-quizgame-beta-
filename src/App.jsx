import React, { useMemo, useState } from "react";
import ScoreBar from "./components/ScoreBar.jsx";
import QuestionView from "./components/QuestionView.jsx";
import Hand from "./components/Hand.jsx";
import Store from "./components/Store.jsx";
import {
  makeInitialState,
  getQuestion,
  nextQuestionIndex,
  rollShop,
  isBossRound,
  BossRules,
} from "./game/core.js";
import { AllEffects, computeScoreDelta } from "./game/effects.js";

export default function App() {
  const [state, setState] = useState(makeInitialState());
  const [flags, setFlags] = useState([]);
  const boss = isBossRound(state.questionIndex);

  const q = useMemo(
    () => getQuestion(state.questionIndex),
    [state.questionIndex]
  );
  const timeForQ = useMemo(
    () =>
      boss
        ? Math.ceil(state.timePerQuestion * BossRules.timeFactor)
        : state.timePerQuestion,
    [state.timePerQuestion, boss]
  );

  function playCard(card) {
    // Add effect flag for current question only; remove after answer
    setFlags((prev) => [...prev, card.effect]);
    // Remove the played card from hand (consumable for prototype)
    setState((s) => ({
      ...s,
      deck: s.deck.filter((c, i) => i !== s.deck.indexOf(card)),
    }));
  }

  function handleAnswer({ correct, timeLeft }) {
    const base = boss
      ? Math.round(q.basePoints * BossRules.baseMultiplier)
      : q.basePoints;
    const delta = computeScoreDelta(
      base,
      correct,
      flags,
      state.chain + (correct ? 1 : 0)
    );

    setState((s) => {
      let newScore = s.score + delta;
      let newChain = correct ? s.chain + 1 : 0;
      if (boss && !correct) {
        newScore = Math.max(
          0,
          Math.round(s.score * (1 - BossRules.wrongPenaltyFactor))
        );
        newChain = 0;
      }
      return {
        ...s,
        score: newScore,
        chain: newChain,
        coins: s.coins + Math.max(0, Math.round((correct ? base : 0) / 2)),
        questionIndex: nextQuestionIndex(s.questionIndex),
        shop: (s.questionIndex + 1) % 3 === 0 ? rollShop() : s.shop,
      };
    });
    setFlags([]);
  }

  function buy(card) {
    setState((s) => {
      if (s.coins < card.cost) return s;
      return { ...s, coins: s.coins - card.cost, deck: [...s.deck, card] };
    });
  }

  function reroll() {
    setState((s) => ({
      ...s,
      coins: Math.max(0, s.coins - 20),
      shop: rollShop(),
    }));
  }

  function reset() {
    setState(makeInitialState());
    setFlags([]);
  }

  return (
    <div className="container">
      <div className="h1" style={{ marginBottom: 12 }}>
        Balatro-Style Quiz (Prototype)
      </div>

      <ScoreBar
        score={state.score}
        coins={state.coins}
        chain={state.chain}
        questionNumber={state.questionIndex + 1}
      />

      <div className="row" style={{ marginTop: 16 }}>
        <div className="flex-1">
          <QuestionView
            key={q.id}
            question={q}
            baseTime={timeForQ}
            flags={flags}
            boss={boss}
            onAnswered={handleAnswer}
          />
        </div>
        <div className="flex-1">
          <Hand
            deck={state.deck}
            onPlay={playCard}
            disabled={flags.length > 0}
          />
          <div style={{ height: 12 }} />
          <Store
            shop={state.shop}
            coins={state.coins}
            onBuy={buy}
            onReroll={reroll}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="button" onClick={reset}>
              Reset Run
            </button>
            <div className="tag">Boss every 5th question</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="small">Notes</div>
        <ul>
          <li>
            This is a minimal prototype: cards are consumable and effects apply
            only to the current question.
          </li>
          <li>
            Extend questions.json and cards.json to grow content and variety.
          </li>
          <li>
            Add persistence (localStorage) only if desired; no user data is sent
            to any server.
          </li>
          <li>
            Improve visuals/animations to evoke a stronger deck-builder feel.
          </li>
        </ul>
      </div>
    </div>
  );
}

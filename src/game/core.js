import cardsCatalog from "../data/cards.json";
import questionsData from "../data/questions.json";
import { EFFECTS } from "./effects";

export function makeInitialState() {
  const deck = [
    findCard("hint"),
    findCard("fifty"),
    findCard("extraTime"),
    findCard("x2"),
  ];
  return {
    questionIndex: 0,
    score: 0,
    coins: 100,
    chain: 0,
    timePerQuestion: 15,
    deck,
    shop: rollShop(),
    runOver: false,
  };
}

export function nextQuestionIndex(i) {
  return i + 1;
}

export function findCard(id) {
  return cardsCatalog.find((c) => c.id === id);
}

export function rollShop() {
  // pick 4 random cards to sell
  const pool = [...cardsCatalog];
  const picks = [];
  for (let i = 0; i < 4 && pool.length > 0; i++) {
    const r = Math.floor(Math.random() * pool.length);
    picks.push(pool.splice(r, 1)[0]);
  }
  return picks;
}

export function getQuestion(i) {
  return questionsData[i % questionsData.length];
}

export function isBossRound(index) {
  // every 5th question is a boss
  return (index + 1) % 5 === 0;
}

export const BossRules = {
  baseMultiplier: 3,
  timeFactor: 0.5,
  hideTwoOptions: true,
  wrongPenaltyFactor: 0.5, // remove 50% of total score on wrong? handled in App
};

export const AllEffects = EFFECTS;

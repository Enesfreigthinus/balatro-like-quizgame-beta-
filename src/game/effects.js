export const EFFECTS = {
  HINT: "HINT",
  ELIMINATE_TWO: "ELIMINATE_TWO",
  EXTRA_TIME: "EXTRA_TIME",
  MULTIPLIER_X2: "MULTIPLIER_X2",
  CHAIN_BOOST: "CHAIN_BOOST",
  BLIND_GUESS: "BLIND_GUESS",
  TIME_PRESSURE: "TIME_PRESSURE",
};

export const AllEffects = EFFECTS;

export function applyPreAnswerModifiers(state) {
  // state carries transient flags for the current question
  const s = { ...state };
  if (s.flags.includes(EFFECTS.EXTRA_TIME)) s.timeLeft += 5;
  if (s.flags.includes(EFFECTS.TIME_PRESSURE))
    s.timeLeft = Math.ceil(s.timeLeft / 2);
  if (s.flags.includes(EFFECTS.ELIMINATE_TWO)) {
    // mark two incorrect options as eliminated
    s.eliminated = 2;
  }
  if (s.flags.includes(EFFECTS.BLIND_GUESS)) {
    s.hideOptions = true;
  }
  return s;
}

export function computeScoreDelta(basePoints, correct, flags, chainLength) {
  let points = basePoints;
  if (flags.includes(EFFECTS.TIME_PRESSURE) && correct)
    points = Math.round(points * 1.5);
  if (flags.includes(EFFECTS.MULTIPLIER_X2))
    points = points * (correct ? 2 : -2);
  else points = correct ? points : -Math.round(points * 0.5);

  if (flags.includes(EFFECTS.CHAIN_BOOST) && correct) {
    points += 20 * Math.max(0, chainLength - 1);
  }
  if (flags.includes(EFFECTS.BLIND_GUESS)) {
    points = correct ? points * 5 : -Math.abs(points);
  }
  return points;
}

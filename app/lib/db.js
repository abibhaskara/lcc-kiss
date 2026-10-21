let memoryScores = {
  team1: { name: "TIM A", score: 0 },
  team2: { name: "TIM B", score: 0 },
  team3: { name: "TIM C", score: 0 }
};

export function getScores() {
  return memoryScores;
}

export function updateScore(teamId, increment) {
  if (memoryScores[teamId]) {
    memoryScores[teamId].score += Number(increment);
  } else {
    memoryScores[teamId] = { name: teamId.toUpperCase(), score: Number(increment) };
  }
  return memoryScores;
}

export function updateTeamName(teamId, newName) {
  if (memoryScores[teamId]) {
    memoryScores[teamId].name = newName;
  } else {
    memoryScores[teamId] = { name: newName, score: 0 };
  }
  return memoryScores;
}

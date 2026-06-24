const SAVE_KEY = "viralDramaSaveV1";

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(GameState));
}

function loadGame() {
  const rawSave = localStorage.getItem(SAVE_KEY);
  if (!rawSave) return false;

  try {
    const saved = JSON.parse(rawSave);
    Object.assign(GameState.player, saved.player || {});
    GameState.currentScene = saved.currentScene || "intro_001";
    GameState.stats = saved.stats || { ...defaultStats };
    GameState.relationships = saved.relationships || {};
    GameState.flags = saved.flags || {};
    GameState.history = saved.history || [];
    return true;
  } catch (error) {
    console.error("Save file could not be loaded.", error);
    return false;
  }
}

function hasSave() {
  return Boolean(localStorage.getItem(SAVE_KEY));
}

function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

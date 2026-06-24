const defaultStats = {
  drama: 0,
  popularity: 0,
  influence: 0,
  trust: 0,
  followers: 0,
  threat: 0
};

const GameState = {
  player: {
    name: "",
    pronouns: "",
    avatar: "",
    archetype: ""
  },
  currentScene: "intro_001",
  stats: { ...defaultStats },
  relationships: {},
  flags: {},
  history: []
};

function resetGameState() {
  GameState.player = {
    name: "",
    pronouns: "",
    avatar: "",
    archetype: ""
  };
  GameState.currentScene = "intro_001";
  GameState.stats = { ...defaultStats };
  GameState.relationships = {};
  GameState.flags = {};
  GameState.history = [];
}

function applyEffects(effects = {}) {
  if (!effects) return;

  if (effects.stats) {
    Object.entries(effects.stats).forEach(([key, value]) => {
      if (GameState.stats[key] === undefined) GameState.stats[key] = 0;
      GameState.stats[key] += value;
    });
  }

  if (effects.relationships) {
    Object.entries(effects.relationships).forEach(([key, value]) => {
      if (GameState.relationships[key] === undefined) GameState.relationships[key] = 0;
      GameState.relationships[key] += value;
    });
  }

  if (effects.flags) {
    Object.entries(effects.flags).forEach(([key, value]) => {
      GameState.flags[key] = value;
    });
  }
}

function applyArchetypeBonus(archetypeId) {
  const archetype = window.VIRAL_ARCHETYPES.find(item => item.id === archetypeId);
  if (archetype && archetype.effects) {
    applyEffects(archetype.effects);
  }
}

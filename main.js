window.VIRAL_AVATARS = [
  { id: "influencer_guy", name: "Influencer Guy", gradient: "linear-gradient(135deg, #ff3bbd, #8d4dff)" },
  { id: "athletic_guy", name: "Athletic Guy", gradient: "linear-gradient(135deg, #39e8ff, #8d4dff)" },
  { id: "alt_guy", name: "Alternative Guy", gradient: "linear-gradient(135deg, #111111, #ff3bbd)" },
  { id: "influencer_girl", name: "Influencer Girl", gradient: "linear-gradient(135deg, #ff75d8, #ffb8ee)" },
  { id: "athletic_girl", name: "Athletic Girl", gradient: "linear-gradient(135deg, #39e8ff, #ffffff)" },
  { id: "alt_girl", name: "Alternative Girl", gradient: "linear-gradient(135deg, #8d4dff, #100818)" },
  { id: "androgynous_creator", name: "Androgynous Creator", gradient: "linear-gradient(135deg, #ff3bbd, #39e8ff)" },
  { id: "wildcard_creator", name: "Wildcard Creator", gradient: "linear-gradient(135deg, #faff00, #ff3bbd)" }
];

window.VIRAL_ARCHETYPES = [
  {
    id: "villain",
    name: "The Villain",
    description: "You know good TV needs chaos.",
    effects: { stats: { drama: 5, threat: 3, followers: 2 } }
  },
  {
    id: "social_butterfly",
    name: "The Social Butterfly",
    description: "Everybody is a potential ally.",
    effects: { stats: { popularity: 5, trust: 2 } }
  },
  {
    id: "strategist",
    name: "The Strategist",
    description: "You came to play chess, not checkers.",
    effects: { stats: { influence: 5, trust: 1 } }
  },
  {
    id: "floater",
    name: "The Floater",
    description: "No enemies. No target. No problem.",
    effects: { stats: { trust: 3, threat: -3 } }
  },
  {
    id: "wildcard",
    name: "The Wildcard",
    description: "Even you do not know what you will do next.",
    effects: { stats: { drama: 2, popularity: 2, influence: 2, threat: 1 } }
  }
];

let selectedPronouns = "";
let selectedAvatar = "";
let selectedArchetype = "";

document.addEventListener("DOMContentLoaded", async () => {
  await loadGameData();

  setupButtons();
  renderAvatarOptions();
  renderArchetypeOptions();

  document.getElementById("continueBtn").disabled = !hasSave();
});

function setupButtons() {
  document.getElementById("newGameBtn").addEventListener("click", () => {
    resetGameState();
    clearSelections();
    showScreen("createScreen");
  });

  document.getElementById("continueBtn").addEventListener("click", () => {
    if (loadGame()) {
      showScreen("gameScreen");
      renderScene(GameState.currentScene);
    }
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    clearSave();
    resetGameState();
    document.getElementById("continueBtn").disabled = true;
    alert("Save reset.");
  });

  document.querySelectorAll("#pronounOptions button").forEach(button => {
    button.addEventListener("click", () => {
      selectedPronouns = button.dataset.pronouns;
      markSelected("#pronounOptions button", button);
    });
  });

  document.getElementById("startStoryBtn").addEventListener("click", startStory);

  document.getElementById("saveBtn").addEventListener("click", () => {
    saveGame();
    alert("Game saved.");
  });

  document.getElementById("backToTitleBtn").addEventListener("click", () => {
    showScreen("titleScreen");
    document.getElementById("continueBtn").disabled = !hasSave();
  });
}

function renderAvatarOptions() {
  const container = document.getElementById("avatarOptions");
  container.innerHTML = "";

  window.VIRAL_AVATARS.forEach(avatar => {
    const card = document.createElement("button");
    card.className = "avatar-card";
    card.innerHTML = `
      <div class="avatar-swatch" style="background:${avatar.gradient}"></div>
      <strong>${avatar.name}</strong>
    `;
    card.addEventListener("click", () => {
      selectedAvatar = avatar.id;
      markSelected(".avatar-card", card);
    });
    container.appendChild(card);
  });
}

function renderArchetypeOptions() {
  const container = document.getElementById("archetypeOptions");
  container.innerHTML = "";

  window.VIRAL_ARCHETYPES.forEach(type => {
    const button = document.createElement("button");
    button.innerHTML = `<strong>${type.name}</strong><br><small>${type.description}</small>`;
    button.addEventListener("click", () => {
      selectedArchetype = type.id;
      markSelected("#archetypeOptions button", button);
    });
    container.appendChild(button);
  });
}

function startStory() {
  const name = document.getElementById("playerName").value.trim();

  if (!name || !selectedPronouns || !selectedAvatar || !selectedArchetype) {
    alert("Finish your name, pronouns, avatar, and contestant type first.");
    return;
  }

  resetGameState();

  GameState.player.name = name;
  GameState.player.pronouns = selectedPronouns;
  GameState.player.avatar = selectedAvatar;
  GameState.player.archetype = selectedArchetype;

  applyArchetypeBonus(selectedArchetype);
  saveGame();

  showScreen("gameScreen");
  renderScene("intro_001");
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(screenId).classList.add("active");
}

function markSelected(selector, selectedElement) {
  document.querySelectorAll(selector).forEach(item => item.classList.remove("selected"));
  selectedElement.classList.add("selected");
}

function clearSelections() {
  selectedPronouns = "";
  selectedAvatar = "";
  selectedArchetype = "";
  document.getElementById("playerName").value = "";
  document.querySelectorAll(".selected").forEach(item => item.classList.remove("selected"));
}

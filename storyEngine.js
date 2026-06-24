let StoryData = null;
let CharacterData = null;

async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }
  return response.json();
}

async function loadGameData() {
  const [story, characters] = await Promise.all([
    loadJSON("data/story.json"),
    loadJSON("data/characters.json")
  ]);

  StoryData = story;
  CharacterData = characters;
}

function getScene(sceneId) {
  return StoryData.scenes[sceneId];
}

function replaceTokens(text) {
  const name = GameState.player.name || "Contestant";
  const pronouns = GameState.player.pronouns || "they/them";
  const subject = pronouns === "he/him" ? "he" : pronouns === "she/her" ? "she" : "they";

  return text
    .replaceAll("{player}", name)
    .replaceAll("{subject}", subject);
}

function renderScene(sceneId) {
  const scene = getScene(sceneId);

  if (!scene) {
    console.error(`Scene not found: ${sceneId}`);
    return;
  }

  GameState.currentScene = sceneId;
  GameState.history.push(sceneId);

  if (scene.type === "summary") {
    showSummaryScreen();
    saveGame();
    return;
  }

  const speaker = scene.speaker || "Producer";
  const dialogue = replaceTokens(scene.dialogue || "");
  const character = CharacterData.characters[scene.character] || null;

  document.getElementById("sceneLabel").textContent = scene.label || "Viral Drama";
  document.getElementById("speakerName").textContent = character ? character.name : speaker;
  document.getElementById("dialogueText").textContent = dialogue;

  const portrait = document.getElementById("portrait");
  const portraitInitials = document.getElementById("portraitInitials");

  if (character) {
    portraitInitials.textContent = character.initials || character.name.slice(0, 2).toUpperCase();
    portrait.style.background = character.placeholderGradient || "";
  } else {
    portraitInitials.textContent = "VD";
    portrait.style.background = "";
  }

  renderChoices(scene.choices || []);
  renderStats();
  saveGame();
}

function renderChoices(choices) {
  const container = document.getElementById("choices");
  container.innerHTML = "";

  choices.forEach(choice => {
    if (choice.requiresFlag && !GameState.flags[choice.requiresFlag]) return;

    const button = document.createElement("button");
    button.textContent = choice.text;
    button.addEventListener("click", () => {
      applyEffects(choice.effects);
      renderScene(choice.next);
    });
    container.appendChild(button);
  });
}

function renderStats() {
  const panel = document.getElementById("statsPanel");
  const stats = GameState.stats;

  panel.innerHTML = Object.entries(stats)
    .map(([key, value]) => `
      <div class="stat-row">
        <span>${capitalize(key)}</span>
        <strong>${value}</strong>
      </div>
    `)
    .join("");
}

function showSummaryScreen() {
  showScreen("summaryScreen");

  const finalStats = document.getElementById("finalStats");
  finalStats.innerHTML = Object.entries(GameState.stats)
    .map(([key, value]) => `
      <div class="stat-row">
        <span>${capitalize(key)}</span>
        <strong>${value}</strong>
      </div>
    `)
    .join("");
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

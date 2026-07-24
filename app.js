const REPOSITORY = "jamesmontemagno/james-cafe";
const ISSUE_URL = `https://github.com/${REPOSITORY}/issues/new`;
const DATA_URL = "data/entries.json";

const translations = {
  en: {
    skip: "Skip to entry form",
    live: "Live in Tokyo",
    eventLine: "AI DEV DAY · TOKYO · JULY 24",
    heroTop: "James Cafe",
    heroBottom: "Capsule Giveaway",
    intro: "Drop your name into the machine for a chance to take home a bag of James' small-batch, home-roasted coffee.",
    nameLabel: "Your name",
    namePlaceholder: "How should we call you?",
    join: "Join the draw",
    formNote: "You'll confirm your entry in a new GitHub issue. No email needed.",
    invalidName: "Please enter a name between 1 and 40 characters.",
    step1: "Enter your name",
    step2: "Submit on GitHub",
    step3: "Watch it drop",
    machineBadge: "COFFEE GACHA",
    entries: "entries",
    emptyTitle: "Be the first capsule!",
    emptyBody: "New entries appear here after GitHub processes them.",
    draw: "DRAW WINNER",
    hostControl: "Cafe host control",
    prizeChute: "PRIZE / 景品",
    syncing: "Checking the machine…",
    synced: "Machine synced with GitHub",
    syncError: "Could not refresh — showing the last loaded entries",
    submitted: "GitHub opened — submit the issue, then your capsule will appear.",
    shareTitle: "Bring someone into the cafe.",
    shareBody: "Point your camera at the code. The machine is open throughout AI Dev Day.",
    scan: "SCAN TO ENTER",
    roastTitle: "Roasted by James.",
    roastBody: "Shared with the community. One tiny batch, made with unreasonable care.",
    footer: "Built live in Tokyo with GitHub Copilot · Fast Alone, Far Together.",
    winnerLabel: "THE CAPSULE CHOSE",
    winnerMessage: "Come to James Cafe for your home-roasted coffee!",
    drawAgain: "Draw again"
  },
  ja: {
    skip: "応募フォームへ移動",
    live: "東京からライブ",
    eventLine: "AI DEV DAY · 東京 · 7月24日",
    heroTop: "ジェームズ・カフェ",
    heroBottom: "カプセル抽選会",
    intro: "お名前をマシンに入れて、ジェームズ自家焙煎の特別なコーヒーを当てよう！",
    nameLabel: "お名前",
    namePlaceholder: "お呼びするお名前は？",
    join: "抽選に参加する",
    formNote: "新しいGitHub Issueで応募を確定します。メールアドレスは不要です。",
    invalidName: "1〜40文字でお名前を入力してください。",
    step1: "名前を入力",
    step2: "GitHubで送信",
    step3: "カプセルを確認",
    machineBadge: "コーヒーガチャ",
    entries: "人参加中",
    emptyTitle: "最初のカプセルになろう！",
    emptyBody: "GitHubで処理された応募がここに表示されます。",
    draw: "当選者を決める",
    hostControl: "カフェ運営用",
    prizeChute: "PRIZE / 景品",
    syncing: "マシンを確認中…",
    synced: "GitHubと同期しました",
    syncError: "更新できませんでした — 読み込み済みの応募を表示中",
    submitted: "GitHubが開きました — Issueを送信するとカプセルが表示されます。",
    shareTitle: "仲間をカフェに誘おう。",
    shareBody: "カメラをコードに向けてください。AI Dev Day開催中はいつでも参加できます。",
    scan: "スキャンして参加",
    roastTitle: "ジェームズが焙煎。",
    roastBody: "コミュニティのみなさんへ。こだわりすぎるほど丁寧に仕上げた、小さな特別ロットです。",
    footer: "東京でGitHub Copilotとライブ制作 · Fast Alone, Far Together.",
    winnerLabel: "カプセルが選んだのは",
    winnerMessage: "ジェームズ・カフェで自家焙煎コーヒーを受け取ってください！",
    drawAgain: "もう一度抽選"
  }
};

const capsulePalettes = [
  ["oklch(0.88 0.17 91)", "oklch(0.62 0.22 36)"],
  ["oklch(0.87 0.16 180)", "oklch(0.30 0.19 283)"],
  ["oklch(0.70 0.18 334)", "oklch(0.88 0.17 91)"],
  ["oklch(0.62 0.22 36)", "oklch(0.87 0.16 180)"],
  ["oklch(0.82 0.13 223)", "oklch(0.70 0.18 334)"]
];

const state = {
  language: localStorage.getItem("james-cafe-language") || (navigator.language.startsWith("ja") ? "ja" : "en"),
  entries: [],
  drawing: false,
  syncStatus: "syncing"
};

const elements = {
  form: document.querySelector("#entry-form"),
  name: document.querySelector("#entry-name"),
  error: document.querySelector("#form-error"),
  chamber: document.querySelector("#capsule-chamber"),
  count: document.querySelector("#entry-count"),
  draw: document.querySelector("#draw-button"),
  machine: document.querySelector(".machine"),
  chute: document.querySelector("#chute-door"),
  syncDot: document.querySelector("#sync-dot"),
  syncText: document.querySelector("#sync-text"),
  dialog: document.querySelector("#winner-dialog"),
  winnerName: document.querySelector("#winner-name"),
  closeWinner: document.querySelector("#close-winner"),
  drawAgain: document.querySelector("#draw-again"),
  confetti: document.querySelector("#confetti")
};

function setLanguage(language) {
  state.language = language;
  localStorage.setItem("james-cafe-language", language);
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = translations[language][element.dataset.i18n];
    if (value) element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = translations[language][element.dataset.i18nPlaceholder];
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    const active = button.dataset.language === language;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  updateSyncStatus(state.syncStatus);
}

function updateSyncStatus(status) {
  state.syncStatus = status;
  elements.syncDot.className = status === "synced" ? "is-ready" : status === "syncError" ? "is-error" : "";
  elements.syncText.textContent = translations[state.language][status];
}

function hashName(name) {
  return [...name].reduce((hash, character) => ((hash << 5) - hash + character.codePointAt(0)) | 0, 0);
}

function capsulePosition(index, total, hash) {
  const columns = Math.min(5, Math.max(3, Math.ceil(Math.sqrt(total))));
  const row = Math.floor(index / columns);
  const column = index % columns;
  const visibleRows = Math.max(1, Math.ceil(total / columns));
  const x = 4 + column * (90 / columns) + Math.abs(hash % 5);
  const y = 78 - Math.min(68, row * (64 / Math.max(visibleRows, 4))) - Math.abs((hash >> 3) % 5);
  return { x, y };
}

function createCapsule(entry, index, total) {
  const hash = hashName(entry.name);
  const palette = capsulePalettes[Math.abs(hash) % capsulePalettes.length];
  const position = capsulePosition(index, total, hash);
  const capsule = document.createElement("div");
  capsule.className = "capsule";
  capsule.style.left = `${position.x}%`;
  capsule.style.top = `${position.y}%`;
  capsule.style.setProperty("--cap-top", palette[0]);
  capsule.style.setProperty("--cap-bottom", palette[1]);
  capsule.style.setProperty("--rotation", `${(hash % 24) - 12}deg`);
  capsule.style.setProperty("--duration", `${2.8 + (Math.abs(hash) % 12) / 10}s`);
  capsule.style.setProperty("--delay", `${-(Math.abs(hash) % 20) / 10}s`);
  const label = document.createElement("span");
  label.textContent = entry.name;
  label.title = entry.name;
  capsule.append(label);
  return capsule;
}

function renderEntries() {
  elements.chamber.replaceChildren();
  if (state.entries.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-machine";
    empty.innerHTML = `<div class="empty-capsule" aria-hidden="true"></div><strong data-i18n="emptyTitle"></strong><span data-i18n="emptyBody"></span>`;
    elements.chamber.append(empty);
    setLanguage(state.language);
  } else {
    const visibleEntries = state.entries.slice(-20);
    visibleEntries.forEach((entry, index) => {
      elements.chamber.append(createCapsule(entry, index, visibleEntries.length));
    });
  }
  elements.count.textContent = String(state.entries.length);
  elements.draw.disabled = state.entries.length === 0 || state.drawing;
}

async function loadEntries() {
  try {
    const response = await fetch(`${DATA_URL}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Entry data returned ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Entry data is not an array");
    state.entries = data.filter((entry) => entry && typeof entry.name === "string");
    renderEntries();
    updateSyncStatus("synced");
  } catch (error) {
    console.error(error);
    updateSyncStatus("syncError");
  }
}

function secureRandomIndex(length) {
  const maximum = Math.floor(0x100000000 / length) * length;
  const values = new Uint32Array(1);
  do crypto.getRandomValues(values); while (values[0] >= maximum);
  return values[0] % length;
}

function launchConfetti() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const canvas = elements.confetti;
  const context = canvas.getContext("2d");
  const ratio = devicePixelRatio || 1;
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  context.scale(ratio, ratio);
  const colors = ["#ff6749", "#1fffd6", "#ffe250", "#4b35b8", "#ffffff"];
  const pieces = Array.from({ length: 110 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 180,
    y: innerHeight * 0.35,
    vx: (Math.random() - 0.5) * 16,
    vy: -7 - Math.random() * 10,
    gravity: 0.23 + Math.random() * 0.16,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.3,
    size: 5 + Math.random() * 8,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));
  const started = performance.now();
  function frame(now) {
    context.clearRect(0, 0, innerWidth, innerHeight);
    pieces.forEach((piece) => {
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.vy += piece.gravity;
      piece.rotation += piece.spin;
      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.rotation);
      context.fillStyle = piece.color;
      context.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * 0.66);
      context.restore();
    });
    if (now - started < 2800) requestAnimationFrame(frame);
    else context.clearRect(0, 0, innerWidth, innerHeight);
  }
  requestAnimationFrame(frame);
}

function showWinner(winner) {
  elements.winnerName.textContent = winner.name;
  elements.dialog.showModal();
  launchConfetti();
}

async function drawWinner() {
  if (state.drawing || state.entries.length === 0) return;
  state.drawing = true;
  elements.draw.disabled = true;
  elements.machine.classList.add("is-drawing");
  const winner = state.entries[secureRandomIndex(state.entries.length)];
  const delay = matchMedia("(prefers-reduced-motion: reduce)").matches ? 80 : 1350;
  await new Promise((resolve) => setTimeout(resolve, delay));
  const dropped = document.createElement("div");
  dropped.className = "drop-capsule";
  elements.chute.replaceChildren(dropped);
  await new Promise((resolve) => setTimeout(resolve, delay === 80 ? 80 : 650));
  elements.machine.classList.remove("is-drawing");
  state.drawing = false;
  elements.draw.disabled = false;
  showWinner(winner);
  setTimeout(() => elements.chute.replaceChildren(), 900);
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = elements.name.value.trim().replace(/\s+/g, " ");
  if (name.length < 1 || name.length > 40 || /[\u0000-\u001F\u007F]/u.test(name)) {
    elements.error.textContent = translations[state.language].invalidName;
    elements.name.focus();
    return;
  }
  elements.error.textContent = "";
  const parameters = new URLSearchParams({
    template: "giveaway-entry.yml",
    title: `[ENTRY] ${name}`
  });
  window.open(`${ISSUE_URL}?${parameters}`, "_blank", "noopener,noreferrer");
  updateSyncStatus("submitted");
  setTimeout(loadEntries, 15000);
});

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});
elements.draw.addEventListener("click", drawWinner);
elements.drawAgain.addEventListener("click", () => {
  elements.dialog.close();
  drawWinner();
});
elements.closeWinner.addEventListener("click", () => elements.dialog.close());
elements.dialog.addEventListener("click", (event) => {
  if (event.target === elements.dialog) elements.dialog.close();
});

setLanguage(state.language);
loadEntries();
setInterval(loadEntries, 30000);

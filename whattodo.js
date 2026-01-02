/*********************
 * CHOICES
 *********************/
const choices = [
  {
    text: "🎹 Practice Piano",
    color: "#6d1f42",
    textColor: "#d3b6d3",
    emojis: ["🎹", "🌿", "🎼", "🍏"],
  },
  {
    text: "🎧 Listen to new album & yoga",
    color: "#efce7b",
    textColor: "#ef6f3c",
    emojis: ["🎵", "🦴", "🧍‍♂️", "💿", "💜"],
  },
  {
    text: "🎵 Learn Music Theory",
    color: "#afab23",
    textColor: "#6d1f42",
    emojis: ["🍎", "🎼", "🎶"],
  },
  {
    text: "📖 Read",
    color: "#f4beae",
    textColor: "#876029",
    emojis: ["📕", "📗", "📘", "🤧"],
  },
  {
    text: "🎺 Jazz Piano Book",
    color: "#25533f",
    textColor: "#aacc96",
    emojis: ["🎷", "🎵", "❤️"],
  },
  {
    text: "🎸 Practice Guitar",
    color: "#ff7bac",
    textColor: "#6d1f42",
    emojis: ["🎸", "🎧", "👽"],
  },
  {
    text: "🧩 Puzzles & TV/Movie",
    color: "#aacc96",
    textColor: "#25533f",
    emojis: ["🧩", "🍿", "🎞️", "💞"],
  },
  {
    text: "🎨 Practice Drawing",
    color: "#b8cee8",
    textColor: "#25533f",
    emojis: ["🖌️", "🖼️", "🎞️", "🎬"],
  },
  {
    text: "🥴 Sorry! Spin Again.",
    color: "#876029",
    textColor: "#f4beae",
    emojis: ["🪱", "💩"],
  },
  {
    text: "🫣 Ahh! Spin Again.",
    color: "#ef6f3c",
    textColor: "#efce7b",
    emojis: ["🪱", "👽"],
  },
];

/*********************
 * ELEMENTS
 *********************/
const bg = document.getElementById("bg");
const textEl = document.getElementById("roulette-text");
const startBtn = document.getElementById("start-btn");
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let spinning = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/*********************
 * AUDIO
 *********************/
const clickSound = new Audio("./assets/click.mp3");
const finalSound = new Audio("./assets/final.mp3");

clickSound.preload = "auto";
finalSound.preload = "auto";

// Optional volume control
clickSound.volume = 0.4;
finalSound.volume = 0.5;

/*********************
 * UI UPDATE
 *********************/
function updateChoice(choice) {
  textEl.textContent = choice.text;
  textEl.style.color = choice.textColor;
  bg.style.backgroundColor = choice.color;

  // subtle punch during spin
  textEl.style.transform = "scale(1.05)";
  setTimeout(() => {
    textEl.style.transform = "scale(1)";
  }, 120);
}

/*********************
 * ROULETTE LOGIC
 *********************/
startBtn.addEventListener("click", () => {
  if (spinning) return;

  // Play click sound once
  clickSound.currentTime = 0;
  clickSound.play();

  spinning = true;
  startBtn.disabled = true;
  spinRoulette();
});

function spinRoulette() {
  let duration = 4200;
  let interval = 90;
  let elapsed = 0;

  function step() {
    elapsed += interval;
    updateChoice(randomChoice());
    interval *= 1.08;

    if (elapsed < duration) {
      setTimeout(step, interval);
    } else {
      const finalChoice = randomChoice();
      updateChoice(finalChoice);

      // Play final sound ONCE
      finalSound.currentTime = 0;
      finalSound.play();

      launchEmojiConfetti(finalChoice.emojis);
      spinning = false;
      startBtn.disabled = false;
    }
  }
  step();
}

function randomChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

/*********************
 * EMOJI CONFETTI
 *********************/
function launchEmojiConfetti(emojis) {
  const particles = [];
  const count = 50;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      size: Math.random() * 30 + 20,
      speed: Math.random() * 3 + 2,
    });
  }

  let animationId;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.emoji, p.x, p.y);
      p.y += p.speed;
    });

    animationId = requestAnimationFrame(draw);
  }

  draw();

  setTimeout(() => {
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 10000);
}

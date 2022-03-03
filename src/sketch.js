const defaultSettings = {
  numberOfPlayers: 40,
  pipeWidth: 50,
  pipeSpeed: 4,
  gravity: 0.2,
  flapPower: -4,
  gapPosition: 250,
  gapSize: 150,
  birdWidth: 45,
  birdHeight: 25,
  pipeFrequency: 80,
};

let numberOfPlayers = defaultSettings.numberOfPlayers;
let pipeWidth = defaultSettings.pipeWidth;
let pipeSpeed = defaultSettings.pipeSpeed;
let gravity = defaultSettings.gravity;
let gapPosition = defaultSettings.gapPosition;
let gapSize = defaultSettings.gapSize;
let flapPower = defaultSettings.flapPower;
let birdWidth = defaultSettings.birdWidth;
let birdHeight = defaultSettings.birdHeight;
let pipeFrequency = defaultSettings.pipeFrequency;

let population;

let pipes = [];

let isPaused = true;
let isFirstDraw = true;
let showVision = false;
let showOptions = false;

let time = 0;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function reset() {
  numberOfPlayers = defaultSettings.numberOfPlayers;
  pipeWidth = defaultSettings.pipeWidth;
  pipeSpeed = defaultSettings.pipeSpeed;
  gravity = defaultSettings.gravity;
  gapPosition = defaultSettings.gapPosition;
  gapSize = defaultSettings.gapSize;
  flapPower = defaultSettings.flapPower;
  birdWidth = defaultSettings.birdWidth;
  birdHeight = defaultSettings.birdHeight;
  pipeFrequency = defaultSettings.pipeFrequency;

  document.getElementById("settingsNumPlayers").value = numberOfPlayers;
  document.getElementById("settingsPipeWidth").value = pipeWidth;
  document.getElementById("settingsPipeSpeed").value = pipeSpeed;
  document.getElementById("settingsGravity").value = gravity;
  document.getElementById("settingsGapPosition").value = gapPosition;
  document.getElementById("settingsGapSize").value = gapSize;
  document.getElementById("settingsFlapPower").value = flapPower;
  document.getElementById("settingsBirdWidth").value = birdWidth;
  document.getElementById("settingsBirdHeight").value = birdHeight;
  document.getElementById("settingsPipeFrequency").value = pipeFrequency;

  applySettings();
}

function applySettings() {
  numberOfPlayers = +document.getElementById("settingsNumPlayers").value;
  pipeWidth = +document.getElementById("settingsPipeWidth").value;
  pipeSpeed = +document.getElementById("settingsPipeSpeed").value;
  gravity = +document.getElementById("settingsGravity").value;
  gapPosition = +document.getElementById("settingsGapPosition").value;
  gapSize = +document.getElementById("settingsGapSize").value;
  flapPower = +document.getElementById("settingsFlapPower").value;
  birdWidth = +document.getElementById("settingsBirdWidth").value;
  birdHeight = +document.getElementById("settingsBirdHeight").value;
  pipeFrequency = +document.getElementById("settingsPipeFrequency").value;

  pipes = [];
  time = 0;

  population = new Population(
    numberOfPlayers,
    birdWidth,
    birdHeight,
    pipes,
    gravity,
    flapPower
  );

  pipes.push(
    new Pipe(
      pipeWidth,
      gapSize,
      getRandomArbitrary(-gapPosition, gapPosition),
      pipeSpeed
    )
  );

  document.getElementById("pauseButton").textContent = "Unpause";
  document
    .getElementById("pauseButton")
    .setAttribute("class", "btn btn-secondary");
  document.getElementById("score").textContent =
    "Score: " + population.getBestScore();
  document.getElementById("generation").textContent =
    "Generation: " + population.generation;
  document.getElementById("alive").textContent =
    "Alive: " + population.getAlive();

  isPaused = true;
  isFirstDraw = true;
}

function setup() {
  let canvas = createCanvas(600, 700);
  canvas.parent("canvas-column");
  population = new Population(
    numberOfPlayers,
    birdWidth,
    birdHeight,
    pipes,
    gravity,
    flapPower
  );
  pipes.push(
    new Pipe(
      pipeWidth,
      gapSize,
      getRandomArbitrary(-gapPosition, gapPosition),
      pipeSpeed
    )
  );

  document.getElementById("pauseButton").addEventListener("click", () => {
    if (isPaused) {
      document.getElementById("pauseButton").textContent = "Pause";
      document
        .getElementById("pauseButton")
        .setAttribute("class", "btn btn-primary");
    } else {
      document.getElementById("pauseButton").textContent = "Unpause";
      document
        .getElementById("pauseButton")
        .setAttribute("class", "btn btn-secondary");
    }
    isPaused = !isPaused;
  });

  document.getElementById("visionButton").addEventListener("click", () => {
    if (showVision) {
      document
        .getElementById("visionButton")
        .setAttribute("class", "btn btn-secondary");
    } else {
      document
        .getElementById("visionButton")
        .setAttribute("class", "btn btn-primary");
    }
    showVision = !showVision;
  });

  document.getElementById("collapseButton").addEventListener("click", () => {
    if (showOptions) {
      document
        .getElementById("settingsCollapse")
        .setAttribute("class", "collapse");
    } else {
      document
        .getElementById("settingsCollapse")
        .setAttribute("class", "collapse.show");
    }
    showOptions = !showOptions;
  });

  document.getElementById("applyButton").addEventListener("click", () => {
    applySettings();
  });

  document.getElementById("resetButton").addEventListener("click", () => {
    reset();
  });

  document.getElementById("settingsNumPlayers").value = numberOfPlayers;
  document.getElementById("settingsPipeWidth").value = pipeWidth;
  document.getElementById("settingsPipeSpeed").value = pipeSpeed;
  document.getElementById("settingsGravity").value = gravity;
  document.getElementById("settingsGapPosition").value = gapPosition;
  document.getElementById("settingsGapSize").value = gapSize;
  document.getElementById("settingsFlapPower").value = flapPower;
  document.getElementById("settingsBirdWidth").value = birdWidth;
  document.getElementById("settingsBirdHeight").value = birdHeight;
  document.getElementById("settingsPipeFrequency").value = pipeFrequency;
}

function draw() {
  if (!isPaused) {
    time++;
    if (time % pipeFrequency === 0) {
      pipes.push(
        new Pipe(
          pipeWidth,
          gapSize,
          getRandomArbitrary(-gapPosition, gapPosition),
          pipeSpeed
        )
      );
    }
    background(51);

    document.getElementById("score").textContent =
      "Score: " + population.getBestScore();
    document.getElementById("generation").textContent =
      "Generation: " + population.generation;
    document.getElementById("alive").textContent =
      "Alive: " + population.getAlive();
    pipes.forEach((pipe) => {
      pipe.move();
      pipe.show();
    });
    if (!population.done()) {
      population.updateAlive(showVision);
    } else {
      pipes = [];
      time = 0;
      pipes.push(
        new Pipe(
          pipeWidth,
          gapSize,
          getRandomArbitrary(-gapPosition, gapPosition),
          pipeSpeed
        )
      );
      population.naturalSelection();
      population.updatePipes(pipes);
    }
  }

  if (isFirstDraw) {
    background(51);
    isFirstDraw = false;
  }
}

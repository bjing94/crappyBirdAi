const genomeInputsN = 5; // distanceX, distanceTop, distanceBottom
const genomeOutputsN = 1; // flap or not

//The interface between our
//NeuralNetwork and the game
class Player {
  constructor(width, height, pipes, gravity, flapPower) {

    this.width = width;
    this.height = height;
    this.gravity = gravity;
    this.flapPower = flapPower;
    this.score = 1;
    this.timeSurvived = 0;

    this.pipes = pipes;

    this.x = 50;
    this.y = 350;
    this.velocity = 0;

    this.brain = new Genome(genomeInputsN, genomeOutputsN);
    this.fitness = 0;
    this.lifespan = 0;
    this.dead = false;
    this.decisions = []; //Current Output values
    this.vision = []; //Current input values

    this.nextPipe = {
      x: 700,
      topY: 0,
      bottomY: 0,
    };

    this.ceiling = 0;
    this.floor = 700;
  }

  flap() {
    this.velocity = this.flapPower;
  }

  clone() {
    //Returns a copy of this player
    let clone = new Player(
      this.width,
      this.height,
      this.pipes,
      this.gravity,
      this.flapPower
    );
    clone.brain = this.brain.clone();
    return clone;
  }

  crossover(parent) {
    //Produce a child
    let child = new Player(
      this.width,
      this.height,
      this.pipes,
      this.gravity,
      this.flapPower
    );
    if (parent.fitness < this.fitness)
      child.brain = this.brain.crossover(parent.brain);
    else child.brain = parent.brain.crossover(this.brain);

    child.brain.mutate();
    return child;
  }

  calculateFitness() {
    this.fitness = this.score * 5000 + this.timeSurvived;
  }

  look() {
    this.vision = [
      this.y - this.ceiling,
      this.floor - this.y,
      this.nextPipe.x - this.x,
      this.y - this.nextPipe.topY,
      this.nextPipe.bottomY - this.y,
    ];
  }

  think() {
    this.decisions = this.brain.feedForward(this.vision);
  }

  move() {
    if (this.decisions[0] > 0.5) {
      this.flap();
    }
    if (this.velocity <= 7) {
      this.velocity += this.gravity;
    }

    if (this.y < 0) {
      this.velocity = 0;
      this.dead = true;
    }

    if (this.y > 700) {
      this.velocity = 0;
      this.dead = true;
    }
    // console.log(this.pipes.length);
    this.pipes.forEach((pipe) => {
      if (
        pipe.collides({
          x: this.x,
          y: this.y,
          width: this.width,
          height: this.height,
        })
      ) {
        this.dead = true;
      }

      if (!pipe.isPassed) {
        if (this.x > pipe.x + 220) {
          pipe.isPassed = true;
          this.score += 1;
        }
      }
    });

    if (!this.dead) {
      let pipesFound = this.pipes.filter((pipe) => {
        return !pipe.isPassed && pipe.x > this.x + this.width;
      });
      if (pipesFound.length > 0) {
        this.nextPipe = pipesFound[0];
      } else {
        this.nextPipe = {
          x: 600,
          topY: 0,
          bottomY: 700,
        };
      }

      let currentPipes = this.pipes.filter((pipe) => {
        return (
          pipe.x <= this.x + this.width &&
          pipe.x + pipe.width >= this.x + this.width
        );
      });

      if (currentPipes.length > 0) {
        this.ceiling = currentPipes[0].topY;
        this.floor = currentPipes[0].bottomY;
      } else {
        this.ceiling = 0;
        this.floor = 700;
      }
      this.y += this.velocity;
    }
  }

  show(showVision) {
    stroke(0, 0, 0);
    fill(255, 255, 255);
    rect(this.x, this.y, this.width, this.height);
    if (showVision) {
      this.drawVision();
    }
  }

  drawVision() {
    stroke(0, 255, 0);
    line(this.x, this.y, this.nextPipe.x, this.nextPipe.topY);
    line(this.x, this.y, this.nextPipe.x, this.nextPipe.bottomY);
    stroke(255, 0, 0);
    line(this.x, this.y, this.x, this.ceiling);
    stroke(255, 124, 0);
    line(this.x, this.y + this.height, this.x, this.floor);
  }
}

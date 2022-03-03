let bestPlayer;
let bestFitness = 0;

//The Population Class
//Here is where the power of all the classes
//comes together to destroy the game score records

class Population {
  constructor(size, width, height, pipes, gravity, flapPower) {
    this.population = [];

    this.generation = 0;
    this.matingPool = [];
    this.pipes = pipes;
    this.flapPower = flapPower;

    for (let i = 0; i < size; i++) {
      this.population.push(
        new Player(width, height, this.pipes, gravity, this.flapPower)
      );
      this.population[i].brain.generateNetwork();
      this.population[i].brain.mutate();
    }
  }

  updateAlive(showVision) {
    for (let i = 0; i < this.population.length; i++) {
      if (!this.population[i].dead) {
        this.population[i].timeSurvived++; // get new info
        this.population[i].look(); // get new info
        this.population[i].think(); // analyze through NEAT
        this.population[i].move(); // change position base on info
        this.population[i].show(showVision); // change position base on info
      }
    }
  }

  done() {
    for (let i = 0; i < this.population.length; i++) {
      if (!this.population[i].dead) {
        return false;
      }
    }

    return true;
  }

  naturalSelection() {
    this.calculateFitness();

    let averageSum = this.getAverageScore();
    console.log(averageSum);
    let children = [];

    this.fillMatingPool();
    for (let i = 0; i < this.population.length; i++) {
      let parent1 = this.selectPlayer();
      let parent2 = this.selectPlayer();
      if (parent1.fitness > parent2.fitness)
        children.push(parent1.crossover(parent2));
      else children.push(parent2.crossover(parent1));
    }

    this.population.splice(0, this.population.length);
    this.population = children.slice(0);
    this.generation++;
    this.population.forEach((element) => {
      element.brain.generateNetwork();
    });

    console.log("Generation " + this.generation);
  }

  calculateFitness() {
    let currentMax = 0;
    this.population.forEach((element) => {
      element.calculateFitness();
      if (element.fitness > bestFitness) {
        bestFitness = element.fitness;
        bestPlayer = element.clone();
        bestPlayer.brain.id = "BestGenome";
        bestPlayer.brain.draw(250, 250);
      }

      if (element.fitness > currentMax) currentMax = element.fitness;
    });

    //Normalize
    this.population.forEach((element, elementN) => {
      element.fitness /= currentMax;
    });
  }

  fillMatingPool() {
    this.matingPool.splice(0, this.matingPool.length);
    this.population.forEach((element, elementN) => {
      let n = element.fitness * 100;
      for (let i = 0; i < n; i++) this.matingPool.push(elementN);
    });
  }

  selectPlayer() {
    let rand = Math.floor(Math.random() * this.matingPool.length);
    return this.population[this.matingPool[rand]];
  }

  getAverageScore() {
    let avSum = 0;
    this.population.forEach((element) => {
      avSum += element.score;
    });

    return avSum / this.population.length;
  }

  getBestScore() {
    let max = 0;
    this.population.forEach((player) => {
      if (player.score > max) {
        max = player.score;
      }
    });

    return max;
  }

  updatePipes(newPipes) {
    this.pipes = newPipes;
    this.population.forEach((element) => {
      element.pipes = this.pipes;
    });
  }

  getAlive() {
    let res = 0;
    this.population.forEach((player) => {
      if (player.dead === false) {
        res++;
      }
    });

    return res;
  }
}

const canvasWidth = 800;
const canvasHeight = 600;
const boidCount = 400;
var frameRateCounter;
var boids;

const BoidPassingMethod = {
  PassWholeArray: 1,
  PassHigherOrderFilterFilteredArray: 2,
  PassFixedSizeFilteredArray: 3,
  PassGrowingFilteredArray: 4,
  UseGlobalArray: 5
};

var boidPassingMethodRadioButton, boidPassingMethod;
var filterInFlockCheckbox, filterInFlock;
var resetFrameRateCounterButton;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRateCounter = new FrameRateCounter(200);
  setupUI();
  boids = [];
  let groups = [
    {
      color: color(255, 0, 0),
      size: 5,
      flockDistance: 100,
      dragCoefficient: 0.6,
      thrust: 0.2,
      separationLimit: 1,
      fieldOfView: PI / 4.0
    },
    {
      color: color(0, 0, 255),
      size: 10,
      flockDistance: 200,
      dragCoefficient: 1,
      thrust: 0.3,
      separationLimit: 1,
      fieldOfView: PI / 4
    },
    {
      color: color("yellow"),
      size: 3,
      flockDistance: 100,
      dragCoefficient: 0.1,
      thrust: 0.3,
      separationLimit: 1,
      fieldOfView: PI / 8.0
    }
  ];
  for (let i = 0; i < boidCount; ++i) {
    if (random() > 0.95) {
      boids.push(new Boid(groups[1]));
    }
    else if (random() > 0.6) {
      boids.push(new Boid(groups[0]));
    }
    else if (random() > 0) {
      boids.push(new Boid(groups[2]));
    }
  }
}

function draw() {
  background(240, 244, 255);
  updateUIValues();
  for (let boid of boids) {
    if (boidPassingMethod == BoidPassingMethod.PassWholeArray) {
      boid.flock(boids);
    }
    else if (boidPassingMethod == BoidPassingMethod.PassHigherOrderFilterFilteredArray) {
      boid.flock(boids.filter(
        b => b.position.x >= boid.position.x - boid.group.flockDistance &&
        b.position.x <= boid.position.x + boid.group.flockDistance &&
        b.position.y >= boid.position.y - boid.group.flockDistance &&
        b.position.y <= boid.position.y + boid.group.flockDistance));
    }
    else if (boidPassingMethod == BoidPassingMethod.PassFixedSizeFilteredArray) {
      let filteredBoids = new Array(boids.length);
      let currentIndex = 0;
      for (let i = 0; i < boids.length; ++i) {
        if (boids[i].position.x >= boid.position.x - boid.group.flockDistance &&
            boids[i].position.x <= boid.position.x + boid.group.flockDistance &&
            boids[i].position.y >= boid.position.y - boid.group.flockDistance &&
            boids[i].position.y <= boid.position.y + boid.group.flockDistance) {
          filteredBoids[currentIndex] = boids[i];
          currentIndex++;
        }
      }
      boid.flock(filteredBoids);
    }
    else if (boidPassingMethod == BoidPassingMethod.PassGrowingFilteredArray) {
      let filteredBoids = [];
      for (let i = 0; i < boids.length; ++i) {
        if (boids[i].position.x >= boid.position.x - boid.group.flockDistance &&
            boids[i].position.x <= boid.position.x + boid.group.flockDistance &&
            boids[i].position.y >= boid.position.y - boid.group.flockDistance &&
            boids[i].position.y <= boid.position.y + boid.group.flockDistance) {
          filteredBoids.push(boids[i]);
        }
      }
      boid.flock(filteredBoids);
    }
    else if (boidPassingMethod == BoidPassingMethod.UseGlobalArray) {
      boid.flock(null);
    }
    boid.update();
    boid.show();
    boid.clearForces();
  }
  frameRateCounter.update();
  frameRateCounter.show();
}
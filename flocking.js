const canvasWidth = 1200;
const canvasHeight = 900;
const boidCount = 500;
var frameRateCounter;
var boids;

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
  let quadTree = new QuadTree(new Rectangle(0, 0, canvasWidth, canvasHeight), 5);
  for (let boid of boids) {
    quadTree.insert(boid);
    let rectangle = new Rectangle(boid.position.x - boid.group.flockDistance,
                                  boid.position.y - boid.group.flockDistance,
                                  boid.group.flockDistance * 2,
                                  boid.group.flockDistance * 2);
    let filteredBoids = quadTree.query(rectangle);
    boid.flock(filteredBoids);
    boid.update();
    boid.show();
    boid.clearForces();
  }
  frameRateCounter.update();
  frameRateCounter.show();
}
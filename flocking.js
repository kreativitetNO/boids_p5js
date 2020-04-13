/*

This is the base version of my Boids implementation which is heavily inspired by Daniel Shiffman's YouTube video (https://www.youtube.com/watch?v=mhjuuHl6qHM). The code needs some refactoring for both legability and performance. See the rest of the collection (https://editor.p5js.org/kreativitetNO/collections/NuiQu7V9P) and read the comments at the start of each flocking.js file.

In this iteration I have implemented a frame counter and some radio buttons to see which is the best way of passing the boids collection to the flock algorithm. The choices are:
- Pass the whole array as a parameter
- Pass a filtered array created using Array.filter() as a parameter
- Pass a filtered array that is created as large as the boids array
- Pass a filtered array that grows using push
- Use the global boids array

There is also a button that allows you to turn on filtering in the actual flock() method.

Testing is difficult because the way the boids are spread. But if you reset the frame counter and let it run for a while, you get a good indication of the lower/upper frame rates for each setup.

The filter is pretty simple. It just checks which boids x/y coordinates are larger than the current boids x/y +/- the flockDistance. The filter is implemented in 2 different ways. In the filtered array algorithms, a new array is created with boids that are within the filter limits. In the flock function, the for-loop skips boids based on the same criteria, but doesn't create an array.

Filtering the boids to a new array is the slowest. The Array.filter() function is the slowest. The fixed size array and growing filtered array are similar to each other in my browser, but that could be due to some optimization or just the fact that the memory allocation is a negligable part of simulation.

Don't make the mistake of never using Array.filter() or the other higher order functions just because they are slower. They are still relatively fast, and they are very concise and easy to read. A tidily written and well set up good algorithm will almost always out-perform a messy algorithm. Some experts go as far to say that your priorities should be ordered as follows:
1. Your code is correct
2. Your code is tidy and maintainable
3. Your code is fast

Passing the whole array or using the global array produce nearly identical results. This is because JavaScript - like Java - passes anything more complex than a simple number or other type as a reference. So the Array is never copied to the flock() method. The parameter value is simply a reference to the original. This is called "pass by reference". Simple types are "passed by value". Be aware that this means that changes you make to the boid array in the flock() will change the array on the outside, and vica verca if you pass a simple integer or the likes.

An aside is that we generally don't want any global variables (variables outside of functions in the so-called "global namespace") when we program. Global variables make code hard to isolate and test independentally. It also increases the likelihood of you one day trying to create your own variable with the same name as a global variable that someone else has created (in some library) you're using, and the bugs can be outrageously hard to detect.

The way p5.js works makes the previous advice a bit trickier to follow, but keep it in mind. 

Things to note:

When calculating the alignment and cohesion forces, Daniel divides the sum of the vectors by the number of vectors to get an average. I don't. The reason is that the sum and average of vectors are often interchangeable (See http://www.analytictech.com/mb876/handouts/notes_on_vectors.htm). The only difference will be the magnitude, but since I'm normalizing the forces anyway the scale is irrelevant. In a scenario where you want the boids to move faster relative to their distance away, you would most likely want the average instead.

In the next iteration, I will remove the slower array methods and try to avoid global variables. Note that global constants are considered much less evil than global variables.

*/

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
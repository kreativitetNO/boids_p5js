# Boids

This project is a [boids](https://en.wikipedia.org/wiki/Boids) implementation in p5.js, and is heavily inspired  by Daniel Shiffman's [YouTube video](https://www.youtube.com/watch?v=mhjuuHl6qHM).

The repository is tagged with different version numbers for each iteration. The versions are as follows:

## 2.0

Implemented QuadTree and massively improved framerate.

## 1.0

In this iteration I have implemented a frame counter and some radio buttons to see which is the best way of passing the boids collection to the flock algorithm. The choices are:
- Pass the whole array as a parameter
- Pass a filtered array created using Array.filter() as a parameter
- Pass a filtered array that is created as large as the boids array
- Pass a filtered array that grows using push
- Use the global boids array

There is also a button that allows you to turn on filtering in the actual flock() method.

Performance testing is difficult because the dynamics of the boids. But if you reset the frame counter and let it run for a while, you get a good indication of the lower/upper frame rates for each setup.

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

When calculating the alignment and cohesion forces, Daniel divides the sum of the vectors by the number of vectors to get an average. I don't. The reason is that the sum and average of vectors are [often interchangeable](http://www.analytictech.com/mb876/handouts/notes_on_vectors.htm). The only difference will be the magnitude, but since I'm normalizing the forces anyway the scale is irrelevant. In a scenario where you want the boids to move faster relative to their distance away, you would most likely want the average instead.

In the next iteration, I will remove the slower array methods and try to avoid global variables. Note that global constants are considered much less evil than global variables.

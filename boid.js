class Boid {
  constructor(group) {
    this.group = group;
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(this.group.maxSpeed));
    this.acceleration = createVector();
    this.alignmentForce = createVector();
    this.cohesionForce = createVector();
    this.separationForce = createVector();
  }
  
  drawBoid(x, y, angle) {
    fill(this.group.color);
    stroke(0);
    beginShape();
    vertex(x + cos(angle - HALF_PI - QUARTER_PI) * this.group.size, y + sin(angle - HALF_PI - QUARTER_PI) * this.group.size);
    vertex(x + cos(angle) * 2 * this.group.size, y + sin(angle) * 2 * this.group.size);
    vertex(x + cos(angle + HALF_PI + QUARTER_PI) * this.group.size, y + sin(angle + HALF_PI + QUARTER_PI) * this.group.size);
    endShape(CLOSE);
  }
  
  drawForce(force, r, g, b) {
    stroke(r, g, b);
    force.mult(100);
    line(this.position.x, this.position.y,
         this.position.x + force.x,
         this.position.y + force.y);
  }

  flock(others) {
    let separationForce = createVector();
    let alignmentForce = createVector();
    let averagePosition = createVector();
    let neighbourCount = 0;
    let separationCount = 0;
    for (let other of (others || boids)) {
      if (other === this) continue;
      if (other === undefined) continue;
      if (filterInFlock) {
        if (other.position.x < this.position.x - this.group.flockDistance) continue;
        if (other.position.x > this.position.x + this.group.flockDistance) continue;
        if (other.position.y < this.position.y - this.group.flockDistance) continue;
        if (other.position.y > this.position.y + this.group.flockDistance) continue;
      }
      let toOther = p5.Vector.sub(this.position, other.position);
      let distanceToOther = toOther.mag();
      if (distanceToOther <= this.group.flockDistance) {
        if (abs(toOther.angleBetween(this.velocity)) < this.group.fieldOfView)               {
          alignmentForce.add(other.velocity);
          averagePosition.add(other.position);
          neighbourCount++;
        }
        if (distanceToOther > 0 && distanceToOther < this.group.size * 2) {
          let separation = p5.Vector.sub(this.position, other.position);
          separation.setMag(1.0/distanceToOther);
          separationForce.add(separation);
          separationCount++;
        }
      }
    }
    if (neighbourCount > 0) {
      averagePosition.div(neighbourCount);
      let cohesionForce = p5.Vector.sub(averagePosition, this.position);
      cohesionForce.normalize();
      this.cohesionForce = cohesionForce.copy();
      alignmentForce.normalize();
      this.alignmentForce = alignmentForce.copy();
    }
    if (separationCount > 0) {
      this.separationForce = separationForce.copy();
    }
  }
  
  show() {
    this.drawBoid(this.position.x, this.position.y, this.velocity.heading());
//    this.drawForce(this.alignmentForce, 255, 0, 0);
//    this.drawForce(this.cohesionForce, 0, 255, 0);
//    this.drawForce(this.separationForce, 0, 0, 255);
  }
  
  update() {
    this.acceleration.add(this.cohesionForce);
    this.acceleration.add(this.alignmentForce);
    this.acceleration.add(this.separationForce);
    this.acceleration.add(this.velocity.copy().setMag(this.group.thrust));
    this.acceleration.limit(this.group.thrust);
    this.acceleration.add(this.velocity.copy().setMag(-0.1 * this.velocity.magSq() * this.group.dragCoefficient));
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    if (this.position.x < 0) {
      this.position.x = canvasWidth - 1;
    }
    else if (this.position.x >= canvasWidth) {
      this.position.x = 0;
    }
    if (this.position.y < 0) {
      this.position.y = canvasHeight - 1;
    }
    else if (this.position.y >= canvasHeight) {
      this.position.y = 0;
    }
  }
  
  clearForces() {
    this.acceleration.mult(0);
    this.cohesionForce.mult(0);
    this.alignmentForce.mult(0);
    this.separationForce.mult(0);
  }
}
function testForAABB(bounds1, bounds2) {
  return (
    bounds1.x < bounds2.x + bounds2.width &&
    bounds1.x + bounds1.width > bounds2.x &&
    bounds1.y < bounds2.y + bounds2.height &&
    bounds1.y + bounds1.height > bounds2.y
  );
}

class Pipe {
  constructor(width, gap, gapY, speed) {
    this.x = 600;
    this.y = 0;
    this.deleted = false;
    this.isPassed = false;
    this.gap = gap;
    this.gapY = gapY;
    this.speed = speed;

    this.topY = 300 + this.gapY / 2;
    this.bottomY = 400 + this.gap + this.gapY / 2;
    this.width = width;
  }

  move() {
    console.log(this.speed);
    this.x -= this.speed;
  }

  show() {
    stroke(0, 0, 0);
    fill(255, 255, 255);
    rect(this.x, this.y, this.width, this.topY);
    rect(this.x, this.bottomY, this.width, 700 - this.bottomY);
  }

  collides(bounds) {
    const topBounds = {
      x: this.x,
      y: this.y,
      height: this.topY,
      width: this.width,
    };
    const bottomBounds = {
      x: this.x,
      y: this.bottomY,
      height: 700 - this.bottomY,
      width: this.width,
    };

    return testForAABB(topBounds, bounds) || testForAABB(bottomBounds, bounds);
  }
}

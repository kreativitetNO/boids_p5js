class FrameRateCounter {
  // calculates rolling average based on "smoothingArraySize" last readings
  constructor(smoothingArraySize = 20) {
    this.smoothingArraySize = smoothingArraySize;
    this.arrayIndex = 0;
    this.smoothingArray = Array(smoothingArraySize);
    this.minFrameRate = Infinity;
    this.maxFrameRate = -Infinity;
    this.showFrameRate = false; // Hide until smoothing array is filled
    this.averageFrameRate = 0;
  }
  
  reset() {
    this.showFrameRate = false;
    this.arrayIndex = 0;
    this.minFrameRate = Infinity;
    this.maxFrameRate = -Infinity;
  }
  
  update() {
    if (this.showFrameRate) {
      this.averageFrameRate = this.smoothingArray.reduce(
        (acc, val) => acc + val) / this.smoothingArraySize;
      this.maxFrameRate = Math.max(this.averageFrameRate, this.maxFrameRate);
      this.minFrameRate = Math.min(this.averageFrameRate, this.minFrameRate);
    }
    this.smoothingArray[this.arrayIndex] = getFrameRate();
    this.arrayIndex++;
    if (this.arrayIndex >= this.smoothingArraySize) {
      this.arrayIndex = 0;
      this.showFrameRate = true;
    }
  }
  
  show() {
    if (!this.showFrameRate) return;
    fill(255, 0, 0);
    noStroke();
    text(this.averageFrameRate.toFixed(2) + " ( " +
         this.minFrameRate.toFixed(2) + ", " +
         this.maxFrameRate.toFixed(2) + ")", 20, 20);
  }
}
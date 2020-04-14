function setupUI() {
  resetFrameRateCounterButton = createButton('Reset Frame Rate Counter');
  resetFrameRateCounterButton.mousePressed(resetFrameCounter);
}

function updateUIValues() {
}

function resetFrameCounter() {
  frameRateCounter.reset();
}
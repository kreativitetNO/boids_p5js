function setupUI() {
  boidPassingMethodRadioButton = createRadio();
  boidPassingMethodRadioButton.option('Pass whole array',
                                BoidPassingMethod.PassWholeArray);
  boidPassingMethodRadioButton.option('Pass higher order filter filtered array',
                                BoidPassingMethod.PassHigherOrderFilterFilteredArray);
  boidPassingMethodRadioButton.option('Pass fixed size filtered array',
                                BoidPassingMethod.PassFixedSizeFilteredArray);
  boidPassingMethodRadioButton.option('Pass growing filtered array',
                                BoidPassingMethod.PassGrowingFilteredArray);
  boidPassingMethodRadioButton.option('Use global array',
                                BoidPassingMethod.UseGlobalArray);
  boidPassingMethodRadioButton.selected('1');
  
  filterInFlockCheckbox = createCheckbox('Filter in flock method');
  
  resetFrameRateCounterButton = createButton('Reset Frame Rate Counter');
  resetFrameRateCounterButton.mousePressed(resetFrameCounter);
}

function updateUIValues() {
  boidPassingMethod = boidPassingMethodRadioButton.value();
  filterInFlock = filterInFlockCheckbox.checked();
}

function resetFrameCounter() {
  frameRateCounter.reset();
}
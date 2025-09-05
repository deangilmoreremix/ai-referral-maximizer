import React from 'react';

interface OnboardingTourProps {
  isFirstVisit: boolean;
  onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isFirstVisit, onComplete }) => {
  // Immediately complete the tour if it's first visit
  if (isFirstVisit) {
    // This ensures no tour or tooltips are shown
    setTimeout(() => {
      onComplete();
    }, 0);
  }
  
  // Return empty fragment - no tour or tooltips will be rendered
  return <></>;
};

export default OnboardingTour;
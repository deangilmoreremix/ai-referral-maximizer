import React from 'react';

export interface TourStep {
  target: string; // CSS selector
  title: string;
  content: React.ReactNode;
  position: 'top' | 'right' | 'bottom' | 'left';
  spotlightPadding?: number;
  disableOverlay?: boolean;
  image?: string;
  action?: () => void;
}

interface GuidedTourProps {
  steps: TourStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  initialStep?: number;
}

// Simplified component that does nothing - no tour will be shown
const GuidedTour: React.FC<GuidedTourProps> = ({ 
  isActive, 
  onComplete, 
  onSkip
}) => {
  // Auto-complete the tour immediately if it's active
  if (isActive) {
    setTimeout(onComplete, 0);
  }
  
  // Return empty fragment - nothing will be rendered
  return <></>;
};


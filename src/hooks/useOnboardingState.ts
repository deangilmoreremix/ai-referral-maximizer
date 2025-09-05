import { useState, useEffect } from 'react';

interface OnboardingState {
  isFirstVisit: boolean;
  hasCompletedTour: boolean;
}

const initialState: OnboardingState = {
  isFirstVisit: true,
  hasCompletedTour: false
};

export const useOnboardingState = () => {
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load onboarding state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('onboardingState');
      if (savedState) {
        setOnboardingState(JSON.parse(savedState));
      } else {
        // If no saved state, initialize with first visit true
        setOnboardingState(initialState);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading onboarding state:', error);
      setOnboardingState(initialState);
      setIsLoaded(true);
    }
  }, []);

  // Save onboarding state to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('onboardingState', JSON.stringify(onboardingState));
    }
  }, [onboardingState, isLoaded]);

  // Handlers for updating onboarding state
  const completeTour = () => {
    setOnboardingState(prevState => ({
      ...prevState,
      isFirstVisit: false,
      hasCompletedTour: true
    }));
  };

  const resetOnboarding = () => {
    setOnboardingState(initialState);
  };

  return {
    isFirstVisit: onboardingState.isFirstVisit,
    hasCompletedTour: onboardingState.hasCompletedTour,
    isLoaded,
    completeTour,
    resetOnboarding
  };
};
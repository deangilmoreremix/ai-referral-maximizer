import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useOnboardingState } from '../hooks/useOnboardingState';
import { useTooltipManager } from '../hooks/useTooltipManager';
import { TourStep } from './TooltipSystem/GuidedTour';
import OnboardingTour from './OnboardingTour';

interface OnboardingContextType {
  isFirstVisit: boolean;
  hasCompletedTour: boolean;
  hasDismissedTooltips: Record<string, boolean>;
  completeTour: () => void;
  dismissTooltip: (tooltipId: string) => void;
  resetOnboarding: () => void;
  activeTooltip: string | null;
  showTooltip: (id: string) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: ReactNode;
}

// Define tour steps for guided tour
const tourSteps: TourStep[] = [
  {
    target: '.content-types-container',
    title: 'Select Referral Method',
    content: 'Start by choosing the type of referral method you want to generate. Browse through categories to find exactly what you need for your referral generation strategy.',
    position: 'top',
    disableBeacon: true,
  },
  {
    target: '.personalize-button-container',
    title: 'Personalize Content',
    content: 'Click here to personalize your content generation. You can enter industry details, upload company documents, or even analyze LinkedIn profiles for better results.',
    position: 'bottom',
  },
  {
    target: '.help-docs-button-container',
    title: 'Documentation & Help',
    content: 'Need help? Click here to access comprehensive documentation on all features, including step-by-step guides on using the platform efficiently.',
    position: 'bottom',
  },
  {
    target: '.categories-selector-container',
    title: 'Filter by Category',
    content: 'Filter referral methods by category to quickly find what you need for specific outreach objectives.',
    position: 'bottom',
  }
];

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const {
    isFirstVisit,
    hasCompletedTour,
    isLoaded: onboardingLoaded,
    completeTour,
    resetOnboarding
  } = useOnboardingState();

  const {
    activeTooltip,
    dismissedTooltips,
    showTooltip,
    dismissTooltip: dismissTooltipFromManager,
    isLoaded: tooltipsLoaded,
    resetTooltips
  } = useTooltipManager();

  // Reset tooltips if tour is reset
  useEffect(() => {
    if (isFirstVisit && !hasCompletedTour && onboardingLoaded && tooltipsLoaded) {
      resetTooltips();
    }
  }, [isFirstVisit, hasCompletedTour, onboardingLoaded, tooltipsLoaded, resetTooltips]);

  // Only render children once all state has loaded
  if (!onboardingLoaded || !tooltipsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Extended reset function to reset both systems
  const handleResetOnboarding = () => {
    resetOnboarding();
    resetTooltips();
  };

  return (
    <OnboardingContext.Provider
      value={{
        isFirstVisit,
        hasCompletedTour,
        hasDismissedTooltips: dismissedTooltips,
        completeTour,
        dismissTooltip: dismissTooltipFromManager,
        resetOnboarding: handleResetOnboarding,
        activeTooltip,
        showTooltip
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
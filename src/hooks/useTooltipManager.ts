import { useState, useEffect } from 'react';

interface TooltipState {
  tooltipId: string | null;
  tooltips: Record<string, boolean>; // track dismissed state
  hasShownInitialTooltips: boolean;
  sequence: string[];
}

const initialState: TooltipState = {
  tooltipId: null, // Currently shown tooltip
  tooltips: {},    // Dismissed state
  hasShownInitialTooltips: true, // Set to true to prevent initial tooltips
  sequence: [] // Empty sequence
};

export const useTooltipManager = () => {
  const [tooltipState, setTooltipState] = useState<TooltipState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('tooltipState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Force all tooltips to be dismissed
        const allDismissed = Object.keys(parsedState.tooltips || {}).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as Record<string, boolean>);
        
        setTooltipState({
          ...parsedState,
          tooltipId: null,
          tooltips: allDismissed,
          hasShownInitialTooltips: true
        });
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading tooltip state:', error);
      setIsLoaded(true);
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tooltipState', JSON.stringify(tooltipState));
    }
  }, [tooltipState, isLoaded]);

  // Show tooltip - now a no-op function
  const showTooltip = (id: string) => {
    // Do nothing - tooltips are disabled
  };

  // Dismiss tooltip
  const dismissTooltip = (id: string) => {
    setTooltipState(prev => ({
      ...prev,
      tooltipId: null,
      tooltips: {
        ...prev.tooltips,
        [id]: true
      }
    }));
  };

  // Reset all tooltips
  const resetTooltips = () => {
    setTooltipState({
      ...initialState,
      hasShownInitialTooltips: true
    });
  };

  return {
    activeTooltip: null, // Always return null
    dismissedTooltips: tooltipState.tooltips,
    showTooltip,
    dismissTooltip,
    resetTooltips,
    isLoaded
  };
};
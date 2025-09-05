import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AgencyData {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  website: string;
  specialty: string;
  foundedYear: string;
}

interface AgencyContextType {
  agencyInfo: AgencyData;
  updateAgencyInfo: (data: Partial<AgencyData>) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  generatedContent: Record<string, string>; // Store content by step ID
  saveContent: (stepId: string, content: string) => void;
}

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

export const AgencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [agencyInfo, setAgencyInfo] = useState<AgencyData>({
    name: '',
    ownerName: '',
    email: '',
    phone: '',
    website: '',
    specialty: 'AI Referral Generation',
    foundedYear: new Date().getFullYear().toString()
  });
  
  const [activeStep, setActiveStep] = useState(1);
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  
  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedInfo = localStorage.getItem('agencyInfo');
      if (savedInfo) {
        setAgencyInfo(JSON.parse(savedInfo));
      }
      
      const savedStep = localStorage.getItem('agencyStep');
      if (savedStep) {
        setActiveStep(parseInt(savedStep));
      }
      
      const savedContent = localStorage.getItem('agencyContent');
      if (savedContent) {
        setGeneratedContent(JSON.parse(savedContent));
      }
    } catch (e) {
      console.error("Error loading saved agency data:", e);
    }
  }, []);
  
  // Save info when it changes
  useEffect(() => {
    localStorage.setItem('agencyInfo', JSON.stringify(agencyInfo));
  }, [agencyInfo]);
  
  // Save step when it changes
  useEffect(() => {
    localStorage.setItem('agencyStep', activeStep.toString());
  }, [activeStep]);
  
  // Save content when it changes
  useEffect(() => {
    localStorage.setItem('agencyContent', JSON.stringify(generatedContent));
  }, [generatedContent]);
  
  const updateAgencyInfo = (data: Partial<AgencyData>) => {
    setAgencyInfo(prev => ({ ...prev, ...data }));
  };
  
  const saveContent = (stepId: string, content: string) => {
    setGeneratedContent(prev => ({ ...prev, [stepId]: content }));
  };
  
  return (
    <AgencyContext.Provider value={{
      agencyInfo,
      updateAgencyInfo,
      activeStep,
      setActiveStep,
      generatedContent,
      saveContent
    }}>
      {children}
    </AgencyContext.Provider>
  );
};

const useAgency = () => {
  const context = useContext(AgencyContext);
  if (context === undefined) {
    throw new Error('useAgency must be used within an AgencyProvider');
  }
  return context;
};
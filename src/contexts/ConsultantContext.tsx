import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface ConsultantData {
  name: string;
  expertise: string;
  targetClient: string;
  email: string;
  phone: string;
  website: string;
}

interface ConsultantContextType {
  consultantInfo: ConsultantData;
  updateConsultantInfo: (data: Partial<ConsultantData>) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  generatedContent: Record<string, string>; // Store content by step ID
  saveContent: (stepId: string, content: string) => void;
}

const ConsultantContext = createContext<ConsultantContextType | undefined>(undefined);

export const ConsultantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [consultantInfo, setConsultantInfo] = useState<ConsultantData>({
    name: '',
    expertise: '',
    targetClient: '',
    email: '',
    phone: '',
    website: '',
  });
  
  const [activeStep, setActiveStep] = useState(1);
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  
  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedInfo = localStorage.getItem('consultantInfo');
      if (savedInfo) {
        setConsultantInfo(JSON.parse(savedInfo));
      }
      
      const savedStep = localStorage.getItem('consultantStep');
      if (savedStep) {
        setActiveStep(parseInt(savedStep));
      }
      
      const savedContent = localStorage.getItem('consultantContent');
      if (savedContent) {
        setGeneratedContent(JSON.parse(savedContent));
      }
    } catch (e) {
      console.error("Error loading saved consultant data:", e);
    }
  }, []);
  
  // Save info when it changes
  useEffect(() => {
    localStorage.setItem('consultantInfo', JSON.stringify(consultantInfo));
  }, [consultantInfo]);
  
  // Save step when it changes
  useEffect(() => {
    localStorage.setItem('consultantStep', activeStep.toString());
  }, [activeStep]);
  
  // Save content when it changes
  useEffect(() => {
    localStorage.setItem('consultantContent', JSON.stringify(generatedContent));
  }, [generatedContent]);
  
  const updateConsultantInfo = (data: Partial<ConsultantData>) => {
    setConsultantInfo(prev => ({ ...prev, ...data }));
  };
  
  const saveContent = (stepId: string, content: string) => {
    setGeneratedContent(prev => ({ ...prev, [stepId]: content }));
  };
  
  return (
    <ConsultantContext.Provider value={{
      consultantInfo,
      updateConsultantInfo,
      activeStep,
      setActiveStep,
      generatedContent,
      saveContent
    }}>
      {children}
    </ConsultantContext.Provider>
  );
};

export const useConsultant = () => {
  const context = useContext(ConsultantContext);
  if (context === undefined) {
    throw new Error('useConsultant must be used within a ConsultantProvider');
  }
  return context;
};
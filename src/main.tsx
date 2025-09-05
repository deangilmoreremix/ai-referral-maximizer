import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import LandingPage from './LandingPage.tsx';
import PersonalizationPage from './pages/PersonalizationPage.tsx';
import AISettingsPage from './pages/AISettingsPage.tsx';
import ContentGeneratorPage from './pages/ContentGeneratorPage.tsx';
import SuperContentPage from './pages/SuperContentPage.tsx';
import VoiceSmsPage from './pages/VoiceSmsPage.tsx';
import ConsultantAcceleratorPage from './pages/ConsultantAcceleratorPage.tsx';
import AgencyAcceleratorPage from './pages/AgencyAcceleratorPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import PersonalizationTestPage from './PersonalizationTestPage.tsx';
import ReferralMethodsPage from './ReferralMethodsPage.tsx';
import ChatbotPage from './ChatbotPage.tsx';
import CSVImportPage from './pages/CSVImportPage.tsx';
import PricingPage from './pages/PricingPage.tsx';
import GPT5TestPage from './pages/GPT5TestPage.tsx';
import GuideResourcePage from './pages/resources/GuideResourcePage.tsx';
import ApiResourcePage from './pages/resources/ApiResourcePage.tsx';
import DocumentationResourcePage from './pages/resources/DocumentationResourcePage.tsx';
import TemplatesResourcePage from './pages/resources/TemplatesResourcePage.tsx';
import './index.css';
import { OnboardingProvider } from './components/OnboardingProvider';

// Define the context providers for full app state
import { ConsultantProvider } from './contexts/ConsultantContext';
import { AgencyProvider } from './contexts/AgencyContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OnboardingProvider>
      <ConsultantProvider>
        <AgencyProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/app" element={<ContentGeneratorPage />} />
              <Route path="/personalize" element={<PersonalizationPage />} />
              <Route path="/ai-settings" element={<AISettingsPage />} />
              <Route path="/content-generator" element={<ContentGeneratorPage />} />
              <Route path="/super-creator" element={<SuperContentPage />} />
              <Route path="/voice-sms" element={<VoiceSmsPage />} />
              <Route path="/consultant" element={<ConsultantAcceleratorPage />} />
              <Route path="/agency" element={<AgencyAcceleratorPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/test" element={<PersonalizationTestPage />} />
              <Route path="/referral-methods" element={<ReferralMethodsPage />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/csv-import" element={<CSVImportPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/gpt5-test" element={<GPT5TestPage />} />
              <Route path="/gpt5-test" element={<GPT5TestPage />} />
              <Route path="/resources/guide" element={<GuideResourcePage />} />
              <Route path="/resources/api" element={<ApiResourcePage />} />
              <Route path="/resources/documentation" element={<DocumentationResourcePage />} />
              <Route path="/resources/templates" element={<TemplatesResourcePage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </AgencyProvider>
      </ConsultantProvider>
    </OnboardingProvider>
  </StrictMode>
);
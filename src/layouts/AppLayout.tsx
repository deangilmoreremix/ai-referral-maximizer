import React, { ReactNode } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import AdminControls from '../components/AdminControls';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  navCurrent: 'app' | 'methods' | 'chatbot' | 'dashboard' | 'super' | 'landing' | 'pricing' | 'consultant' | 'agency' | 'personalize' | 'ai-settings';
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  title, 
  description, 
  navCurrent 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Nav current={navCurrent} />
      
      <main className="flex-grow py-6 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="text-gray-600 mt-1">{description}</p>
            )}
          </div>
          
          {children}
        </div>
      </main>
      
      <Footer />
      <AdminControls isVisible={true} />
    </div>
  );
};

export default AppLayout;
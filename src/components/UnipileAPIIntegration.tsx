import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertCircle, X, RefreshCw, Link, Plus } from 'lucide-react';

// Integration status component
interface IntegrationStatusProps {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  serviceName: string;
  lastSync?: Date;
  errorMessage?: string;
  onRetry?: () => void;
}

const IntegrationStatus: React.FC<IntegrationStatusProps> = ({
  status,
  serviceName,
  lastSync,
  errorMessage,
  onRetry
}) => {
  // Get status colors
  const getStatusColors = () => {
    switch(status) {
      case 'connected':
        return {
          bg: 'bg-gradient-to-r from-green-50 to-green-100',
          border: 'border-green-200',
          iconBg: 'bg-green-100',
          text: 'text-green-800'
        };
      case 'connecting':
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-blue-100',
          border: 'border-blue-200',
          iconBg: 'bg-blue-100',
          text: 'text-blue-800'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-red-100',
          border: 'border-red-200',
          iconBg: 'bg-red-100',
          text: 'text-red-800'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-50 to-gray-100',
          border: 'border-gray-200',
          iconBg: 'bg-gray-100',
          text: 'text-gray-800'
        };
    }
  };

  const colors = getStatusColors();
  
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
      <div className={`p-4 flex justify-between items-center ${colors.bg} border-b ${colors.border}`}>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full ${colors.iconBg} flex items-center justify-center mr-3`}>
            {status === 'connected' && <CheckCircle size={18} className="text-green-600" />}
            {status === 'connecting' && <RefreshCw size={18} className="text-blue-600 animate-spin" />}
            {status === 'error' && <AlertCircle size={18} className="text-red-600" />}
            {status === 'disconnected' && <X size={18} className="text-gray-400" />}
          </div>
          <span className={`font-medium ${colors.text}`}>{serviceName}</span>
        </div>
        
        <div>
          {status === 'connected' && lastSync && (
            <span className="text-xs text-gray-600 bg-white/60 py-1 px-2 rounded-full">Last synced: {lastSync.toLocaleString()}</span>
          )}
          
          {status === 'disconnected' && (
            <button 
              className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-md hover:from-blue-600 hover:to-blue-700 shadow-sm"
              onClick={onRetry}
            >
              Connect
            </button>
          )}
          
          {status === 'error' && (
            <button 
              className="text-xs bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-md hover:from-red-600 hover:to-red-700 shadow-sm"
              onClick={onRetry}
            >
              Retry
            </button>
          )}
        </div>
      </div>
      
      {status === 'error' && errorMessage && (
        <div className="px-4 py-2 bg-red-50 text-xs text-red-700">
          {errorMessage}
        </div>
      )}
      
      {status === 'connected' && (
        <div className="px-4 py-2 text-xs text-indigo-600 bg-indigo-50 border-t border-indigo-100">
          All features available
        </div>
      )}
    </div>
  );
};

// Main Unipile API integration component
interface UnipileAPIIntegrationProps {
  onIntegrationComplete?: () => void;
}

const UnipileAPIIntegration: React.FC<UnipileAPIIntegrationProps> = ({ onIntegrationComplete }) => {
  const [socialAccounts, setSocialAccounts] = useState<{
    id: string;
    service: string;
    username: string;
    connected: boolean;
    lastSync?: Date;
    error?: string;
  }[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newService, setNewService] = useState('facebook');
  
  // Load existing API key and connections
  useEffect(() => {
    const loadSavedConfig = () => {
      try {
        // For demo purposes, we'll simulate loading from localStorage
        const savedKey = localStorage.getItem('unipile_api_key');
        if (savedKey) {
          setSavedApiKey(savedKey);
          setApiKey(savedKey);
        }
        
        // Simulate loading existing connections
        setTimeout(() => {
          setSocialAccounts([
            { 
              id: '1', 
              service: 'facebook', 
              username: 'YourBusinessPage', 
              connected: true, 
              lastSync: new Date(Date.now() - 3600000) // 1 hour ago
            },
            { 
              id: '2', 
              service: 'twitter', 
              username: 'YourTwitterHandle', 
              connected: true, 
              lastSync: new Date(Date.now() - 7200000) // 2 hours ago
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading Unipile configuration:', error);
        setIsLoading(false);
      }
    };
    
    loadSavedConfig();
  }, []);
  
  // Simulate checking connection status
  const checkConnectionStatus = useCallback(async () => {
    if (!savedApiKey) return;
    
    try {
      setIsLoading(true);
      
      // In a real implementation, this would call the Unipile API
      // For demo, we'll simulate a successful connection check
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update account statuses
      setSocialAccounts(prev => prev.map(account => ({
        ...account,
        connected: true,
        lastSync: new Date()
      })));
      
      setSuccessMessage('Connection verified successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Notify parent component
      if (onIntegrationComplete) {
        onIntegrationComplete();
      }
    } catch (error: any) {
      setErrorMessage(`Error verifying connection: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [savedApiKey, onIntegrationComplete]);
  
  // Save API key
  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      setErrorMessage('API key is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real implementation, this would validate the API key with Unipile
      // For demo, we'll simulate a successful API key validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save the API key
      localStorage.setItem('unipile_api_key', apiKey);
      setSavedApiKey(apiKey);
      
      setSuccessMessage('API key saved successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Check connection status
      checkConnectionStatus();
    } catch (error: any) {
      setErrorMessage(`Error saving API key: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Connect new account
  const connectNewAccount = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would initiate OAuth flow with Unipile
      // For demo, we'll simulate a successful connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add the new account to the list
      setSocialAccounts(prev => [
        ...prev,
        {
          id: `${Date.now()}`,
          service: newService,
          username: `Demo${newService.charAt(0).toUpperCase() + newService.slice(1)}Account`,
          connected: true,
          lastSync: new Date()
        }
      ]);
      
      setSuccessMessage(`${newService.charAt(0).toUpperCase() + newService.slice(1)} account connected successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
      setIsAddingAccount(false);
    } catch (error: any) {
      setErrorMessage(`Error connecting account: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Disconnect account
  const disconnectAccount = async (accountId: string) => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would revoke access with Unipile
      // For demo, we'll simulate a successful disconnection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove the account from the list
      setSocialAccounts(prev => prev.filter(account => account.id !== accountId));
      
      setSuccessMessage('Account disconnected successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setErrorMessage(`Error disconnecting account: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get service icon
  const getServiceIcon = (service: string) => {
    switch(service) {
      case 'facebook':
        return (
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        );
      case 'twitter':
        return (
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
          </svg>
        );
      case 'instagram':
        return (
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
          </svg>
        );
      case 'linkedin':
        return (
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        );
    }
  };

  // Get service color
  const getServiceColor = (service: string) => {
    switch(service) {
      case 'facebook':
        return 'bg-blue-600';
      case 'twitter':
        return 'bg-blue-400';
      case 'instagram':
        return 'bg-gradient-to-br from-pink-500 via-purple-500 to-yellow-500';
      case 'linkedin':
        return 'bg-blue-700';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <span className="p-1.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg text-white mr-2">
          <Link size={18} />
        </span>
        Unipile API Integration
      </h2>
      
      {/* API Key Configuration */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-800 mb-2">API Configuration</h3>
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200 mb-4 shadow-sm">
          <p className="text-sm text-amber-800 mb-4">
            Unipile API provides a unified interface to connect with multiple social media and messaging platforms. 
            Enter your API key below to enable these integrations.
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Unipile API key"
              className="flex-1 border border-amber-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
            />
            <button
              onClick={saveApiKey}
              disabled={!apiKey.trim() || isLoading}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center shadow-sm transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Key'
              )}
            </button>
          </div>
          
          {savedApiKey && (
            <div className="mt-2 text-xs text-amber-700 flex items-center">
              <CheckCircle size={12} className="mr-1.5" />
              API key is saved and active
            </div>
          )}
        </div>
      </div>
      
      {/* Connected Accounts */}
      {savedApiKey && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-medium text-gray-800">Connected Accounts</h3>
            <button
              onClick={() => setIsAddingAccount(true)}
              disabled={isAddingAccount || isLoading}
              className="text-sm bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-lg flex items-center hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 shadow-sm transition-all duration-200"
            >
              <Plus size={16} className="mr-1" />
              Add Account
            </button>
          </div>
          
          {isLoading && socialAccounts.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
              <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-sm mb-4">
                <RefreshCw size={24} className="text-amber-600 animate-spin" />
              </div>
              <p className="text-gray-600 font-medium">Loading your connected accounts...</p>
              <p className="text-gray-500 text-sm mt-1">This may take a moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {socialAccounts.map(account => {
                // Get service-specific styles
                const serviceColor = getServiceColor(account.service);
                
                return (
                  <div key={account.id} className="flex justify-between items-center border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full ${serviceColor} flex items-center justify-center text-white mr-3`}>
                        {getServiceIcon(account.service)}
                      </div>
                      <div>
                        <div className="font-medium">{account.service.charAt(0).toUpperCase() + account.service.slice(1)}</div>
                        <div className="text-sm text-gray-500">{account.username}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {account.connected ? (
                        <>
                          <span className="text-xs bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-2 py-1 rounded-full flex items-center border border-green-200 shadow-sm">
                            <CheckCircle size={12} className="mr-1" />
                            <span className="font-medium">Connected</span>
                          </span>
                          <button
                            onClick={() => disconnectAccount(account.id)}
                            className="text-xs text-gray-600 hover:text-red-600 py-1 px-2 rounded hover:bg-red-50 border border-transparent hover:border-red-100"
                          >
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => checkConnectionStatus()}
                          className="text-xs bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-2 py-1 rounded-full flex items-center border border-blue-200 shadow-sm"
                        >
                          <Link size={12} className="mr-1" />
                          Reconnect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {socialAccounts.length === 0 && (
                <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-amber-50 rounded-xl border border-amber-100">
                  <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Link size={24} className="text-amber-400" />
                  </div>
                  <p className="text-amber-800 font-medium">No accounts connected yet</p>
                  <button
                    onClick={() => setIsAddingAccount(true)}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
                  >
                    Connect your first account
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Add Account Modal */}
      {isAddingAccount && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <span className="p-1.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg text-white mr-2">
                  <Plus size={16} />
                </span>
                Connect New Account
              </h3>
              <button
                onClick={() => setIsAddingAccount(false)}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Platform
              </label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map(service => {
                  const isSelected = newService === service;
                  const serviceColor = getServiceColor(service);
                  
                  return (
                    <div
                      key={service}
                      onClick={() => setNewService(service)}
                      className={`p-3 border rounded-xl cursor-pointer flex items-center transition-all ${
                        isSelected 
                          ? `border-amber-300 bg-amber-50 shadow-sm` 
                          : `border-gray-200 hover:border-amber-200 hover:bg-amber-50/50`
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full ${serviceColor} flex items-center justify-center text-white mr-2.5`}>
                        {getServiceIcon(service)}
                      </div>
                      <span className={`font-medium ${isSelected ? 'text-amber-900' : 'text-gray-700'}`}>
                        {service.charAt(0).toUpperCase() + service.slice(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 mb-4">
                <p>You will be redirected to {newService.charAt(0).toUpperCase() + newService.slice(1)} to authorize access to your account.</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddingAccount(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm"
              >
                Cancel
              </button>
              
              <button
                onClick={connectNewAccount}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 disabled:opacity-70 flex items-center shadow-sm transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={16} className="mr-1.5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect Account'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Connection Status Section */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-800 mb-3">Integration Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <IntegrationStatus
            status={savedApiKey ? 'connected' : 'disconnected'}
            serviceName="Unipile API"
            lastSync={savedApiKey ? new Date() : undefined}
            onRetry={() => saveApiKey()}
          />
          
          <IntegrationStatus
            status={socialAccounts.some(a => a.service === 'facebook' && a.connected) ? 'connected' : 'disconnected'}
            serviceName="Facebook"
            lastSync={socialAccounts.find(a => a.service === 'facebook')?.lastSync}
            onRetry={() => setIsAddingAccount(true)}
          />
          
          <IntegrationStatus
            status={socialAccounts.some(a => a.service === 'twitter' && a.connected) ? 'connected' : 'disconnected'}
            serviceName="Twitter"
            lastSync={socialAccounts.find(a => a.service === 'twitter')?.lastSync}
            onRetry={() => setIsAddingAccount(true)}
          />
          
          <IntegrationStatus
            status={socialAccounts.some(a => a.service === 'instagram' && a.connected) ? 'connected' : 'disconnected'}
            serviceName="Instagram"
            lastSync={socialAccounts.find(a => a.service === 'instagram')?.lastSync}
            onRetry={() => setIsAddingAccount(true)}
          />
          
          <IntegrationStatus
            status={socialAccounts.some(a => a.service === 'linkedin' && a.connected) ? 'connected' : 'disconnected'}
            serviceName="LinkedIn"
            lastSync={socialAccounts.find(a => a.service === 'linkedin')?.lastSync}
            onRetry={() => setIsAddingAccount(true)}
          />
          
          <IntegrationStatus
            status="error"
            serviceName="WhatsApp Business API"
            errorMessage="Requires business verification"
            onRetry={() => window.open('https://business.facebook.com/overview', '_blank')}
          />
        </div>
      </div>
      
      {/* Error/Success Messages */}
      {errorMessage && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md shadow-sm animate-fadeIn">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-3 rounded-r-md shadow-sm animate-fadeIn">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Documentation Link */}
      <div className="mt-6 text-center">
        <a 
          href="https://developer.unipile.com/docs/getting-started" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 shadow-sm transition-all duration-200"
        >
          <Link size={16} className="mr-2" />
          View Unipile API Documentation
        </a>
      </div>
    </div>
  );
};

export default UnipileAPIIntegration;
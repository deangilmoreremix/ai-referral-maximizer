import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Download, Store as Stop, RefreshCw, Clock, Volume2, Save, CheckCircle, AlertCircle, Phone, X, Mic, UploadCloud, UserCheck, Sparkles, Zap } from 'lucide-react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { useCommunication } from '../contexts/CommunicationContext';
import { Contact, MessageTemplate } from '../services/unipileService';
import ContentEnhancementModal from './ContentEnhancementModal';
import { generateVoiceDropScript } from '../services/aiEnhancementService';

interface VoiceDropManagerProps {
  initialScript?: string;
  onClose: () => void;
  onSuccess?: (result: any) => void;
}

const VoiceDropManager: React.FC<VoiceDropManagerProps> = ({
  initialScript = '',
  onClose,
  onSuccess
}) => {
  // Audio recorder hook
  const recorderControls = useAudioRecorder();
  
  // Communication context
  const { 
    availableVoices, 
    selectedVoice, 
    setSelectedVoice,
    generateVoicePreview,
    createVoiceDrop,
    contacts,
    selectedContacts,
    setSelectedContacts,
    messageTemplates
  } = useCommunication();
  
  // UI State
  const [status, setStatus] = useState<'idle' | 'recording' | 'playing' | 'generating' | 'sending' | 'success' | 'error'>('idle');
  const [script, setScript] = useState(initialScript);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [isCustomAudio, setIsCustomAudio] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(1);
  const [voicemailDetection, setVoicemailDetection] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEnhancerOpen, setIsEnhancerOpen] = useState(false);
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-pro');
  const [referralType, setReferralType] = useState('warm');
  
  // Audio player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Variables that can be used in scripts
  const scriptVariables = [
    { key: 'name', description: 'Recipient name' },
    { key: 'your_name', description: 'Your name' },
    { key: 'company', description: 'Your company name' },
    { key: 'service', description: 'Your service name' },
    { key: 'your_phone', description: 'Your phone number' },
    { key: 'mutual_contact', description: 'Mutual connection' }
  ];

  // Filter voice templates
  const voiceTemplates = messageTemplates.filter(template => 
    template.channel === 'voice'
  );

  // Filter contacts by search query
  const filteredContacts = contacts.filter(contact => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.phone?.toLowerCase().includes(query) ||
      contact.email?.toLowerCase().includes(query)
    );
  });

  // Effect to reset audio when script changes
  useEffect(() => {
    if (audioUrl && !isCustomAudio) {
      setAudioUrl(null);
      setDuration(null);
    }
  }, [script, selectedVoice]);

  // Effect to handle recorded audio
  useEffect(() => {
    // When recording is stopped, we get a blob
    if (recorderControls.recordingBlob) {
      setAudioBlob(recorderControls.recordingBlob);
      setAudioUrl(URL.createObjectURL(recorderControls.recordingBlob));
      setIsCustomAudio(true);
    }
  }, [recorderControls.recordingBlob]);

  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = voiceTemplates.find(t => t.id === templateId);
    if (template) {
      setScript(template.content);
    }
  };

  // Generate voice preview
  const generatePreview = async () => {
    if (!script.trim()) {
      setErrorMessage('Please enter a script first');
      return;
    }
    
    try {
      setStatus('generating');
      setErrorMessage(null);
      
      const previewUrl = await generateVoicePreview(script);
      
      setAudioUrl(previewUrl);
      setIsCustomAudio(false);
      
      // Estimate duration based on character count
      // Approx. 15 characters per second for English
      setDuration(Math.max(3, Math.ceil(script.length / 15)));
      
      setStatus('idle');
    } catch (error: any) {
      setErrorMessage(`Error generating preview: ${error.message}`);
      setStatus('error');
    }
  };

  // Generate a new script with AI
  const handleGenerateTemplate = async () => {
    try {
      setIsGeneratingTemplate(true);
      setErrorMessage(null);
      
      // Generate a voice script using the current model and referral type
      const generatedScript = await generateVoiceDropScript(
        selectedModel,
        referralType,
        'professional',
        'standard'
      );
      
      // Set the new script
      setScript(generatedScript);
      
      // Show success message
      setSuccessMessage("New voice script generated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (error: any) {
      console.error('Error generating script:', error);
      setErrorMessage(`Failed to generate script: ${error.message}`);
    } finally {
      setIsGeneratingTemplate(false);
    }
  };

  // Play/pause audio
  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (audioRef.current.paused) {
      audioRef.current.play();
      setStatus('playing');
    } else {
      audioRef.current.pause();
      setStatus('idle');
    }
  };

  // Audio ended handler
  const handleAudioEnded = () => {
    setStatus('idle');
  };

  // Send voice drop
  const sendVoiceDrop = async () => {
    if (!script.trim()) {
      setErrorMessage('Please enter a script first');
      return;
    }
    
    if (selectedContacts.length === 0) {
      setErrorMessage('Please select at least one recipient');
      return;
    }
    
    try {
      setStatus('sending');
      setErrorMessage(null);
      
      // Get selected contact details
      const recipients = contacts
        .filter(contact => selectedContacts.includes(contact.id))
        .map(contact => ({
          id: contact.id,
          name: contact.name,
          phoneNumber: contact.phone || ''
        }));
      
      // Create voice drop
      const result = await createVoiceDrop({
        script,
        recipients,
        scheduledTime: scheduledTime || undefined,
        retryAttempts,
        voicemailDetection,
        callerId: '+18005551234' // Example caller ID
      });
      
      setStatus('success');
      setSuccessMessage(`Voice drop scheduled for ${recipients.length} recipient(s)`);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result);
      }
      
      // Auto-close after success (optional)
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (error: any) {
      setErrorMessage(`Error creating voice drop: ${error.message}`);
      setStatus('error');
    }
  };

  // Toggle contact selection
  const toggleContact = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  // Save as template
  const saveAsTemplate = async () => {
    if (!script.trim()) {
      setErrorMessage('Please enter a script first');
      return;
    }
    
    try {
      // Prompt for template name
      const templateName = window.prompt('Enter a name for this template:', 'Voice Drop Template');
      if (!templateName) return; // User canceled
      
      // Extract variables from script
      const variablePattern = /{{([^}]+)}}/g;
      const matches = script.matchAll(variablePattern);
      const variables = Array.from(matches).map(match => match[1]);
      
      // Use the communication context to save the template
      await useCommunication().saveTemplate({
        name: templateName,
        content: script,
        channel: 'voice',
        variables: [...new Set(variables)]
      });
      
      setSuccessMessage(`Template "${templateName}" saved successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setErrorMessage(`Error saving template: ${error.message}`);
    }
  };
  
  // Open the content enhancer
  const openEnhancer = () => {
    if (script.trim()) {
      setIsEnhancerOpen(true);
    } else {
      setErrorMessage('Please enter a script first before enhancing');
    }
  };
  
  // Handle enhanced content
  const handleEnhancedContent = (enhanced: string) => {
    setScript(enhanced);
    // Reset audio when script is enhanced
    setAudioUrl(null);
    setDuration(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700 flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-2 bg-white/20 rounded-lg mr-3">
              <Phone size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Voice Drop Creator</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Voice Recorder */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 flex flex-col items-center justify-center shadow-sm">
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-medium text-indigo-800 mb-1">Voice Recorder</h3>
                  <p className="text-sm text-indigo-600">Record your own voice or use AI voice generation</p>
                </div>
                
                <div className="flex justify-center items-center my-6 relative">
                  {recorderControls.isRecording ? (
                    <div className="animate-pulse flex items-center justify-center bg-red-100 w-24 h-24 rounded-full">
                      <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg">
                        <Mic size={32} />
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center">
                      {status === 'playing' && (
                        <div className="absolute inset-0 bg-blue-500/10 animate-ping rounded-full"></div>
                      )}
                      <div className="flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 w-24 h-24 rounded-full">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg">
                          <Volume2 size={32} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="audio-controls my-2 flex flex-wrap justify-center gap-3">
                  {!recorderControls.isRecording ? (
                    <button
                      onClick={recorderControls.startRecording}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-sm flex items-center font-medium transition-all duration-200 hover:shadow"
                      disabled={status === 'recording'}
                    >
                      <Mic size={18} className="mr-1.5" />
                      Record
                    </button>
                  ) : (
                    <button
                      onClick={recorderControls.stopRecording}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-sm flex items-center font-medium transition-all duration-200 hover:shadow animate-pulse"
                    >
                      <Stop size={18} className="mr-1.5" />
                      Stop
                    </button>
                  )}
                  
                  {audioUrl && (
                    <button
                      onClick={togglePlayback}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-sm flex items-center font-medium transition-all duration-200 hover:shadow"
                    >
                      {status === 'playing' ? (
                        <>
                          <Pause size={18} className="mr-1.5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play size={18} className="mr-1.5" />
                          Play
                        </>
                      )}
                    </button>
                  )}
                  
                  <button
                    onClick={generatePreview}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg shadow-sm flex items-center font-medium transition-all duration-200 hover:shadow"
                    disabled={status === 'generating' || !script.trim()}
                  >
                    {status === 'generating' ? (
                      <>
                        <RefreshCw size={18} className="mr-1.5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <UploadCloud size={18} className="mr-1.5" />
                        Generate Audio
                      </>
                    )}
                  </button>
                </div>
                
                {audioUrl && (
                  <div className="mt-4 w-full p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-blue-100">
                    <audio 
                      ref={audioRef}
                      src={audioUrl} 
                      onEnded={handleAudioEnded}
                      controls 
                      className="w-full"
                    ></audio>
                    
                    {duration && (
                      <div className="text-center text-xs text-indigo-600 mt-1 flex items-center justify-center">
                        <Clock size={12} className="mr-1" />
                        Estimated duration: {duration} seconds
                      </div>
                    )}
                  </div>
                )}
                
                {/* Voice selection */}
                <div className="mt-6 w-full">
                  <h4 className="text-sm font-medium text-indigo-800 mb-2">Voice Selection</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {availableVoices.map((voice) => (
                      <div
                        key={voice.id}
                        className={`
                          border p-2.5 rounded-lg cursor-pointer flex items-center transition-all
                          ${selectedVoice === voice.id 
                            ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'}
                        `}
                        onClick={() => setSelectedVoice(voice.id)}
                      >
                        <div className={`
                          w-8 h-8 rounded-full mr-2 flex items-center justify-center 
                          ${selectedVoice === voice.id 
                            ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-500'}
                        `}>
                          {voice.gender === 'female' ? 'F' : 'M'}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{voice.name}</div>
                          <div className="text-xs text-gray-500 capitalize">{voice.style}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Script Editor */}
              <div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Script Editor
                    </label>
                    <div className="flex space-x-2">
                      <button 
                        onClick={openEnhancer}
                        className="px-2 py-1 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 rounded text-xs flex items-center hover:from-indigo-200 hover:to-indigo-300 transition-all duration-200 border border-indigo-200"
                        disabled={!script.trim()}
                      >
                        <Sparkles size={12} className="mr-1" />
                        Enhance
                      </button>
                      <button 
                        onClick={handleGenerateTemplate}
                        className="px-2 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded text-xs flex items-center hover:from-green-200 hover:to-green-300 transition-all duration-200 border border-green-200"
                        disabled={isGeneratingTemplate}
                      >
                        {isGeneratingTemplate ? (
                          <>
                            <RefreshCw size={12} className="mr-1 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Zap size={12} className="mr-1" />
                            Generate New
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder="Enter your voice drop script here..."
                    className="w-full h-56 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    disabled={status === 'sending' || status === 'generating'}
                  ></textarea>
                  
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <div>{script.length} characters (~{Math.ceil(script.length / 15)} seconds)</div>
                    <div className="flex gap-2">
                      <button
                        onClick={saveAsTemplate}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                        disabled={!script.trim()}
                      >
                        <Save size={12} className="mr-1" />
                        Save as template
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Voice Templates */}
                {voiceTemplates.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Voice Templates
                    </label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) applyTemplate(e.target.value);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                      disabled={status === 'sending'}
                      value=""
                    >
                      <option value="">Select a template...</option>
                      {voiceTemplates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Referral Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referral Type
                  </label>
                  <select
                    value={referralType}
                    onChange={(e) => setReferralType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  >
                    <option value="cold">Cold contact</option>
                    <option value="warm">Warm lead</option>
                    <option value="client">Existing client</option>
                    <option value="followup">Follow-up</option>
                    <option value="network">Network connection</option>
                    <option value="friend">Friends & family</option>
                  </select>
                </div>
                
                {/* Variable reference */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Available Variables</h4>
                  <div className="flex flex-wrap gap-1.5 bg-gray-50 p-2 rounded-lg border border-gray-200">
                    {scriptVariables.map(variable => (
                      <div 
                        key={variable.key}
                        className="bg-gradient-to-r from-indigo-50 to-blue-50 text-xs text-indigo-700 px-2 py-1 rounded-md hover:from-indigo-100 hover:to-blue-100 cursor-pointer border border-indigo-100 shadow-sm transition-all"
                        onClick={() => {
                          const insertion = `{{${variable.key}}}`;
                          const textarea = document.querySelector('textarea');
                          if (textarea) {
                            const start = textarea.selectionStart || 0;
                            const end = textarea.selectionEnd || 0;
                            const newScript = script.substring(0, start) + insertion + script.substring(end);
                            setScript(newScript);
                            setTimeout(() => {
                              textarea.focus();
                              textarea.selectionStart = start + insertion.length;
                              textarea.selectionEnd = start + insertion.length;
                            }, 0);
                          } else {
                            // If text area not found, just append to end
                            setScript(script + ' ' + insertion);
                          }
                        }}
                        title={variable.description}
                      >
                        {`{{${variable.key}}}`}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 italic">Click to insert variables. They will be replaced with recipient info.</p>
                </div>
                
                {/* Delivery Settings */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-blue-100 p-4 mb-4">
                  <h4 className="text-sm font-medium text-indigo-700 mb-3 flex items-center">
                    <span className="p-1 bg-indigo-100 rounded mr-2">
                      <Clock size={14} className="text-indigo-700" />
                    </span>
                    Delivery Settings
                  </h4>
                  
                  {/* Scheduling */}
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="schedule"
                      checked={!!scheduledTime}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Set default scheduled time to tomorrow at current time
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          setScheduledTime(tomorrow);
                        } else {
                          setScheduledTime(null);
                        }
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="schedule" className="text-sm text-indigo-800">Schedule for later</label>
                    
                    {scheduledTime && (
                      <input
                        type="datetime-local"
                        value={scheduledTime.toISOString().slice(0, 16)}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          setScheduledTime(date);
                        }}
                        className="ml-2 border border-indigo-200 rounded-md px-2 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white/80"
                      />
                    )}
                  </div>
                  
                  {/* Retry attempts */}
                  <div className="mb-3 pl-6">
                    <label htmlFor="retry-attempts" className="text-sm text-indigo-800 block mb-1">
                      Retry Attempts
                    </label>
                    <select
                      id="retry-attempts"
                      value={retryAttempts}
                      onChange={(e) => setRetryAttempts(parseInt(e.target.value))}
                      className="border border-indigo-200 rounded-md px-3 py-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 shadow-sm w-full"
                    >
                      <option value="0">No retries</option>
                      <option value="1">1 retry</option>
                      <option value="2">2 retries</option>
                      <option value="3">3 retries</option>
                    </select>
                    <p className="text-xs text-indigo-600 mt-1 italic">
                      Number of times to retry if the call is not answered
                    </p>
                  </div>
                  
                  {/* Voicemail detection */}
                  <div className="flex items-center gap-2 pl-6">
                    <input
                      type="checkbox"
                      id="voicemail"
                      checked={voicemailDetection}
                      onChange={(e) => setVoicemailDetection(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="voicemail" className="text-sm text-indigo-800">Voicemail detection</label>
                  </div>
                  <p className="text-xs text-indigo-600 mt-0.5 pl-12 italic">
                    Leave your message when voicemail is detected
                  </p>
                </div>
              </div>
            </div>
            
            {/* Recipients */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <UserCheck size={20} className="mr-2 text-indigo-600" />
                Recipients
              </h3>
              
              {/* Search and filters */}
              <div className="mb-4 flex gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contacts..."
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 flex-1 shadow-sm"
                />
                
                <button
                  onClick={() => setSelectedContacts(filteredContacts.map(c => c.id))}
                  className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 rounded-lg text-sm hover:from-indigo-100 hover:to-blue-100 border border-indigo-200 shadow-sm"
                >
                  Select All
                </button>
                
                <button
                  onClick={() => setSelectedContacts([])}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 border border-gray-200 shadow-sm"
                  disabled={selectedContacts.length === 0}
                >
                  Clear
                </button>
                
                <div className="text-sm text-indigo-700 py-1.5 px-3 bg-indigo-50 rounded-lg border border-indigo-100 shadow-sm">
                  {selectedContacts.length} selected
                </div>
              </div>
              
              {/* Contact list */}
              <div className="border border-gray-200 rounded-xl overflow-y-auto max-h-64 shadow-sm">
                {filteredContacts.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`py-2.5 px-4 flex items-center hover:bg-indigo-50 transition-colors cursor-pointer ${
                          selectedContacts.includes(contact.id) ? 'bg-indigo-50' : ''
                        }`}
                        onClick={() => toggleContact(contact.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => {}}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex-1">
                          <div className="font-medium text-sm">{contact.name}</div>
                          <div className="text-xs text-gray-500 flex items-center space-x-3">
                            {contact.phone && <span>{contact.phone}</span>}
                            {contact.email && <span>{contact.email}</span>}
                          </div>
                        </div>
                        {/* Badges for contact details */}
                        <div className="flex gap-1">
                          {contact.channels.includes('voice') && (
                            <div className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full flex items-center shadow-sm">
                              <Phone size={10} className="mr-0.5" />
                              Voice
                            </div>
                          )}
                          {contact.tags.includes('priority') && (
                            <div className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5 rounded-full shadow-sm">
                              Priority
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="py-8 text-center text-gray-500 bg-gray-50">
                    <div className="bg-white mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm">
                      <AlertCircle size={20} className="text-gray-400" />
                    </div>
                    <p>No contacts found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500 bg-gray-50">
                    <div className="bg-white mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm">
                      <UserCheck size={20} className="text-gray-400" />
                    </div>
                    <p>No contacts available. Import contacts first.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Error/Success Messages */}
            {errorMessage && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md shadow-sm animate-fadeIn">
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
              <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md shadow-sm animate-fadeIn">
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
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-indigo-50 flex justify-between items-center">
          <div>
            {/* Character and time estimates */}
            {script && (
              <div className="flex items-center text-sm text-indigo-700">
                <Clock size={16} className="mr-1.5" />
                <span>
                  {script.length} characters (~{Math.ceil(script.length / 15)} seconds)
                </span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm transition-all duration-200"
              disabled={status === 'sending'}
            >
              Cancel
            </button>
            
            <button
              onClick={sendVoiceDrop}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 flex items-center font-medium shadow-sm transition-all duration-200 hover:shadow disabled:opacity-70 disabled:hover:shadow-none disabled:hover:from-indigo-600 disabled:hover:to-blue-600"
              disabled={!script.trim() || selectedContacts.length === 0 || status === 'sending' || status === 'generating'}
            >
              {status === 'sending' ? (
                <>
                  <RefreshCw size={18} className="mr-1.5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Phone size={18} className="mr-1.5" />
                  Send Voice Drop
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Content Enhancement Modal */}
      <ContentEnhancementModal
        isOpen={isEnhancerOpen}
        onClose={() => setIsEnhancerOpen(false)}
        initialContent={script}
        contentType="voice"
        onEnhanced={handleEnhancedContent}
      />
    </div>
  );
};

export default VoiceDropManager;
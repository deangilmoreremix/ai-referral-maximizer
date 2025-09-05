import React, { useState } from 'react';
import { X, CheckCircle2, Star, Copy, Award, Calendar, Clock, FileText, PenTool as Tool, Trash2, AlertCircle, Lightbulb, ExternalLink } from 'lucide-react';

interface ReferralImplementationGuideProps {
  isOpen: boolean;
  onClose: () => void;
  referralMethod: string;
}

const ReferralImplementationGuide: React.FC<ReferralImplementationGuideProps> = ({ 
  isOpen, 
  onClose,
  referralMethod
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle copying template to clipboard
  const copyTemplate = (templateId: string, templateText: string) => {
    navigator.clipboard.writeText(templateText);
    setCopiedTemplate(templateId);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  // Get implementation data based on referral method
  const getImplementationData = (method: string) => {
    // Default data structure
    const defaultData = {
      title: referralMethod,
      overview: 'Implementation guide for this referral method.',
      difficulty: 'medium',
      timeEstimate: '1-2 weeks',
      steps: [
        'Plan and prepare your strategy',
        'Implement the basic framework',
        'Test with a small group',
        'Refine based on feedback',
        'Scale to full implementation'
      ],
      templates: [
        {
          id: 'template1',
          name: 'Basic Template',
          content: 'This is a placeholder template. The actual content will be customized to your specific referral method.'
        }
      ],
      bestPractices: [
        'Be consistent with your approach',
        'Always follow up promptly',
        'Track your results',
        'Iterate and improve based on data'
      ],
      pitfalls: [
        'Being too aggressive or pushy',
        'Not making the ask clear enough',
        'Failing to follow up',
        'Making the referral process complicated'
      ],
      tools: [
        {
          name: 'CRM System',
          purpose: 'Track referrals and follow-ups'
        },
        {
          name: 'Calendar Tool',
          purpose: 'Schedule consistent outreach'
        }
      ]
    };
    
    // Method-specific implementation data
    const implementationData: Record<string, any> = {
      'Friends and Family Campaign': {
        title: 'Friends & Family Campaign',
        overview: 'This 14-day campaign is designed to leverage your closest relationships for referrals without being pushy or damaging those relationships. It focuses on personal, direct outreach through various messaging platforms.',
        difficulty: 'easy',
        timeEstimate: '14 days',
        steps: [
          'Create a list of friends and family members who might know potential clients',
          'Segment your list based on relationship closeness and communication preferences',
          'Personalize messages for each segment using the templates provided',
          'Schedule your outreach across the 14-day period',
          'Track responses and follow up appropriately',
          'Send personalized thank-you messages to anyone who provides referrals',
          'Document referrals received and maintain relationships'
        ],
        templates: [
          {
            id: 'whatsapp',
            name: 'WhatsApp/Messenger Template',
            content: 'Hi [Name]! 👋 Hope you\'ve been doing well! I wanted to reach out because I\'m focusing on growing my [business type] through referrals this month. I\'m not looking to sell you anything - just wondering if you might know anyone who could benefit from [your service]? If someone comes to mind, I\'d really appreciate an introduction! No pressure either way, and I hope things are great with you! 😊'
          },
          {
            id: 'sms',
            name: 'SMS/Text Template',
            content: 'Hey [Name]! Quick question – do you know anyone who might need help with [your service]? I\'m focusing on growing through referrals and would appreciate any connections. No pressure at all! Hope you\'re doing well!'
          },
          {
            id: 'inperson',
            name: 'In-Person Script',
            content: 'So [Name], I wanted to mention that I\'m looking to grow my business through referrals right now. I\'m wondering if you know anyone who might benefit from [your service]? I\'d really appreciate an introduction if someone comes to mind.'
          }
        ],
        bestPractices: [
          'Be genuinely warm and friendly in all communications',
          'Make it clear you\'re not trying to sell to them directly',
          'Express sincere appreciation for any help they provide',
          'Be specific about what kind of referrals you\'re looking for',
          'Make the referral process as simple as possible',
          'Follow up only once if you don\'t get a response',
          'Send a meaningful thank-you for any referrals received'
        ],
        pitfalls: [
          'Being too pushy or sending too many follow-ups',
          'Making friends and family feel obligated or uncomfortable',
          'Using overly formal or sales-like language',
          'Not being clear about what you\'re asking for',
          'Failing to show appropriate appreciation',
          'Damaging personal relationships for business purposes'
        ],
        tools: [
          {
            name: 'Messaging Apps',
            purpose: 'WhatsApp, Messenger, SMS for direct communication'
          },
          {
            name: 'Contact Management',
            purpose: 'Spreadsheet or CRM to track outreach and responses'
          },
          {
            name: 'Calendar',
            purpose: 'Schedule your 14-day messaging campaign'
          }
        ]
      },
      'WhatsApp Outreach Campaigns': {
        title: 'WhatsApp Outreach Campaigns',
        overview: 'This 14-day WhatsApp campaign leverages the 98% open rate of WhatsApp messages to systematically generate referrals through value-based messaging and strategic asks.',
        difficulty: 'easy',
        timeEstimate: '14 days',
        steps: [
          'Create segments of your contacts (clients, network, acquaintances)',
          'Personalize message templates for each segment and day',
          'Prepare any media files you\'ll include in messages',
          'Set up a tracking system for responses',
          'Schedule daily message sending or set reminders',
          'Create follow-up templates for different response types',
          'Implement a thank-you process for received referrals'
        ],
        templates: [
          {
            id: 'day1',
            name: 'Day 1: Introduction',
            content: 'Hi [Name]! 👋 Hope you\'re doing well! I\'m reaching out because I\'m focusing on growing my [business type] through referrals this month. I\'m not looking to sell you anything - just wondering if you might know anyone who could benefit from [your service]? Would love your help if someone comes to mind! 🙏'
          },
          {
            id: 'day5',
            name: 'Day 5: Follow-up',
            content: 'Hey [Name]! Just following up on my message from earlier this week about referrals for my [business type]. No pressure at all, but if you do think of someone who might need help with [problem you solve], I\'d be so grateful for an introduction! Hope you\'re having a great week! 😊'
          },
          {
            id: 'day10',
            name: 'Day 10: Value Share',
            content: 'Hi [Name]! I wanted to share a quick tip about [relevant topic] that might be helpful: [brief valuable tip]. This is the kind of insight I provide to my clients. If you know anyone who\'s struggling with [related problem], I\'d love to help them too. Let me know if someone comes to mind!'
          }
        ],
        bestPractices: [
          'Keep messages brief and conversational with emojis',
          'Response quickly to any replies (WhatsApp creates this expectation)',
          'Use media content strategically (images, voice notes, brief videos)',
          'Provide genuine value throughout your campaign',
          'Don\'t message too frequently - respect people\'s time',
          'Personalize every message with specific details',
          'Use WhatsApp Business features if available'
        ],
        pitfalls: [
          'Sending too many messages in a short period',
          'Using formal or salesy language that feels unnatural for WhatsApp',
          'Not responding quickly to replies',
          'Failing to personalize messages appropriately',
          'Making the referral process complicated',
          'Not tracking which messages receive responses'
        ],
        tools: [
          {
            name: 'WhatsApp or WhatsApp Business',
            purpose: 'Primary communication platform'
          },
          {
            name: 'Media Creation Tools',
            purpose: 'For creating images or short videos to include'
          },
          {
            name: 'Tracking Spreadsheet',
            purpose: 'Document campaign progress and responses'
          }
        ]
      },
      'Phone Call Scripts': {
        title: 'Phone Call Scripts',
        overview: 'Phone calls remain one of the most effective methods for requesting referrals with a personal touch. These scripts provide frameworks for different call scenarios to help you request referrals naturally and effectively.',
        difficulty: 'medium',
        timeEstimate: 'Ongoing',
        steps: [
          'Identify which contacts to call and categorize by relationship',
          'Schedule calls during appropriate times (avoid meal times and late evenings)',
          'Practice the scripts before making calls',
          'Prepare responses for common objections or questions',
          'Take notes during calls to track responses',
          'Follow up with promised information or materials',
          'Track results and refine your approach'
        ],
        templates: [
          {
            id: 'warm',
            name: 'Warm Contact Script',
            content: 'Hi [Name], it\'s [Your Name]. How are you doing? [Wait for response]\n\nThat\'s great to hear. I\'m calling because I\'ve really enjoyed working with clients like you, and I\'m looking to expand my business through referrals.\n\nDo you know anyone who might benefit from [your service]? [Wait for response]\n\nThat\'s fantastic! Would you be comfortable making an introduction for us?'
          },
          {
            id: 'client',
            name: 'Client Follow-up Script',
            content: 'Hello [Name], I wanted to check in and see how everything is going with [recent service you provided]. [Wait for response]\n\nI\'m so glad to hear that. Since you\'ve had a positive experience, I was wondering if you know anyone else who might benefit from similar services? I\'m currently accepting new clients and would appreciate any referrals.'
          },
          {
            id: 'voicemail',
            name: 'Voicemail Script',
            content: 'Hi [Name], this is [Your Name] from [Your Business]. I\'m calling to touch base and also to ask for your help with something quick.\n\nI\'m working on growing my business through referrals, and I thought you might know someone who could benefit from [your service].\n\nPlease give me a call back at [your number] when you have a moment. I\'d really appreciate your thoughts.\n\nThanks, and have a great day!'
          }
        ],
        bestPractices: [
          'Call at appropriate times when people are likely to be available',
          'Always start by building rapport, not asking for the referral immediately',
          'Be specific about what type of referrals you\'re looking for',
          'Have a system ready to capture referral details',
          'Send a follow-up email or text summarizing the conversation',
          'Track which scripts and approaches work best for different contacts'
        ],
        pitfalls: [
          'Jumping to the referral request too quickly',
          'Being vague about what you\'re looking for',
          'Missing the opportunity to capture referral details',
          'Not having a follow-up process in place',
          'Calling at inconvenient times',
          'Sounding scripted or unnatural'
        ],
        tools: [
          {
            name: 'Call Scheduling Tool',
            purpose: 'Plan your outreach calls'
          },
          {
            name: 'CRM or Contact System',
            purpose: 'Track conversations and referrals'
          },
          {
            name: 'Call Recording App',
            purpose: 'For practice and improvement (with permission)'
          }
        ]
      },
      'Face-to-Face Meeting Guides': {
        title: 'Face-to-Face Meeting Guides',
        overview: 'In-person referral requests have the highest conversion rate of any method. These guides help you naturally incorporate referral requests into face-to-face meetings with clients and contacts.',
        difficulty: 'medium',
        timeEstimate: 'Varies by meeting',
        steps: [
          'Identify appropriate meetings for referral requests',
          'Prepare your approach based on the relationship',
          'Create any supporting materials (business cards, brochures, etc.)',
          'Practice your referral request to sound natural',
          'Execute during the meeting at an appropriate moment',
          'Document any commitments made',
          'Follow up appropriately after the meeting'
        ],
        templates: [
          {
            id: 'client_review',
            name: 'Client Review Meeting',
            content: 'As we\'re wrapping up today, I wanted to mention something. I really enjoy working with clients like you who [specific positive quality]. I\'m currently looking to expand my business with more clients who are similar to you.\n\nDo you know anyone who might be facing [problem you solve] who could benefit from my services? I\'d be happy to reach out to them with the same level of service I\'ve provided to you.'
          },
          {
            id: 'networking',
            name: 'Networking Event',
            content: 'It\'s been great talking with you about [topic discussed]. I help people with [your service] and I\'m always looking to connect with [your ideal client type].\n\nDo you happen to know anyone who fits that description? I\'d be grateful for an introduction.'
          },
          {
            id: 'casual',
            name: 'Casual Meeting',
            content: 'By the way, I\'m currently growing my business and focusing on helping more people with [your service]. If you know anyone who might need help with [problem you solve], I\'d really appreciate you keeping me in mind for a referral.\n\nWould it be okay if I gave you a few of my business cards to pass along?'
          }
        ],
        bestPractices: [
          'Read the room and only ask when the timing feels right',
          'Be specific about who makes an ideal referral for you',
          'Have business cards or materials ready to provide',
          'Practice your request so it sounds natural, not rehearsed',
          'Express genuine appreciation for any consideration',
          'Follow up within 24 hours of the meeting',
          'Consider bringing a small gift or token for significant referrals'
        ],
        pitfalls: [
          'Asking too early in the relationship or meeting',
          'Being vague about who you want to be referred to',
          'Making the process complicated for the referrer',
          'Appearing desperate rather than professional',
          'Not having materials ready to support your request',
          'Failing to follow up appropriately'
        ],
        tools: [
          {
            name: 'Business Cards',
            purpose: 'Easy to share with potential referrers'
          },
          {
            name: 'Digital Portfolio',
            purpose: 'Show examples of your work on tablet/phone'
          },
          {
            name: 'Calendar App',
            purpose: 'Schedule follow-ups immediately'
          }
        ]
      },
      'Zoom Meeting Templates': {
        title: 'Zoom Meeting Templates',
        overview: 'Video calls have become a primary meeting method, with nearly the same effectiveness as in-person meetings for referral requests when done correctly. These templates help you structure Zoom calls to naturally include referral requests.',
        difficulty: 'medium',
        timeEstimate: '30-60 minutes per call',
        steps: [
          'Create a clear agenda that includes time for referral discussion',
          'Prepare any slides or materials to share',
          'Test your equipment and background',
          'Send calendar invites with Zoom links',
          'Conduct the meeting following your prepared structure',
          'Make the referral request at the appropriate moment',
          'Follow up after the meeting with a summary and reminder'
        ],
        templates: [
          {
            id: 'client_review_zoom',
            name: 'Client Review Meeting',
            content: 'Before we finish today, I\'d like to take a moment to discuss something important. As you can see from our review, we\'ve made great progress on [achievements].\n\nI\'m looking to help more clients achieve similar results, and referrals from satisfied clients like you are incredibly valuable.\n\nDo you know anyone who might be facing similar challenges with [problem you solve]? I\'d be happy to schedule a no-obligation call with them.'
          },
          {
            id: 'educational_zoom',
            name: 'Educational Webinar',
            content: 'Thanks everyone for attending today\'s session on [topic]. I hope you found it valuable.\n\nAs I mentioned at the beginning, I help clients with [your service]. If you know anyone who might benefit from this kind of support, I\'d appreciate you referring them to me.\n\nI\'ve just shared my contact information in the chat, and I\'m also displaying my referral program which offers [incentive] for successful referrals.'
          },
          {
            id: 'networking_zoom',
            name: 'Networking Meeting',
            content: 'It\'s been great connecting with you today. Based on what you\'ve shared about your role at [their company], I think my services might be valuable to others in your network who are dealing with [problem you solve].\n\nWould you be open to introducing me to anyone who comes to mind? I\'m happy to share my screen quickly to show you some examples of clients I\'ve helped.'
          }
        ],
        bestPractices: [
          'Ensure excellent audio and video quality',
          'Use screen sharing to display testimonials or results when asking for referrals',
          'Create a specific slide or visual for your referral request',
          'Make it easy for people to refer (shared document, chat links, etc.)',
          'Pay attention to body language and engagement cues',
          'Follow up promptly after the meeting',
          'Record the session (with permission) so you can review your approach'
        ],
        pitfalls: [
          'Technical issues that distract from your message',
          'Going overtime without making your referral request',
          'Not having visual aids ready to share',
          'Making the request when participants are visibly ready to leave',
          'Complex referral processes that require multiple steps',
          'Poor lighting or audio that reduces your professionalism'
        ],
        tools: [
          {
            name: 'Zoom',
            purpose: 'Primary meeting platform with screen sharing'
          },
          {
            name: 'Presentation Slides',
            purpose: 'Visual aid for referral requests'
          },
          {
            name: 'Quality Webcam & Microphone',
            purpose: 'Ensure professional presentation'
          }
        ]
      }
    };
    
    // Return method-specific data or default
    return implementationData[method] || defaultData;
  };

  const data = getImplementationData(referralMethod);
  
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <span className="text-green-600">Easy</span>;
      case 'medium':
        return <span className="text-yellow-600">Medium</span>;
      case 'advanced':
        return <span className="text-orange-600">Advanced</span>;
      default:
        return <span>{difficulty}</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Award size={20} className="text-green-600 mr-2" />
            {data.title} Implementation Guide
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-2 flex space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'overview' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'steps' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Implementation Steps
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'templates' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Templates & Scripts
          </button>
          <button
            onClick={() => setActiveTab('best-practices')}
            className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'best-practices' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Best Practices
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'tools' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Tools & Resources
          </button>
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <p className="text-gray-600">
                {data.overview}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-800 flex items-center mb-2">
                    <Star size={16} className="text-yellow-500 mr-1.5" />
                    Difficulty Level
                  </h3>
                  <p className="text-gray-700">
                    {getDifficultyLabel(data.difficulty)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-800 flex items-center mb-2">
                    <Clock size={16} className="text-blue-500 mr-1.5" />
                    Time Estimate
                  </h3>
                  <p className="text-gray-700">
                    {data.timeEstimate}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-800 flex items-center mb-2">
                    <CheckCircle2 size={16} className="text-green-500 mr-1.5" />
                    Success Indicators
                  </h3>
                  <p className="text-gray-700">
                    Positive responses and actual referrals received
                  </p>
                </div>
              </div>
              
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                <div className="flex">
                  <Lightbulb size={18} className="text-amber-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-amber-800">Implementation Tip</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      This method works best when implemented consistently over time. Set reminders or create a schedule to ensure you follow through with all steps of the process.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-medium text-gray-800 mb-3">Common Pitfalls to Avoid</h3>
                <div className="space-y-2">
                  {data.pitfalls.map((pitfall, index) => (
                    <div key={index} className="flex items-start">
                      <AlertCircle size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{pitfall}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'steps' && (
            <div className="space-y-6">
              <h3 className="font-medium text-gray-800 mb-4">Step-by-Step Implementation</h3>
              
              <div className="space-y-6">
                {data.steps.map((step, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium mr-4">
                      {index + 1}
                    </div>
                    <div className="pt-1">
                      <p className="text-gray-700">{step}</p>
                      {index === 0 && (
                        <p className="text-sm text-gray-500 mt-2">Start here to establish your foundation.</p>
                      )}
                      {index === data.steps.length - 1 && (
                        <p className="text-sm text-gray-500 mt-2">Continuous improvement will maximize your results.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
                <div className="flex">
                  <Calendar size={18} className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-800">Implementation Timeline</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      For best results, commit to following this process for at least {data.timeEstimate}. Consistency is key to generating quality referrals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <h3 className="font-medium text-gray-800 mb-4">Ready-to-Use Templates & Scripts</h3>
              
              <p className="text-gray-600 mb-4">
                Use these templates as starting points, but always personalize them for your specific situation and relationship context.
              </p>
              
              <div className="space-y-6">
                {data.templates.map((template, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <h4 className="font-medium text-gray-700">{template.name}</h4>
                      <button 
                        onClick={() => copyTemplate(template.id, template.content)}
                        className="text-gray-500 hover:text-gray-700 p-1"
                        title="Copy to clipboard"
                      >
                        {copiedTemplate === template.id ? (
                          <CheckCircle2 size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                    <div className="p-4 bg-white">
                      <pre className="text-gray-700 text-sm whitespace-pre-wrap">{template.content}</pre>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 mt-4">
                <div className="flex">
                  <Lightbulb size={18} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-green-800">Personalization Tips</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Always replace placeholders like [Name] with actual names. Reference specific details about the person or your relationship to make the request more authentic and effective.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'best-practices' && (
            <div className="space-y-6">
              <h3 className="font-medium text-gray-800 mb-4">Best Practices for Success</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <CheckCircle2 size={16} className="text-green-500 mr-1.5" />
                    Do's
                  </h4>
                  <div className="space-y-3">
                    {data.bestPractices.map((practice, index) => (
                      <div key={index} className="flex items-start bg-green-50 p-3 rounded-lg border border-green-100">
                        <span className="text-green-700 text-sm">{practice}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <Trash2 size={16} className="text-red-500 mr-1.5" />
                    Don'ts
                  </h4>
                  <div className="space-y-3">
                    {data.pitfalls.map((pitfall, index) => (
                      <div key={index} className="flex items-start bg-red-50 p-3 rounded-lg border border-red-100">
                        <span className="text-red-700 text-sm">{pitfall}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-medium text-gray-800 mb-3">Measuring Success</h3>
                <p className="text-gray-600 mb-4">
                  Track these key metrics to evaluate and improve your referral generation:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-1 text-sm">Outreach Completion Rate</h4>
                    <p className="text-xs text-gray-500">
                      Percentage of planned outreach activities completed
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-1 text-sm">Response Rate</h4>
                    <p className="text-xs text-gray-500">
                      Percentage of contacts who respond to your outreach
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-1 text-sm">Referral Conversion Rate</h4>
                    <p className="text-xs text-gray-500">
                      Percentage of outreach that results in actual referrals
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'tools' && (
            <div className="space-y-6">
              <h3 className="font-medium text-gray-800 mb-4">Recommended Tools & Resources</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.tools.map((tool, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h4 className="font-medium text-gray-700 flex items-center">
                        <Tool size={16} className="text-gray-500 mr-1.5" />
                        {tool.name}
                      </h4>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Purpose:</span> {tool.purpose}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mt-4">
                <div className="flex">
                  <ExternalLink size={18} className="text-purple-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-purple-800">Additional Resources</h3>
                    <p className="text-sm text-purple-700 mt-1">
                      To maximize your results with this referral method, consider generating additional supportive content using the AI Referral Maximizer:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm text-purple-700 space-y-1">
                      <li>Follow-up System templates to nurture received referrals</li>
                      <li>Tracking System documents to monitor your progress</li>
                      <li>Thank-you message templates for when you receive referrals</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
          <div>
            <a href="#" className="text-sm text-green-600 hover:text-green-800 flex items-center">
              <FileText size={14} className="mr-1" />
              View complete guide as PDF
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralImplementationGuide;
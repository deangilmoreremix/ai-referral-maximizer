import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  PieChart, 
  Calendar, 
  Clock, 
  RefreshCw, 
  ChevronDown, 
  DownloadCloud,
  Phone,
  Smartphone,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Clock4,
  X
} from 'lucide-react';
import { format, subDays, subHours } from 'date-fns';
import { useCommunication } from '../contexts/CommunicationContext';
import { unipileService, MessageChannel } from '../services/unipileService';

interface CommunicationAnalyticsProps {
  onClose: () => void;
}

const CommunicationAnalytics: React.FC<CommunicationAnalyticsProps> = ({
  onClose
}) => {
  // Communication context
  const {
    campaigns
  } = useCommunication();

  // UI state
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [selectedChannel, setSelectedChannel] = useState<MessageChannel | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [messageStats, setMessageStats] = useState<any>(null);

  // Load message analytics
  useEffect(() => {
    loadAnalytics();
  }, [timeframe, selectedChannel]);

  // Load analytics data
  const loadAnalytics = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would fetch from the API
      // For demo, we'll generate mock data
      
      // Calculate start date based on selected timeframe
      let startDate: Date | undefined;
      if (timeframe !== 'all') {
        if (timeframe === '24h') startDate = subHours(new Date(), 24);
        else if (timeframe === '7d') startDate = subDays(new Date(), 7);
        else if (timeframe === '30d') startDate = subDays(new Date(), 30);
      }
      
      // Get message logs
      const logs = await unipileService.getMessageLogs({
        startDate,
        channel: selectedChannel !== 'all' ? selectedChannel : undefined
      });
      
      // Calculate stats
      const stats = calculateStats(logs, campaigns);
      setMessageStats(stats);
      
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics from log data
  const calculateStats = (logs: any[], campaigns: any[]) => {
    // Delivery stats
    const statusCounts = {
      sent: logs.filter(log => log.status === 'sent').length,
      delivered: logs.filter(log => log.status === 'delivered').length,
      read: logs.filter(log => log.status === 'read').length,
      failed: logs.filter(log => log.status === 'failed').length
    };
    
    // Channel breakdown
    const channels = {
      sms: logs.filter(log => log.channel === 'sms').length,
      voice: logs.filter(log => log.channel === 'voice').length,
      whatsapp: logs.filter(log => log.channel === 'whatsapp').length,
      messenger: logs.filter(log => log.channel === 'messenger').length,
      email: logs.filter(log => log.channel === 'email').length
    };
    
    // Campaign stats
    const campaignStats = campaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      channel: campaign.channel,
      status: campaign.status,
      completion: campaign.contactCount > 0 
        ? Math.round((campaign.sentCount / campaign.contactCount) * 100) 
        : 0,
      deliveryRate: campaign.sentCount > 0 
        ? Math.round((campaign.deliveredCount / campaign.sentCount) * 100) 
        : 0,
      responseRate: campaign.deliveredCount > 0 
        ? Math.round((campaign.responseCount / campaign.deliveredCount) * 100) 
        : 0
    }));
    
    // Time-of-day distribution (mock data for demo)
    const hourlyDistribution = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: Math.floor(Math.random() * 10) + (i >= 8 && i <= 20 ? 10 : 0) // More messages during business hours
    }));
    
    // Recent activities
    const recentActivities = logs.slice(0, 10).map(log => ({
      id: log.id,
      type: log.channel,
      status: log.status,
      recipient: log.to,
      timestamp: log.timestamp
    }));
    
    // Total cost estimate
    const totalCost = logs.reduce((sum, log) => sum + (log.cost || 0), 0).toFixed(2);
    
    return {
      statusCounts,
      channels,
      campaignStats,
      hourlyDistribution,
      recentActivities,
      totalMessages: logs.length,
      totalCost
    };
  };

  // Get channel icon
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <Smartphone size={18} className="text-blue-500" />;
      case 'whatsapp': return <MessageSquare size={18} className="text-green-500" />;
      case 'messenger': return <MessageSquare size={18} className="text-blue-500" />;
      case 'voice': return <Phone size={18} className="text-purple-500" />;
      case 'email': return <Mail size={18} className="text-gray-500" />;
      default: return <MessageSquare size={18} className="text-gray-500" />;
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': 
      case 'delivered': 
        return <CheckCircle size={16} className="text-green-500" />;
      case 'read': 
        return <CheckCircle size={16} className="text-blue-500" />;
      case 'failed': 
        return <AlertCircle size={16} className="text-red-500" />;
      default: 
        return <Clock4 size={16} className="text-gray-500" />;
    }
  };

  // Format date helper function (fallback implementation if date-fns has issues)
  const formatDate = (date: Date, formatStr: string) => {
    try {
      // Try to use date-fns format
      return format(date, formatStr);
    } catch (error) {
      // Fallback to native date formatting
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      };
      return date.toLocaleDateString('en-US', options);
    }
  };

  // Get channel color classes
  const getChannelColorClasses = (channel: MessageChannel | 'all'): { bgLight: string, bgMedium: string, text: string, border: string, gradient: string } => {
    switch (channel) {
      case 'all':
        return {
          bgLight: 'bg-indigo-50',
          bgMedium: 'bg-indigo-100',
          text: 'text-indigo-700',
          border: 'border-indigo-200',
          gradient: 'from-indigo-600 to-purple-600'
        };
      case 'sms':
        return {
          bgLight: 'bg-blue-50',
          bgMedium: 'bg-blue-100',
          text: 'text-blue-700',
          border: 'border-blue-200',
          gradient: 'from-blue-600 to-blue-500'
        };
      case 'whatsapp':
        return {
          bgLight: 'bg-green-50',
          bgMedium: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-200',
          gradient: 'from-green-600 to-green-500'
        };
      case 'messenger':
        return {
          bgLight: 'bg-indigo-50',
          bgMedium: 'bg-indigo-100',
          text: 'text-indigo-700',
          border: 'border-indigo-200',
          gradient: 'from-indigo-600 to-blue-600'
        };
      case 'voice':
        return {
          bgLight: 'bg-purple-50',
          bgMedium: 'bg-purple-100',
          text: 'text-purple-700',
          border: 'border-purple-200',
          gradient: 'from-purple-600 to-purple-500'
        };
      case 'email':
        return {
          bgLight: 'bg-amber-50',
          bgMedium: 'bg-amber-100',
          text: 'text-amber-700',
          border: 'border-amber-200',
          gradient: 'from-amber-600 to-amber-500'
        };
      default:
        return {
          bgLight: 'bg-gray-50',
          bgMedium: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-200',
          gradient: 'from-gray-600 to-gray-500'
        };
    }
  };
  
  // Get active channel colors
  const channelColors = getChannelColorClasses(selectedChannel);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className={`px-6 py-4 border-b border-gray-200 bg-gradient-to-r ${channelColors.gradient} flex justify-between items-center`}>
          <div className="flex items-center">
            <div className="p-2 bg-white/20 rounded-lg mr-3 shadow-sm">
              <BarChart size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Communication Analytics</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Filters */}
        <div className={`px-6 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-${selectedChannel === 'all' ? 'indigo' : 
                          selectedChannel === 'whatsapp' ? 'green' :
                          selectedChannel === 'messenger' ? 'indigo' :
                          selectedChannel === 'sms' ? 'blue' :
                          selectedChannel === 'voice' ? 'purple' :
                          'amber'}-50 flex flex-wrap gap-3`}>
          <div className="flex items-center">
            <label className="text-sm text-gray-700 mr-2">Timeframe:</label>
            <div className="relative">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className={`appearance-none bg-white border ${channelColors.border} rounded-md pl-3 pr-8 py-1.5 text-sm shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent ${
                   selectedChannel === 'whatsapp' ? 'focus:ring-green-500' :
                   selectedChannel === 'messenger' ? 'focus:ring-indigo-500' :
                   selectedChannel === 'sms' ? 'focus:ring-blue-500' :
                   selectedChannel === 'voice' ? 'focus:ring-purple-500' :
                   selectedChannel === 'email' ? 'focus:ring-amber-500' :
                   'focus:ring-indigo-500'
                }`}
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="all">All time</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="text-sm text-gray-700 mr-2">Channel:</label>
            <div className="relative">
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value as any)}
                className={`appearance-none bg-white border ${channelColors.border} rounded-md pl-3 pr-8 py-1.5 text-sm shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent ${
                   selectedChannel === 'whatsapp' ? 'focus:ring-green-500' :
                   selectedChannel === 'messenger' ? 'focus:ring-indigo-500' :
                   selectedChannel === 'sms' ? 'focus:ring-blue-500' :
                   selectedChannel === 'voice' ? 'focus:ring-purple-500' :
                   selectedChannel === 'email' ? 'focus:ring-amber-500' :
                   'focus:ring-indigo-500'
                }`}
              >
                <option value="all">All channels</option>
                <option value="sms">SMS</option>
                <option value="voice">Voice</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="messenger">Messenger</option>
                <option value="email">Email</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
          
          <button 
            className={`ml-auto px-3 py-1.5 text-sm ${channelColors.bgLight} ${channelColors.text} rounded-md hover:bg-opacity-80 flex items-center shadow-sm border ${channelColors.border}`}
            onClick={loadAnalytics}
          >
            <RefreshCw size={14} className={`mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button className={`px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 flex items-center shadow-sm border border-gray-200`}>
            <DownloadCloud size={14} className="mr-1.5" />
            Export
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <RefreshCw size={36} className="text-indigo-500 animate-spin mb-4" />
              <p className="text-gray-500">Loading analytics data...</p>
            </div>
          ) : messageStats ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl border border-indigo-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-indigo-800">Total Messages</h3>
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <MessageSquare size={16} className="text-indigo-600" />
                    </div>
                  </div>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{messageStats.totalMessages}</p>
                  <div className="mt-2 text-xs text-green-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                    <span>+12% from previous period</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-green-50 rounded-xl border border-green-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-green-800">Delivery Rate</h3>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                  </div>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {messageStats.statusCounts.sent > 0 
                      ? Math.round((messageStats.statusCounts.delivered / messageStats.statusCounts.sent) * 100) 
                      : 0}%
                  </p>
                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <span>{messageStats.statusCounts.delivered} of {messageStats.statusCounts.sent} delivered</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl border border-purple-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-purple-800">Active Campaigns</h3>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar size={16} className="text-purple-600" />
                    </div>
                  </div>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {campaigns.filter(c => c.status === 'in-progress' || c.status === 'scheduled').length}
                  </p>
                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <span>{campaigns.filter(c => c.status === 'scheduled').length} scheduled, {campaigns.filter(c => c.status === 'in-progress').length} in progress</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl border border-amber-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-amber-800">Estimated Cost</h3>
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                  </div>
                  <p className="mt-2 text-3xl font-bold text-gray-900">${messageStats.totalCost}</p>
                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <span>For {messageStats.totalMessages} messages</span>
                  </div>
                </div>
              </div>
              
              {/* Channel Distribution */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm overflow-hidden">
                <h3 className="text-base font-medium text-gray-800 mb-3 pb-2 border-b border-gray-100">Channel Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {Object.entries(messageStats.channels).map(([channel, count]: [string, any]) => {
                    const channelColors = getChannelColorClasses(channel as MessageChannel);
                    return (
                      <div key={channel} className={`${channelColors.bgLight} p-3 rounded-lg border ${channelColors.border}`}>
                        <div className="flex items-center">
                          {getChannelIcon(channel)}
                          <span className={`ml-2 text-sm font-medium capitalize ${channelColors.text}`}>{channel}</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold">{count}</span>
                            <span className="text-xs text-gray-500">
                              {messageStats.totalMessages > 0 
                                ? Math.round((count / messageStats.totalMessages) * 100) 
                                : 0}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${channelColors.gradient}`}
                              style={{ 
                                width: `${messageStats.totalMessages > 0 
                                  ? Math.round((count / messageStats.totalMessages) * 100) 
                                  : 0}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Active Campaigns */}
              {messageStats.campaignStats.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm overflow-hidden">
                  <h3 className="text-base font-medium text-gray-800 mb-3 pb-2 border-b border-gray-100">Campaign Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 rounded-t-lg">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Campaign
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Channel
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Completion
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Delivery Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {messageStats.campaignStats.map((campaign: any) => {
                          const channelColors = getChannelColorClasses(campaign.channel as MessageChannel);
                          return (
                            <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {campaign.name}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                                <div className="flex items-center">
                                  {getChannelIcon(campaign.channel)}
                                  <span className="ml-1.5 capitalize">{campaign.channel}</span>
                                </div>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <span className={`
                                  text-xs font-medium px-2 py-0.5 rounded-full
                                  ${campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    campaign.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                    campaign.status === 'scheduled' ? 'bg-purple-100 text-purple-800' :
                                    'bg-gray-100 text-gray-800'}
                                `}>
                                  {campaign.status.replace('-', ' ')}
                                </span>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-24 h-2 bg-gray-200 rounded-full mr-2 overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full bg-gradient-to-r ${campaign.status === 'completed' 
                                        ? 'from-green-500 to-green-600' 
                                        : campaign.status === 'in-progress' 
                                          ? 'from-blue-500 to-blue-600' 
                                          : 'from-purple-500 to-purple-600'
                                      }`}
                                      style={{ width: `${campaign.completion}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500">{campaign.completion}%</span>
                                </div>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                                <div className="flex items-center">
                                  <span className={campaign.deliveryRate >= 80 ? 'text-green-600' : campaign.deliveryRate >= 50 ? 'text-amber-600' : 'text-red-600'}>
                                    {campaign.deliveryRate}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Recent Activity */}
              {messageStats.recentActivities.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm overflow-hidden">
                  <h3 className="text-base font-medium text-gray-800 mb-3 pb-2 border-b border-gray-100">Recent Activity</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 rounded-t-lg">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Channel
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Recipient
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {messageStats.recentActivities.map((activity: any) => {
                          const channelColors = getChannelColorClasses(activity.type as MessageChannel);
                          return (
                            <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                                {formatDate(new Date(activity.timestamp), 'MMM d, h:mm a')}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                                <div className="flex items-center">
                                  {getChannelIcon(activity.type)}
                                  <span className={`ml-1.5 capitalize ${channelColors.text}`}>{activity.type}</span>
                                </div>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {activity.recipient}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <span className="flex items-center">
                                  {getStatusIcon(activity.status)}
                                  <span className="ml-1.5 text-sm capitalize">
                                    {activity.status}
                                  </span>
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                <BarChart size={48} className="text-indigo-400" />
              </div>
              <p className="text-gray-500 mb-2 text-lg font-medium">No analytics data available</p>
              <p className="text-sm text-gray-400">Start sending messages to see analytics</p>
              <button
                className="mt-6 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg shadow-sm hover:from-indigo-600 hover:to-blue-600 transition-all duration-200"
                onClick={() => onClose()}
              >
                Start Messaging
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mail component mock
const Mail = (props: any) => (
  <svg 
    {...props}
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={props.className || ""}
  >
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

export default CommunicationAnalytics;
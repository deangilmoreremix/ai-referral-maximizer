import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  LayoutDashboard, 
  Clock, 
  FileText, 
  Tag, 
  BarChart, 
  Filter, 
  Download, 
  Trash2, 
  Search, 
  RefreshCw, 
  ChevronDown, 
  BookOpen, 
  FileCode, 
  Sparkles, 
  Mail, 
  Share2, 
  FileBarChart, 
  Edit, 
  Copy, 
  CheckCircle, 
  Calendar, 
  ChevronRight,
  Heart
} from 'lucide-react';
import { EdgeFunctions } from '../services/edgeFunctionsService';
import { supabase } from '../services/supabaseClient';

interface ContentItem {
  id: string;
  content: string;
  revision_count: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  content_type_id: string;
  content_types: {
    name: string;
    category: string;
    has_multiple_days: boolean;
    total_days: number;
    export_options: string[];
  };
}

interface ContentTypeFilter {
  id: string;
  name: string;
  count: number;
}

interface AnalyticsData {
  contentSummary?: {
    total_content_count: number;
    unique_content_types_count: number;
    last_generated_at: string;
    total_revisions: number;
  };
  contentTypeUsage?: {
    content_type_name: string;
    usage_count: number;
  }[];
  actionCounts?: {
    action: string;
    count: number;
  }[];
  recentActivity?: {
    action: string;
    resource_type: string;
    created_at: string;
    details: Record<string, any>;
  }[];
  requiresAuth?: boolean;
}

const ContentDashboard: React.FC = () => {
  const [contentHistory, setContentHistory] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentTypeFilter[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week' | 'day'>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'updated_at' | 'created_at' | 'name'>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const itemsPerPage = 10;
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
  }, []);
  
  // Load content history and analytics
  useEffect(() => {
    loadContentHistory();
    if (isAuthenticated) {
      loadAnalytics();
    }
  }, [timeframe, isAuthenticated]);

  // Apply filters when content or search/filter criteria change
  useEffect(() => {
    applyFilters();
  }, [contentHistory, selectedType, searchQuery, sortBy, sortOrder]);

  const loadContentHistory = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      const history = await EdgeFunctions.ContentHistory.getHistory({
        limit: 100,
        orderBy: 'updated_at',
        order: 'desc'
      });
      
      setContentHistory(history || []);
      
      // Build content type filters
      if (history && history.length > 0) {
        const typeCounts: Record<string, ContentTypeFilter> = {};
        
        // Count content items by type
        history.forEach(item => {
          const typeName = item.content_types.name;
          const typeId = item.content_type_id;
          
          if (!typeCounts[typeId]) {
            typeCounts[typeId] = {
              id: typeId,
              name: typeName,
              count: 1
            };
          } else {
            typeCounts[typeId].count++;
          }
        });
        
        setContentTypes(Object.values(typeCounts).sort((a, b) => b.count - a.count));
      }
    } catch (error) {
      console.error('Error loading content history:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadAnalytics = async () => {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('User not authenticated for analytics loading');
        setAnalytics({ requiresAuth: true });
        return;
      }
      
      const data = await EdgeFunctions.Analytics.getAnalytics({
        timeframe,
        limit: 10
      });
      
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };
  
  // Apply filters, search, and sorting to the content list
  const applyFilters = () => {
    let filtered = [...contentHistory];
    
    // Apply content type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.content_type_id === selectedType);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.content_types.name.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered = filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.content_types.name.localeCompare(b.content_types.name)
          : b.content_types.name.localeCompare(a.content_types.name);
      } else {
        const dateA = new Date(a[sortBy]).getTime();
        const dateB = new Date(b[sortBy]).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
    
    setFilteredContent(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const handleDeleteContent = async (contentId: string) => {
    // First, confirm deletion if not already confirmed
    if (deleteConfirm !== contentId) {
      setDeleteConfirm(contentId);
      return;
    }
    
    // Reset confirmation
    setDeleteConfirm(null);
    
    // Proceed with deletion
    setIsDeleting(contentId);
    try {
      await EdgeFunctions.ContentHistory.deleteContent(contentId);
      setContentHistory(prev => prev.filter(item => item.id !== contentId));
      // Refresh analytics after deletion
      loadAnalytics();
    } catch (error) {
      console.error('Error deleting content:', error);
    } finally {
      setIsDeleting(null);
    }
  };
  
  const copyContentToClipboard = async (item: ContentItem) => {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Error copying content:', error);
    }
  };
  
  const toggleExpandContent = (contentId: string) => {
    setExpandedContent(expandedContent === contentId ? null : contentId);
  };
  
  const getTimeDifference = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
  const paginatedContent = filteredContent.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Helper function to get content type icon
  const getContentTypeIcon = (contentTypeName: string) => {
    switch (contentTypeName) {
      case 'Service Brochures':
        return <BookOpen size={20} className="text-blue-600" />;
      case 'Detailed Case Studies':
        return <FileCode size={20} className="text-purple-600" />;
      case 'Comprehensive Pricing Sheets':
        return <Tag size={20} className="text-green-600" />;
      case 'Complete Email Sequences':
        return <Mail size={20} className="text-red-600" />;
      case 'Interactive Lead Magnets':
        return <Sparkles size={20} className="text-amber-600" />;
      case 'Social Media Marketing Kits':
        return <Share2 size={20} className="text-blue-500" />;
      case 'Detailed Strategic Roadmaps':
        return <FileBarChart size={20} className="text-indigo-600" />;
      case 'Friends and Family Campaign':
        return <Heart size={20} className="text-pink-500" />;
      default:
        return <FileText size={20} className="text-gray-600" />;
    }
  };
  
  // Get category color class
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'branding':
        return 'bg-blue-100 text-blue-800';
      case 'sales':
        return 'bg-green-100 text-green-800';
      case 'marketing':
        return 'bg-purple-100 text-purple-800';
      case 'digital':
        return 'bg-cyan-100 text-cyan-800';
      case 'strategy':
        return 'bg-indigo-100 text-indigo-800';
      case 'research':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Check if user needs to authenticate
  const renderAuthenticationMessage = () => {
    if (isAuthenticated === false) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 w-full max-w-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  Please sign in to view your content dashboard and analytics.
                </p>
                <div className="mt-3">
                  <Link to="/login" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/app" className="text-gray-500 hover:text-gray-700 mr-4">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <LayoutDashboard size={24} className="text-blue-600 mr-2" />
                Content Dashboard
              </h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  loadContentHistory();
                  if (isAuthenticated) {
                    loadAnalytics();
                  }
                }}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAuthenticated === false && renderAuthenticationMessage()}
        
        {isAuthenticated !== false && (
          <>
            {/* Dashboard top section with analytics */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Content count */}
                <div className="bg-white rounded-lg shadow p-4 flex">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText size={20} className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 font-medium">Content Items</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isLoading ? '-' : analytics?.contentSummary?.total_content_count || contentHistory.length}
                    </p>
                  </div>
                </div>
                
                {/* Content types */}
                <div className="bg-white rounded-lg shadow p-4 flex">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Tag size={20} className="text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 font-medium">Content Types</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isLoading ? '-' : analytics?.contentSummary?.unique_content_types_count || contentTypes.length}
                    </p>
                  </div>
                </div>
                
                {/* Revisions */}
                <div className="bg-white rounded-lg shadow p-4 flex">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Edit size={20} className="text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 font-medium">Total Revisions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isLoading ? '-' : analytics?.contentSummary?.total_revisions || "0"}
                    </p>
                  </div>
                </div>
                
                {/* Last created */}
                <div className="bg-white rounded-lg shadow p-4 flex">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <Clock size={20} className="text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 font-medium">Last Generated</p>
                    <p className="text-md font-medium text-gray-900">
                      {isLoading ? '-' : analytics?.contentSummary?.last_generated_at 
                        ? getTimeDifference(analytics.contentSummary.last_generated_at)
                        : 'No content yet'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Filter and search section */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Content Library</h2>
              </div>
              
              <div className="p-4">
                <div className="md:flex items-center justify-between space-y-3 md:space-y-0">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value as any)}
                        className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Time</option>
                        <option value="month">Last Month</option>
                        <option value="week">Last Week</option>
                        <option value="day">Last 24 Hours</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown size={14} className="text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Content Types</option>
                        {contentTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name} ({type.count})
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown size={14} className="text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                          const [newSortBy, newSortOrder] = e.target.value.split('-');
                          setSortBy(newSortBy as any);
                          setSortOrder(newSortOrder as any);
                        }}
                        className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="updated_at-desc">Recently Updated</option>
                        <option value="created_at-desc">Recently Created</option>
                        <option value="created_at-asc">Oldest First</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown size={14} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative flex-1 max-w-lg">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search content..."
                      className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute left-3 top-2">
                      <Search size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content list */}
            <div className="bg-white rounded-lg shadow mb-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-500">Loading your content...</p>
                </div>
              ) : filteredContent.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText size={48} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No content found</p>
                  {searchQuery || selectedType !== 'all' ? (
                    <p className="text-gray-400 mt-2">Try changing your filters</p>
                  ) : (
                    <p className="text-gray-400 mt-2">Start by creating some content</p>
                  )}
                  
                  <Link
                    to="/app"
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                  >
                    Create New Content
                  </Link>
                </div>
              ) : (
                <div>
                  {/* Content items */}
                  <div className="divide-y divide-gray-200">
                    {paginatedContent.map(item => (
                      <div key={item.id} className="p-4">
                        <div className="flex justify-between">
                          <div className="flex items-start">
                            {getContentTypeIcon(item.content_types.name)}
                            <div className="ml-3">
                              <h3 className="text-md font-medium text-gray-900">
                                {item.content_types.name}
                              </h3>
                              <div className="flex items-center mt-1 space-x-2">
                                <span className="text-xs text-gray-500">
                                  Created: {formatDate(item.created_at)}
                                </span>
                                {item.revision_count > 0 && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                    {item.revision_count} revision{item.revision_count > 1 ? 's' : ''}
                                  </span>
                                )}
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(item.content_types.category)}`}>
                                  {item.content_types.category}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            {/* Copy button */}
                            <button 
                              onClick={() => copyContentToClipboard(item)}
                              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                              title="Copy content to clipboard"
                            >
                              {copiedId === item.id ? (
                                <CheckCircle size={18} className="text-green-500" />
                              ) : (
                                <Copy size={18} />
                              )}
                            </button>
                            
                            {/* Delete button */}
                            <button 
                              onClick={() => handleDeleteContent(item.id)}
                              className={`p-1.5 ${deleteConfirm === item.id ? 'text-red-600 bg-red-50' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'} rounded-md`}
                              disabled={isDeleting === item.id}
                              title={deleteConfirm === item.id ? "Click again to confirm deletion" : "Delete content"}
                            >
                              {isDeleting === item.id ? (
                                <RefreshCw size={18} className="animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                            
                            {/* Expand toggle */}
                            <button
                              onClick={() => toggleExpandContent(item.id)}
                              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                              title={expandedContent === item.id ? "Collapse" : "Expand"}
                            >
                              <ChevronDown 
                                size={18}
                                className={`transform transition-transform ${expandedContent === item.id ? 'rotate-180' : ''}`}
                              />
                            </button>
                          </div>
                        </div>
                        
                        {/* Expanded content preview */}
                        {expandedContent === item.id && (
                          <div className="mt-4">
                            <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                              <div className="mb-3 flex justify-between items-center">
                                <h4 className="text-sm font-medium text-gray-700">Content Preview</h4>
                                
                                <div className="flex items-center space-x-2">
                                  <Link
                                    to={`/app`}
                                    state={{ selectedContent: item.content_types.name, contentId: item.id }}
                                    className="flex items-center px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700"
                                  >
                                    <Edit size={14} className="mr-1" />
                                    Edit/View
                                  </Link>
                                  
                                  <div className="relative">
                                    <button
                                      className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded hover:bg-gray-200"
                                    >
                                      <Download size={14} className="mr-1" />
                                      Export
                                      <ChevronDown size={12} className="ml-1" />
                                    </button>
                                    {/* Export options dropdown could go here */}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="whitespace-pre-wrap text-sm text-gray-800 max-h-96 overflow-y-auto">
                                {item.content.substring(0, 800)}
                                {item.content.length > 800 && (
                                  <span className="text-blue-600">... (view full content)</span>
                                )}
                              </div>
                              
                              {item.content_types.has_multiple_days && (
                                <div className="mt-3 border-t border-gray-200 pt-3">
                                  <div className="flex items-center text-xs text-gray-600">
                                    <Calendar size={14} className="mr-1 text-blue-500" />
                                    This is a {item.content_types.total_days}-day content plan
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-t border-gray-200">
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                            <span className="font-medium">
                              {Math.min(currentPage * itemsPerPage, filteredContent.length)}
                            </span>{' '}
                            of <span className="font-medium">{filteredContent.length}</span> results
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              Previous
                            </button>
                            
                            {[...Array(totalPages)].map((_, index) => (
                              <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === index + 1
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {index + 1}
                              </button>
                            ))}
                            
                            <button
                              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                              disabled={currentPage === totalPages}
                              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              Next
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Analytics Section */}
            {analytics && !analytics.requiresAuth && (
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <BarChart size={20} className="text-blue-600 mr-2" />
                    Usage Analytics
                  </h2>
                  <div className="text-sm text-gray-500">
                    {timeframe === 'day' ? 'Last 24 hours' :
                     timeframe === 'week' ? 'Last 7 days' :
                     timeframe === 'month' ? 'Last 30 days' : 'All time'}
                  </div>
                </div>
                
                <div className="p-4">
                  {/* Most used content types */}
                  {analytics.contentTypeUsage && analytics.contentTypeUsage.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Most Used Content Types</h3>
                      <div className="space-y-2">
                        {analytics.contentTypeUsage.slice(0, 5).map((typeUsage, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-24 md:w-48 text-xs text-gray-500">
                              {typeUsage.content_type_name}
                            </div>
                            <div className="flex-1">
                              <div className="relative pt-1">
                                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                                  <div 
                                    style={{ width: `${Math.min(100, (typeUsage.usage_count / (analytics.contentTypeUsage?.[0]?.usage_count || 1)) * 100)}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="w-10 text-right text-xs font-medium text-gray-700">
                              {typeUsage.usage_count}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Recent activity */}
                  {analytics.recentActivity && analytics.recentActivity.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h3>
                      <ul className="space-y-2">
                        {analytics.recentActivity.slice(0, 5).map((activity, index) => {
                          const getActivityLabel = () => {
                            switch (activity.action) {
                              case 'generate_content':
                                return 'Generated new content';
                              case 'revise_content':
                                return 'Revised content';
                              case 'update_personalization':
                                return 'Updated personalization settings';
                              case 'analyze_document':
                                return 'Analyzed document';
                              case 'analyze_linkedin':
                                return 'Analyzed LinkedIn profile';
                              default:
                                return activity.action.replace(/_/g, ' ');
                            }
                          };
                          
                          return (
                            <li key={index} className="text-xs flex items-start">
                              <div className="bg-gray-100 rounded-full p-1 mr-2">
                                <Clock size={12} className="text-gray-500" />
                              </div>
                              <div className="flex-1">
                                <span className="font-medium">{getActivityLabel()}</span>
                                <span className="ml-1 text-gray-500">
                                  {getTimeDifference(activity.created_at)}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      
                      <div className="mt-4 text-xs text-center">
                        <Link to="#" className="text-blue-600 hover:text-blue-800 flex items-center justify-center">
                          View all activity
                          <ChevronRight size={14} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Back to App button */}
            <div className="text-center mb-8">
              <Link
                to="/app"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Content Generator
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ContentDashboard;
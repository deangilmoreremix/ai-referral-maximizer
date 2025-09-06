import { supabase } from './supabaseClient';

// Types for our data structures
export interface UserTemplate {
  id: string;
  name: string;
  content: string;
  type: 'sms' | 'voice' | 'whatsapp' | 'messenger';
  created: string;
}

export interface UserCampaign {
  id: string;
  name: string;
  messages: any[];
  created: string;
  lastEdited: string;
}

export interface MessageLog {
  id: string;
  channel: string;
  status: string;
  to: string;
  timestamp: string;
  cost?: number;
}

// Check if user is authenticated
export async function isUserAuthenticated(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}

// Get current user ID
export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

// Sync user templates to Supabase
export async function syncTemplatesToSupabase(templates: UserTemplate[]): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  try {
    // Clear existing templates for this user
    await supabase.from('user_templates').delete().eq('user_id', userId);

    // Insert new templates
    if (templates.length > 0) {
      const templatesToInsert = templates.map(template => ({
        user_id: userId,
        name: template.name,
        content: template.content,
        type: template.type,
        created_at: template.created
      }));

      const { error } = await supabase
        .from('user_templates')
        .insert(templatesToInsert);

      if (error) throw error;
    }

    console.log('Templates synced to Supabase successfully');
  } catch (error) {
    console.error('Error syncing templates to Supabase:', error);
  }
}

// Load user templates from Supabase
export async function loadTemplatesFromSupabase(): Promise<UserTemplate[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('user_templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(template => ({
      id: template.id,
      name: template.name,
      content: template.content,
      type: template.type,
      created: template.created_at
    }));
  } catch (error) {
    console.error('Error loading templates from Supabase:', error);
    return [];
  }
}

// Sync user campaigns to Supabase
export async function syncCampaignsToSupabase(campaigns: UserCampaign[]): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  try {
    // Clear existing campaigns for this user
    await supabase.from('user_campaigns').delete().eq('user_id', userId);

    // Insert new campaigns
    if (campaigns.length > 0) {
      const campaignsToInsert = campaigns.map(campaign => ({
        user_id: userId,
        name: campaign.name,
        messages: campaign.messages,
        created_at: campaign.created,
        updated_at: campaign.lastEdited
      }));

      const { error } = await supabase
        .from('user_campaigns')
        .insert(campaignsToInsert);

      if (error) throw error;
    }

    console.log('Campaigns synced to Supabase successfully');
  } catch (error) {
    console.error('Error syncing campaigns to Supabase:', error);
  }
}

// Load user campaigns from Supabase
export async function loadCampaignsFromSupabase(): Promise<UserCampaign[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('user_campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return data.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      messages: campaign.messages,
      created: campaign.created_at,
      lastEdited: campaign.updated_at
    }));
  } catch (error) {
    console.error('Error loading campaigns from Supabase:', error);
    return [];
  }
}

// Sync message logs to Supabase
export async function syncMessageLogsToSupabase(logs: MessageLog[]): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  try {
    // Only sync logs that don't already exist (avoid duplicates)
    const existingLogIds = new Set();
    const { data: existingLogs } = await supabase
      .from('message_logs')
      .select('id')
      .eq('user_id', userId);

    existingLogs?.forEach(log => existingLogIds.add(log.id));

    const newLogs = logs.filter(log => !existingLogIds.has(log.id));

    if (newLogs.length > 0) {
      const logsToInsert = newLogs.map(log => ({
        user_id: userId,
        channel: log.channel,
        status: log.status,
        recipient: log.to,
        sent_at: log.timestamp,
        cost: log.cost || 0
      }));

      const { error } = await supabase
        .from('message_logs')
        .insert(logsToInsert);

      if (error) throw error;
    }

    console.log('Message logs synced to Supabase successfully');
  } catch (error) {
    console.error('Error syncing message logs to Supabase:', error);
  }
}

// Load message logs from Supabase
export async function loadMessageLogsFromSupabase(): Promise<MessageLog[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('message_logs')
      .select('*')
      .eq('user_id', userId)
      .order('sent_at', { ascending: false });

    if (error) throw error;

    return data.map(log => ({
      id: log.id,
      channel: log.channel,
      status: log.status,
      to: log.recipient,
      timestamp: log.sent_at,
      cost: log.cost
    }));
  } catch (error) {
    console.error('Error loading message logs from Supabase:', error);
    return [];
  }
}

// Main sync function - sync all data to Supabase
export async function syncAllDataToSupabase(): Promise<void> {
  if (!(await isUserAuthenticated())) {
    console.log('User not authenticated, skipping Supabase sync');
    return;
  }

  try {
    // Load data from localStorage
    const templates = JSON.parse(localStorage.getItem('user_templates') || '[]');
    const campaigns = JSON.parse(localStorage.getItem('user_campaigns') || '[]');
    const messageLogs = JSON.parse(localStorage.getItem('message_logs') || '[]');

    // Sync to Supabase
    await Promise.all([
      syncTemplatesToSupabase(templates),
      syncCampaignsToSupabase(campaigns),
      syncMessageLogsToSupabase(messageLogs)
    ]);

    console.log('All data synced to Supabase successfully');
  } catch (error) {
    console.error('Error syncing all data to Supabase:', error);
  }
}

// Main load function - load all data from Supabase and merge with localStorage
export async function loadAllDataFromSupabase(): Promise<void> {
  if (!(await isUserAuthenticated())) {
    console.log('User not authenticated, skipping Supabase load');
    return;
  }

  try {
    // Load data from Supabase
    const [templates, campaigns, messageLogs] = await Promise.all([
      loadTemplatesFromSupabase(),
      loadCampaignsFromSupabase(),
      loadMessageLogsFromSupabase()
    ]);

    // Merge with existing localStorage data (Supabase takes precedence for conflicts)
    if (templates.length > 0) {
      const existingTemplates = JSON.parse(localStorage.getItem('user_templates') || '[]');
      const mergedTemplates = [...templates, ...existingTemplates.filter((t: UserTemplate) =>
        !templates.some(st => st.name === t.name)
      )];
      localStorage.setItem('user_templates', JSON.stringify(mergedTemplates));
    }

    if (campaigns.length > 0) {
      const existingCampaigns = JSON.parse(localStorage.getItem('user_campaigns') || '[]');
      const mergedCampaigns = [...campaigns, ...existingCampaigns.filter((c: UserCampaign) =>
        !campaigns.some(sc => sc.name === c.name)
      )];
      localStorage.setItem('user_campaigns', JSON.stringify(mergedCampaigns));
    }

    if (messageLogs.length > 0) {
      const existingLogs = JSON.parse(localStorage.getItem('message_logs') || '[]');
      const mergedLogs = [...messageLogs, ...existingLogs];
      localStorage.setItem('message_logs', JSON.stringify(mergedLogs));
    }

    console.log('All data loaded from Supabase and merged with localStorage');
  } catch (error) {
    console.error('Error loading all data from Supabase:', error);
  }
}
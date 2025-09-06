import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Production-ready service layer
export class SupabaseService {
  
  // Content Types Management
  static async getContentTypes() {
    const { data, error } = await supabase
      .from('content_types')
      .select('*')
      .eq('is_active', true)
      .order('popularity_score', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // User Preferences
  static async getUserPreferences(userId: string) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async saveUserPreferences(userId: string, preferences: any) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Generated Content Management
  static async saveGeneratedContent(userId: string, contentData: any) {
    const { data, error } = await supabase
      .from('generated_content')
      .insert({
        user_id: userId,
        ...contentData
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Log the generation
    await this.logUsage(userId, 'generate_content', {
      content_type: contentData.content_type_id,
      ai_model: contentData.ai_model
    });
    
    return data;
  }

  static async getContentHistory(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('generated_content')
      .select(`
        *,
        content_types (
          name,
          category,
          has_multiple_days,
          total_days,
          export_options
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  // Document Analysis
  static async saveDocumentAnalysis(userId: string, analysisData: any) {
    const { data, error } = await supabase
      .from('analyzed_documents')
      .insert({
        user_id: userId,
        ...analysisData
      })
      .select()
      .single();
    
    if (error) throw error;
    
    await this.logUsage(userId, 'analyze_document', {
      file_type: analysisData.file_type,
      file_size: analysisData.file_size
    });
    
    return data;
  }

  // LinkedIn Profile Management
  static async saveLinkedInProfile(userId: string, profileData: any) {
    const { data, error } = await supabase
      .from('linkedin_profiles')
      .upsert({
        user_id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    await this.logUsage(userId, 'analyze_linkedin', {
      linkedin_url: profileData.linkedin_url
    });
    
    return data;
  }

  // Communication Logging
  static async logCommunication(userId: string, communicationData: any) {
    const { data, error } = await supabase
      .from('communication_logs')
      .insert({
        user_id: userId,
        ...communicationData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Campaign Management
  static async createCampaign(userId: string, campaignData: any) {
    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        user_id: userId,
        ...campaignData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getCampaigns(userId: string) {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Usage Analytics
  static async logUsage(userId: string, action: string, metadata: any = {}) {
    const { error } = await supabase
      .from('usage_logs')
      .insert({
        user_id: userId,
        action,
        metadata,
        created_at: new Date().toISOString()
      });
    
    if (error) console.error('Failed to log usage:', error);
  }

  static async getUsageAnalytics(userId: string, timeframe = '30d') {
    const { data, error } = await supabase
      .rpc('get_user_analytics', {
        user_id: userId,
        timeframe
      });
    
    if (error) throw error;
    return data;
  }

  // Template Management
  static async saveTemplate(userId: string, templateData: any) {
    const { data, error } = await supabase
      .from('content_templates')
      .insert({
        user_id: userId,
        ...templateData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getTemplates(userId: string, includePublic = true) {
    let query = supabase
      .from('content_templates')
      .select('*');
    
    if (includePublic) {
      query = query.or(`user_id.eq.${userId},is_public.eq.true`);
    } else {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}
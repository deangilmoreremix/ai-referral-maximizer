/**
 * Conversation Service
 * Real Supabase integration for conversation management
 */

import { supabase } from './supabaseClient';

export interface ConversationMessage {
  id: string;
  context_id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  quality_score?: number;
  has_web_search?: boolean;
  has_file_attachment?: boolean;
  has_image_generation?: boolean;
  has_code_execution?: boolean;
  has_video_generation?: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageMetadata {
  reasoning?: string;
  quality_score?: number;
  has_web_search?: boolean;
  has_file_attachment?: boolean;
  has_image_generation?: boolean;
  has_code_execution?: boolean;
  has_video_generation?: boolean;
}

export interface GeneratedVideo {
  id: string;
  message_id: string;
  prompt: string;
  video_url: string;
  model: string;
  duration: number;
  aspect_ratio: string;
  created_at: string;
}

export interface ConversationAttachment {
  id: string;
  message_id?: string;
  context_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  created_at: string;
}

class ConversationService {
  /**
   * Add a message to the conversation
   */
  async addMessage(
    contextId: string,
    role: 'user' | 'assistant',
    content: string,
    metadata?: MessageMetadata
  ): Promise<ConversationMessage> {
    const { data, error } = await supabase
      .from('conversation_messages')
      .insert({
        context_id: contextId,
        role,
        content,
        reasoning: metadata?.reasoning,
        quality_score: metadata?.quality_score,
        has_web_search: metadata?.has_web_search || false,
        has_file_attachment: metadata?.has_file_attachment || false,
        has_image_generation: metadata?.has_image_generation || false,
        has_code_execution: metadata?.has_code_execution || false,
        has_video_generation: metadata?.has_video_generation || false
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding message:', error);
      throw new Error(`Failed to add message: ${error.message}`);
    }

    return data;
  }

  /**
   * Get all messages for a conversation context
   */
  async getMessages(contextId: string): Promise<ConversationMessage[]> {
    const { data, error } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('context_id', contextId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Update message quality score
   */
  async updateMessageQualityScore(messageId: string, score: number): Promise<void> {
    const { error } = await supabase
      .from('conversation_messages')
      .update({ quality_score: score, updated_at: new Date().toISOString() })
      .eq('id', messageId);

    if (error) {
      console.error('Error updating quality score:', error);
      throw new Error(`Failed to update quality score: ${error.message}`);
    }
  }

  /**
   * Add web search result
   */
  async addWebSearchResult(
    messageId: string,
    query: string,
    results: any[]
  ): Promise<void> {
    const { error } = await supabase
      .from('web_search_results')
      .insert({
        message_id: messageId,
        query,
        results: results
      });

    if (error) {
      console.error('Error saving web search results:', error);
      throw new Error(`Failed to save search results: ${error.message}`);
    }
  }

  /**
   * Get web search results for a message
   */
  async getWebSearchResults(messageId: string): Promise<any> {
    const { data, error } = await supabase
      .from('web_search_results')
      .select('*')
      .eq('message_id', messageId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching web search results:', error);
      return null;
    }

    return data;
  }

  /**
   * Upload file attachment
   */
  async uploadAttachment(
    contextId: string,
    file: File,
    messageId?: string
  ): Promise<ConversationAttachment> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${contextId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('conversation-attachments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data, error: dbError } = await supabase
        .from('conversation_attachments')
        .insert({
          message_id: messageId,
          context_id: contextId,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: filePath
        })
        .select()
        .single();

      if (dbError) {
        await supabase.storage.from('conversation-attachments').remove([filePath]);
        throw new Error(`Database error: ${dbError.message}`);
      }

      return data;
    } catch (error: any) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  }

  /**
   * Get attachments for a conversation or message
   */
  async getAttachments(contextId: string, messageId?: string): Promise<ConversationAttachment[]> {
    let query = supabase
      .from('conversation_attachments')
      .select('*')
      .eq('context_id', contextId);

    if (messageId) {
      query = query.eq('message_id', messageId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching attachments:', error);
      throw new Error(`Failed to fetch attachments: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get signed URL for attachment download
   */
  async getAttachmentUrl(storagePath: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await supabase.storage
      .from('conversation-attachments')
      .createSignedUrl(storagePath, expiresIn);

    if (error || !data) {
      console.error('Error getting attachment URL:', error);
      throw new Error(`Failed to get attachment URL: ${error?.message}`);
    }

    return data.signedUrl;
  }

  /**
   * Delete an attachment
   */
  async deleteAttachment(attachmentId: string): Promise<void> {
    const { data: attachment, error: fetchError } = await supabase
      .from('conversation_attachments')
      .select('storage_path')
      .eq('id', attachmentId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch attachment: ${fetchError.message}`);
    }

    const { error: storageError } = await supabase.storage
      .from('conversation-attachments')
      .remove([attachment.storage_path]);

    if (storageError) {
      console.error('Error deleting from storage:', storageError);
    }

    const { error: dbError } = await supabase
      .from('conversation_attachments')
      .delete()
      .eq('id', attachmentId);

    if (dbError) {
      throw new Error(`Failed to delete attachment: ${dbError.message}`);
    }
  }

  /**
   * Save code execution result
   */
  async saveCodeExecution(
    messageId: string,
    code: string,
    language: string,
    output?: string,
    error?: string
  ): Promise<void> {
    const { error: dbError } = await supabase
      .from('code_executions')
      .insert({
        message_id: messageId,
        code,
        language,
        output,
        error
      });

    if (dbError) {
      console.error('Error saving code execution:', dbError);
      throw new Error(`Failed to save code execution: ${dbError.message}`);
    }
  }

  /**
   * Get code executions for a message
   */
  async getCodeExecutions(messageId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('code_executions')
      .select('*')
      .eq('message_id', messageId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching code executions:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Save generated image
   */
  async saveGeneratedImage(
    messageId: string,
    prompt: string,
    imageUrl: string,
    model: string
  ): Promise<void> {
    const { error } = await supabase
      .from('generated_images')
      .insert({
        message_id: messageId,
        prompt,
        image_url: imageUrl,
        model
      });

    if (error) {
      console.error('Error saving generated image:', error);
      throw new Error(`Failed to save generated image: ${error.message}`);
    }
  }

  /**
   * Get generated images for a message
   */
  async getGeneratedImages(messageId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .eq('message_id', messageId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching generated images:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Delete a conversation context and all related data
   */
  async deleteContext(contextId: string): Promise<void> {
    const { error } = await supabase
      .from('conversation_messages')
      .delete()
      .eq('context_id', contextId);

    if (error) {
      throw new Error(`Failed to delete context: ${error.message}`);
    }

    try {
      const { data: files } = await supabase.storage
        .from('conversation-attachments')
        .list(contextId);

      if (files && files.length > 0) {
        const filePaths = files.map(f => `${contextId}/${f.name}`);
        await supabase.storage
          .from('conversation-attachments')
          .remove(filePaths);
      }
    } catch (error) {
      console.error('Error cleaning up storage:', error);
    }
  }

  /**
   * Save generated video
   */
  async saveGeneratedVideo(
    messageId: string,
    prompt: string,
    videoUrl: string,
    model: string,
    duration: number,
    aspectRatio?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('generated_videos')
      .insert({
        message_id: messageId,
        prompt,
        video_url: videoUrl,
        model,
        duration,
        aspect_ratio: aspectRatio || '16:9'
      });

    if (error) {
      console.error('Error saving generated video:', error);
      throw new Error(`Failed to save generated video: ${error.message}`);
    }
  }

  /**
   * Get generated videos for a message
   */
  async getGeneratedVideos(messageId: string): Promise<GeneratedVideo[]> {
    const { data, error } = await supabase
      .from('generated_videos')
      .select('*')
      .eq('message_id', messageId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching generated videos:', error);
      return [];
    }

    return data || [];
  }
}

export const conversationService = new ConversationService();
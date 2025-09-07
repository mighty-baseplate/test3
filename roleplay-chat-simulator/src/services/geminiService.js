/**
 * Google Gemini Flash 1.5 API Service
 * Handles AI character responses with emotion detection and selective TTS text extraction
 */

import { emotionKeywords } from '../data/characters.js';

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
    this.model = 'gemini-1.5-flash';
    
    if (!this.apiKey) {
      console.warn('Gemini API key not found in environment variables');
    }
  }

  /**
   * Send message to Gemini Flash 1.5 and get character response
   * @param {string} message - User message
   * @param {Object} character - Character object with personality prompt
   * @param {Array} history - Previous conversation history
   * @returns {Promise<Object>} Response with message, emotion, and TTS text
   */
  async sendMessage(message, character, history = []) {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const prompt = this.buildEnhancedPrompt(message, character, history);
      
      const response = await fetch(
        `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ text: prompt }] 
            }],
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 500,
              topP: 0.8,
              topK: 40
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return this.processResponse(data, character);
      
    } catch (error) {
      console.error('Gemini Service Error:', error);
      
      // Provide fallback response to maintain chat flow
      return {
        success: false,
        message: `*${character.name} seems to be thinking deeply and cannot respond right now*`,
        emotion: 'thinking',
        ttsText: 'thinking deeply',
        error: error.message,
        usage: { tokens: 0 }
      };
    }
  }

  /**
   * Build enhanced prompt with character personality and conversation context
   * @param {string} message - User message
   * @param {Object} character - Character object
   * @param {Array} history - Conversation history
   * @returns {string} Enhanced prompt for Gemini
   */
  buildEnhancedPrompt(message, character, history) {
    // Build conversation context from recent history
    const contextHistory = history.slice(-6).map(msg => 
      `${msg.sender === 'user' ? 'User' : character.name}: ${msg.text}`
    ).join('\n');

    return `${character.prompt}

CRITICAL INSTRUCTIONS FOR EMOTIONAL EXPRESSION:
- When expressing emotions or actions, wrap them in asterisks like *thinking deeply* or *smiles warmly*
- Use short interjections like *hmm*, *ah*, *oh* when appropriate for your character
- ONLY the text within asterisks will be read aloud by text-to-speech
- Regular dialogue will be displayed but not spoken unless it's very short (under 5 words)
- Stay true to your character's personality and speaking style
- Keep responses engaging but concise (under 100 words)

${contextHistory ? `Previous conversation:\n${contextHistory}\n` : ''}
User: ${message}
${character.name}:`;
  }

  /**
   * Process Gemini API response and extract emotion/TTS data
   * @param {Object} data - Raw API response
   * @param {Object} character - Character object
   * @returns {Object} Processed response
   */
  processResponse(data, character) {
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      const text = data.candidates[0].content.parts[0].text.trim();
      const emotion = this.detectEmotion(text);
      const ttsText = this.extractTTSText(text);
      
      return {
        success: true,
        message: text,
        emotion,
        ttsText,
        usage: {
          tokens: data.usageMetadata?.totalTokenCount || 0,
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          candidatesTokens: data.usageMetadata?.candidatesTokenCount || 0
        }
      };
    }
    
    throw new Error('Invalid response format from Gemini API');
  }

  /**
   * Detect emotion from AI response text using keyword matching
   * @param {string} text - AI response text
   * @returns {string} Detected emotion or 'neutral'
   */
  detectEmotion(text) {
    const lowercaseText = text.toLowerCase();
    
    // Check each emotion category for keyword matches
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const hasMatch = keywords.some(keyword => 
        lowercaseText.includes(keyword.toLowerCase())
      );
      
      if (hasMatch) {
        return emotion;
      }
    }
    
    // Default to neutral if no specific emotion detected
    return 'neutral';
  }

  /**
   * Extract text within asterisks for TTS, or short responses
   * @param {string} text - Full AI response text
   * @returns {string|null} Text to be spoken or null if nothing should be spoken
   */
  extractTTSText(text) {
    // First, try to find text within asterisks
    const asteriskMatches = text.match(/\*(.*?)\*/g);
    if (asteriskMatches && asteriskMatches.length > 0) {
      return asteriskMatches
        .map(match => match.replace(/\*/g, '').trim())
        .filter(match => match.length > 0)
        .join('. ');
    }
    
    // If no asterisks, check if the entire response is short enough to speak
    const cleanText = text.replace(/[^\w\s.,!?]/gi, '').trim();
    const wordCount = cleanText.split(/\s+/).length;
    
    // Only speak very short responses (5 words or less) if no asterisks
    if (wordCount <= 5 && cleanText.length > 0) {
      return cleanText;
    }
    
    // Don't speak long text without asterisks
    return null;
  }

  /**
   * Test API connection
   * @returns {Promise<boolean>} True if API is accessible
   */
  async testConnection() {
    try {
      const response = await fetch(
        `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Hello' }] }],
            generationConfig: { maxOutputTokens: 10 }
          })
        }
      );
      
      return response.ok;
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }
}

export default GeminiService;
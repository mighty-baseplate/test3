/**
 * ElevenLabs Text-to-Speech API Service
 * Handles professional voice synthesis for character responses
 */

class ElevenLabsService {
  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    this.baseURL = 'https://api.elevenlabs.io/v1';
    this.audioCache = new Map(); // Cache for generated audio
    
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not found in environment variables');
    }
  }

  /**
   * Generate speech from text using character-specific voice
   * @param {string} text - Text to convert to speech
   * @param {string} voiceId - ElevenLabs voice ID
   * @param {Object} voiceSettings - Voice configuration settings
   * @returns {Promise<Object>} Audio result with URL and cleanup function
   */
  async generateSpeech(text, voiceId, voiceSettings = {}) {
    if (!text || text.trim().length === 0) {
      return { success: false, error: 'No text provided' };
    }

    if (!this.apiKey) {
      return { success: false, error: 'ElevenLabs API key not configured' };
    }

    // Check cache first
    const cacheKey = `${voiceId}-${text}-${JSON.stringify(voiceSettings)}`;
    if (this.audioCache.has(cacheKey)) {
      const cachedUrl = this.audioCache.get(cacheKey);
      return {
        success: true,
        audioUrl: cachedUrl,
        cached: true,
        cleanup: () => this.cleanupAudio(cacheKey)
      };
    }

    try {
      const response = await fetch(
        `${this.baseURL}/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey
          },
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: voiceSettings.stability || 0.5,
              similarity_boost: voiceSettings.similarity_boost || 0.8,
              style: voiceSettings.style || 0.2,
              use_speaker_boost: voiceSettings.use_speaker_boost || true
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      const audioData = await response.arrayBuffer();
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Cache the audio URL
      this.audioCache.set(cacheKey, audioUrl);
      
      return {
        success: true,
        audioUrl,
        cleanup: () => this.cleanupAudio(cacheKey)
      };

    } catch (error) {
      console.error('ElevenLabs TTS Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate speech for character with their specific voice settings
   * @param {string} text - Text to speak
   * @param {Object} character - Character object with voice configuration
   * @returns {Promise<Object>} Audio result
   */
  async generateCharacterSpeech(text, character) {
    if (!character.voiceId) {
      return { success: false, error: 'Character has no voice configured' };
    }

    return await this.generateSpeech(
      text,
      character.voiceId,
      character.voiceSettings || {}
    );
  }

  /**
   * Get available voices from ElevenLabs
   * @returns {Promise<Array>} Array of available voices
   */
  async getVoices() {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/voices`, {
        headers: { 'xi-api-key': this.apiKey }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];
      
    } catch (error) {
      console.error('Error fetching voices:', error);
      return [];
    }
  }

  /**
   * Get current API usage statistics
   * @returns {Promise<Object>} Usage information
   */
  async getUsage() {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/user/subscription`, {
        headers: { 'xi-api-key': this.apiKey }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch usage: ${response.status}`);
      }

      const data = await response.json();
      return {
        charactersUsed: data.character_count || 0,
        characterLimit: data.character_limit || 10000,
        canReset: data.can_extend || false,
        nextResetDate: data.next_character_count_reset_unix 
          ? new Date(data.next_character_count_reset_unix * 1000)
          : null
      };
      
    } catch (error) {
      console.error('Error fetching usage:', error);
      return {
        charactersUsed: 0,
        characterLimit: 10000,
        canReset: false,
        nextResetDate: null
      };
    }
  }

  /**
   * Test API connection
   * @returns {Promise<boolean>} True if API is accessible
   */
  async testConnection() {
    try {
      const voices = await this.getVoices();
      return Array.isArray(voices);
    } catch (error) {
      console.error('ElevenLabs connection test failed:', error);
      return false;
    }
  }

  /**
   * Clean up audio resources
   * @param {string} cacheKey - Cache key for the audio
   */
  cleanupAudio(cacheKey) {
    if (this.audioCache.has(cacheKey)) {
      const audioUrl = this.audioCache.get(cacheKey);
      URL.revokeObjectURL(audioUrl);
      this.audioCache.delete(cacheKey);
    }
  }

  /**
   * Clean up all cached audio resources
   */
  cleanupAllAudio() {
    for (const [key, url] of this.audioCache.entries()) {
      URL.revokeObjectURL(url);
    }
    this.audioCache.clear();
  }

  /**
   * Get cache size for monitoring
   * @returns {number} Number of cached audio files
   */
  getCacheSize() {
    return this.audioCache.size;
  }
}

export default ElevenLabsService;
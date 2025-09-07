/**
 * Custom Hook for ElevenLabs Text-to-Speech
 * Manages TTS generation, playback, and usage tracking
 */

import { useCallback, useRef, useEffect } from 'react';
import { useApp, actionTypes } from '../context/AppContext.jsx';
import ElevenLabsService from '../services/elevenLabsService.js';

const useElevenLabsTTS = () => {
  const { state, dispatch } = useApp();
  const elevenLabsService = useRef(new ElevenLabsService()).current;
  const currentAudio = useRef(null);
  const audioCleanupCallbacks = useRef(new Set());
  
  /**
   * Generate and play TTS audio
   * @param {string} text - Text to convert to speech
   * @param {Object} character - Character object with voice settings
   * @returns {Promise<boolean>} Success status
   */
  const generateAndPlay = useCallback(async (text, character) => {
    if (!state.tts.isEnabled || !text || !character) {
      return false;
    }
    
    try {
      dispatch({ type: actionTypes.SET_TTS_GENERATING, payload: true });
      
      // Stop any currently playing audio
      await stopAudio();
      
      // Generate TTS audio
      const result = await elevenLabsService.generateCharacterSpeech(text, character);
      
      if (result.success) {
        // Create audio element
        const audio = new Audio(result.audioUrl);
        audio.volume = state.tts.volume;
        
        // Set up event listeners
        audio.onplay = () => {
          dispatch({ type: actionTypes.SET_TTS_PLAYING, payload: true });
        };
        
        audio.onended = () => {
          dispatch({ type: actionTypes.SET_TTS_PLAYING, payload: false });
          if (result.cleanup) result.cleanup();
          currentAudio.current = null;
        };
        
        audio.onerror = (error) => {
          console.error('TTS audio playback error:', error);
          dispatch({ type: actionTypes.SET_TTS_PLAYING, payload: false });
          if (result.cleanup) result.cleanup();
          currentAudio.current = null;
        };
        
        // Store references for cleanup
        currentAudio.current = audio;
        if (result.cleanup) {
          audioCleanupCallbacks.current.add(result.cleanup);
        }
        
        // Play audio
        await audio.play();
        
        // Update usage stats (estimate based on text length)
        const estimatedCharacters = text.length;
        const newUsage = {
          ...state.tts.usage,
          charactersUsed: state.tts.usage.charactersUsed + estimatedCharacters
        };
        dispatch({ type: actionTypes.UPDATE_TTS_USAGE, payload: newUsage });
        
        return true;
      } else {
        console.warn('TTS generation failed:', result.error);
        return false;
      }
      
    } catch (error) {
      console.error('TTS error:', error);
      return false;
    } finally {
      dispatch({ type: actionTypes.SET_TTS_GENERATING, payload: false });
    }
  }, [state.tts.isEnabled, state.tts.volume, state.tts.usage, dispatch, elevenLabsService]);
  
  /**
   * Stop currently playing audio
   */
  const stopAudio = useCallback(async () => {
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current.currentTime = 0;
      currentAudio.current = null;
    }
    
    // Clean up any audio resources
    audioCleanupCallbacks.current.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.warn('Audio cleanup error:', error);
      }
    });
    audioCleanupCallbacks.current.clear();
    
    dispatch({ type: actionTypes.SET_TTS_PLAYING, payload: false });
  }, [dispatch]);
  
  /**
   * Toggle TTS enabled/disabled
   * @param {boolean} enabled - Whether to enable TTS
   */
  const toggleEnabled = useCallback((enabled) => {
    dispatch({ type: actionTypes.SET_TTS_ENABLED, payload: enabled });
    
    // Stop audio if disabling
    if (!enabled) {
      stopAudio();
    }
  }, [dispatch, stopAudio]);
  
  /**
   * Set TTS volume
   * @param {number} volume - Volume level (0-1)
   */
  const setVolume = useCallback((volume) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    dispatch({ type: actionTypes.SET_TTS_VOLUME, payload: clampedVolume });
    
    // Update current audio volume if playing
    if (currentAudio.current) {
      currentAudio.current.volume = clampedVolume;
    }
  }, [dispatch]);
  
  /**
   * Get current usage statistics
   * @returns {Promise<Object>} Usage information
   */
  const getUsageStats = useCallback(async () => {
    try {
      const usage = await elevenLabsService.getUsage();
      dispatch({ type: actionTypes.UPDATE_TTS_USAGE, payload: usage });
      return usage;
    } catch (error) {
      console.warn('Failed to fetch TTS usage:', error);
      return state.tts.usage;
    }
  }, [elevenLabsService, dispatch, state.tts.usage]);
  
  /**
   * Test TTS with sample text
   * @param {Object} character - Character to test with
   * @returns {Promise<boolean>} Success status
   */
  const testTTS = useCallback(async (character) => {
    const testText = 'Hello, this is a test of the text-to-speech system.';
    return await generateAndPlay(testText, character);
  }, [generateAndPlay]);
  
  /**
   * Check if usage is near limit
   * @returns {boolean} True if near usage limit
   */
  const isNearUsageLimit = useCallback(() => {
    const { charactersUsed, characterLimit } = state.tts.usage;
    return (charactersUsed / characterLimit) > 0.8;
  }, [state.tts.usage]);
  
  /**
   * Get available voices
   * @returns {Promise<Array>} List of available voices
   */
  const getAvailableVoices = useCallback(async () => {
    try {
      return await elevenLabsService.getVoices();
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      return [];
    }
  }, [elevenLabsService]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      elevenLabsService.cleanupAllAudio();
    };
  }, [stopAudio, elevenLabsService]);
  
  // Auto-stop when TTS is disabled
  useEffect(() => {
    if (!state.tts.isEnabled && state.tts.isPlaying) {
      stopAudio();
    }
  }, [state.tts.isEnabled, state.tts.isPlaying, stopAudio]);
  
  return {
    // State
    isEnabled: state.tts.isEnabled,
    isGenerating: state.tts.isGenerating,
    isPlaying: state.tts.isPlaying,
    volume: state.tts.volume,
    usage: state.tts.usage,
    
    // Actions
    generateAndPlay,
    stopAudio,
    toggleEnabled,
    setVolume,
    testTTS,
    
    // Utilities
    getUsageStats,
    isNearUsageLimit,
    getAvailableVoices
  };
};

export default useElevenLabsTTS;
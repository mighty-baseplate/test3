/**
 * Custom Hook for Sound Effects Management
 * Manages loading, playing, and controlling sound effects
 */

import { useCallback, useRef, useEffect } from 'react';
import { useApp, actionTypes } from '../context/AppContext.jsx';
import SoundService from '../services/soundService.js';

const useSoundEffects = () => {
  const { state, dispatch } = useApp();
  const soundService = useRef(null);
  
  // Initialize sound service
  useEffect(() => {
    if (!soundService.current) {
      soundService.current = new SoundService();
      
      // Update loaded sounds in state
      const updateLoadedSounds = () => {
        const loadedSounds = soundService.current.getLoadedSounds();
        dispatch({ type: actionTypes.SET_LOADED_SOUNDS, payload: loadedSounds });
      };
      
      // Initial update after a delay to allow sounds to load
      setTimeout(updateLoadedSounds, 2000);
      
      // Set initial volume
      soundService.current.setVolume({
        effects: state.soundEffects.volume,
        master: 1.0
      });
      
      soundService.current.setEnabled(state.soundEffects.isEnabled);
    }
  }, [dispatch, state.soundEffects.volume, state.soundEffects.isEnabled]);
  
  /**
   * Play a sound effect
   * @param {string} soundName - Name of the sound to play
   * @param {string} characterId - Character ID for character-specific sounds
   * @param {number} volume - Volume override (0-1)
   */
  const playSound = useCallback((soundName, characterId = null, volume = null) => {
    if (!state.soundEffects.isEnabled || !soundService.current) {
      return;
    }
    
    try {
      // Handle character-specific sounds
      if (characterId) {
        switch (soundName) {
          case 'typewriter':
            soundService.current.playTypewriterEffect(characterId, 2000);
            break;
          case 'notification':
            soundService.current.playNotification(characterId);
            break;
          default:
            soundService.current.play(soundName, volume);
            break;
        }
      } else {
        soundService.current.play(soundName, volume);
      }
    } catch (error) {
      console.warn(`Failed to play sound ${soundName}:`, error);
    }
  }, [state.soundEffects.isEnabled]);
  
  /**
   * Play typewriter effect for AI typing
   * @param {string} characterId - Character ID
   * @param {number} duration - Duration in milliseconds
   */
  const playTypewriterEffect = useCallback((characterId, duration = 2000) => {
    if (!state.soundEffects.isEnabled || !soundService.current) {
      return;
    }
    
    soundService.current.playTypewriterEffect(characterId, duration);
  }, [state.soundEffects.isEnabled]);
  
  /**
   * Play notification sound for new messages
   * @param {string} characterId - Character ID for character-specific notification
   */
  const playNotification = useCallback((characterId) => {
    if (!state.soundEffects.isEnabled || !soundService.current) {
      return;
    }
    
    soundService.current.playNotification(characterId);
  }, [state.soundEffects.isEnabled]);
  
  /**
   * Play message sent confirmation sound
   */
  const playMessageSent = useCallback(() => {
    if (!state.soundEffects.isEnabled || !soundService.current) {
      return;
    }
    
    soundService.current.playMessageSent();
  }, [state.soundEffects.isEnabled]);
  
  /**
   * Toggle sound effects enabled/disabled
   * @param {boolean} enabled - Whether to enable sound effects
   */
  const toggleEnabled = useCallback((enabled) => {
    dispatch({ type: actionTypes.SET_SOUND_EFFECTS_ENABLED, payload: enabled });
    
    if (soundService.current) {
      soundService.current.setEnabled(enabled);
    }
  }, [dispatch]);
  
  /**
   * Set sound effects volume
   * @param {number} volume - Volume level (0-1)
   */
  const setVolume = useCallback((volume) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    dispatch({ type: actionTypes.SET_SOUND_EFFECTS_VOLUME, payload: clampedVolume });
    
    if (soundService.current) {
      soundService.current.setVolume({
        effects: clampedVolume,
        master: 1.0
      });
    }
  }, [dispatch]);
  
  /**
   * Test a specific sound effect
   * @param {string} soundName - Name of the sound to test
   * @returns {Promise<void>}
   */
  const testSound = useCallback(async (soundName) => {
    if (!soundService.current) {
      return;
    }
    
    // Temporarily enable sound effects for testing
    const wasEnabled = state.soundEffects.isEnabled;
    if (!wasEnabled) {
      soundService.current.setEnabled(true);
    }
    
    try {
      await soundService.current.play(soundName, 0.7);
    } finally {
      // Restore original enabled state
      if (!wasEnabled) {
        soundService.current.setEnabled(false);
      }
    }
  }, [state.soundEffects.isEnabled]);
  
  /**
   * Resume audio context (required for some browsers)
   */
  const resumeAudioContext = useCallback(async () => {
    if (soundService.current) {
      await soundService.current.resumeAudioContext();
    }
  }, []);
  
  /**
   * Get list of loaded sounds
   * @returns {Array<string>} Array of loaded sound names
   */
  const getLoadedSounds = useCallback(() => {
    if (!soundService.current) {
      return [];
    }
    
    return soundService.current.getLoadedSounds();
  }, []);
  
  /**
   * Preload sounds for better performance
   */
  const preloadSounds = useCallback(async () => {
    if (!soundService.current) {
      return;
    }
    
    // Sounds are loaded automatically by SoundService
    // This method can be used to trigger manual reloading if needed
    const loadedSounds = soundService.current.getLoadedSounds();
    dispatch({ type: actionTypes.SET_LOADED_SOUNDS, payload: loadedSounds });
  }, [dispatch]);
  
  // Update loaded sounds periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (soundService.current) {
        const loadedSounds = soundService.current.getLoadedSounds();
        dispatch({ type: actionTypes.SET_LOADED_SOUNDS, payload: loadedSounds });
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  // Sync volume changes
  useEffect(() => {
    if (soundService.current) {
      soundService.current.setVolume({
        effects: state.soundEffects.volume,
        master: 1.0
      });
    }
  }, [state.soundEffects.volume]);
  
  // Sync enabled state
  useEffect(() => {
    if (soundService.current) {
      soundService.current.setEnabled(state.soundEffects.isEnabled);
    }
  }, [state.soundEffects.isEnabled]);
  
  return {
    // State
    isEnabled: state.soundEffects.isEnabled,
    volume: state.soundEffects.volume,
    loadedSounds: state.soundEffects.loadedSounds,
    
    // Actions
    playSound,
    playTypewriterEffect,
    playNotification,
    playMessageSent,
    toggleEnabled,
    setVolume,
    testSound,
    
    // Utilities
    resumeAudioContext,
    getLoadedSounds,
    preloadSounds
  };
};

export default useSoundEffects;
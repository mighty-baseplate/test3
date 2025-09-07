/**
 * Sound Effects Service
 * Manages all sound effects for the roleplay chat simulator
 */

class SoundService {
  constructor() {
    this.sounds = new Map();
    this.audioContext = null;
    this.isEnabled = true;
    this.volume = {
      effects: 0.6,
      master: 0.8
    };
    
    this.initializeAudioContext();
    this.loadSounds();
  }

  /**
   * Initialize Web Audio API context
   */
  initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  /**
   * Load all sound effects
   */
  async loadSounds() {
    const soundFiles = {
      // Core interaction sounds
      notification: '/sounds/notification-ting.mp3',
      typewriter: '/sounds/typewriter-robotic.mp3',
      messageSent: '/sounds/message-send.mp3',
      
      // Character-specific sounds (fallbacks to generic if not available)
      'typewriter-mystical': '/sounds/typewriter-mystical.mp3',
      'typewriter-classic': '/sounds/typewriter-classic.mp3',
      'typewriter-robotic': '/sounds/typewriter-robotic.mp3',
      'typewriter-medieval': '/sounds/typewriter-medieval.mp3',
      'typewriter-cosmic': '/sounds/typewriter-cosmic.mp3',
      'typewriter-magical': '/sounds/typewriter-magical.mp3',
      
      // Notification variations
      'bell-magical': '/sounds/bell-magical.mp3',
      'bell-victorian': '/sounds/bell-victorian.mp3',
      'beep-digital': '/sounds/beep-digital.mp3',
      'bell-castle': '/sounds/bell-castle.mp3',
      'beep-alien': '/sounds/beep-alien.mp3',
      'chime-ethereal': '/sounds/chime-ethereal.mp3'
    };

    for (const [key, path] of Object.entries(soundFiles)) {
      try {
        await this.loadSound(key, path);
      } catch (error) {
        console.warn(`Failed to load sound: ${key}`, error);
        // Load fallback sound if available
        if (key.includes('-') && !key.startsWith('typewriter-robotic') && !key.startsWith('notification')) {
          const fallbackKey = key.split('-')[0];
          if (fallbackKey === 'typewriter') {
            await this.loadSound(key, '/sounds/typewriter-robotic.mp3').catch(() => {});
          } else if (fallbackKey === 'bell' || fallbackKey === 'beep' || fallbackKey === 'chime') {
            await this.loadSound(key, '/sounds/notification-ting.mp3').catch(() => {});
          }
        }
      }
    }
  }

  /**
   * Load individual sound file
   * @param {string} key - Sound identifier
   * @param {string} path - Path to sound file
   */
  async loadSound(key, path) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      
      audio.addEventListener('canplaythrough', () => {
        this.sounds.set(key, audio);
        resolve();
      }, { once: true });
      
      audio.addEventListener('error', (error) => {
        reject(error);
      }, { once: true });
      
      // Start loading
      audio.load();
    });
  }

  /**
   * Play a sound effect
   * @param {string} soundName - Name of the sound to play
   * @param {number} volume - Volume override (0-1)
   * @returns {Promise} Promise that resolves when sound starts playing
   */
  async play(soundName, volume = null) {
    if (!this.isEnabled) return;

    const sound = this.sounds.get(soundName);
    if (!sound) {
      console.warn(`Sound not found: ${soundName}`);
      return;
    }

    try {
      // Clone the audio element to allow overlapping plays
      const audioClone = sound.cloneNode();
      audioClone.volume = (volume !== null ? volume : this.volume.effects) * this.volume.master;
      audioClone.currentTime = 0;
      
      // Clean up after playing
      audioClone.addEventListener('ended', () => {
        audioClone.remove();
      }, { once: true });
      
      await audioClone.play();
      
    } catch (error) {
      console.warn(`Failed to play sound ${soundName}:`, error);
    }
  }

  /**
   * Play typewriter effect for specified duration
   * @param {string} characterId - Character ID for sound variation
   * @param {number} duration - Duration in milliseconds
   */
  playTypewriterEffect(characterId = 'robot', duration = 2000) {
    if (!this.isEnabled) return;

    const soundKey = `typewriter-${this.getCharacterSoundSuffix(characterId)}`;
    const fallbackKey = 'typewriter';
    
    const sound = this.sounds.get(soundKey) || this.sounds.get(fallbackKey);
    
    if (!sound) {
      console.warn(`Typewriter sound not found for character: ${characterId}`);
      return;
    }

    try {
      const audioClone = sound.cloneNode();
      audioClone.loop = true;
      audioClone.volume = (this.volume.effects * 0.7) * this.volume.master; // Slightly quieter for typing
      audioClone.currentTime = 0;
      
      audioClone.play();
      
      // Stop after duration
      setTimeout(() => {
        audioClone.pause();
        audioClone.loop = false;
        audioClone.currentTime = 0;
        audioClone.remove();
      }, duration);
      
    } catch (error) {
      console.warn('Failed to play typewriter effect:', error);
    }
  }

  /**
   * Play notification sound for character
   * @param {string} characterId - Character ID for sound variation
   */
  playNotification(characterId = 'robot') {
    const soundKey = this.getCharacterNotificationSound(characterId);
    this.play(soundKey || 'notification');
  }

  /**
   * Play message sent confirmation sound
   */
  playMessageSent() {
    this.play('messageSent', 0.4);
  }

  /**
   * Get character-specific sound suffix
   * @param {string} characterId - Character ID
   * @returns {string} Sound suffix
   */
  getCharacterSoundSuffix(characterId) {
    const soundMap = {
      'gandalf': 'mystical',
      'sherlock': 'classic',
      'robot': 'robotic',
      'knight': 'medieval',
      'alien': 'cosmic',
      'sorceress': 'magical'
    };
    
    return soundMap[characterId] || 'robotic';
  }

  /**
   * Get character-specific notification sound
   * @param {string} characterId - Character ID
   * @returns {string} Notification sound key
   */
  getCharacterNotificationSound(characterId) {
    const notificationMap = {
      'gandalf': 'bell-magical',
      'sherlock': 'bell-victorian',
      'robot': 'beep-digital',
      'knight': 'bell-castle',
      'alien': 'beep-alien',
      'sorceress': 'chime-ethereal'
    };
    
    return notificationMap[characterId] || 'notification';
  }

  /**
   * Set sound effects enabled/disabled
   * @param {boolean} enabled - Whether to enable sound effects
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  /**
   * Set volume levels
   * @param {Object} volumes - Volume configuration
   */
  setVolume(volumes) {
    if (volumes.effects !== undefined) {
      this.volume.effects = Math.max(0, Math.min(1, volumes.effects));
    }
    if (volumes.master !== undefined) {
      this.volume.master = Math.max(0, Math.min(1, volumes.master));
    }
  }

  /**
   * Get current volume levels
   * @returns {Object} Current volume configuration
   */
  getVolume() {
    return { ...this.volume };
  }

  /**
   * Check if sound effects are enabled
   * @returns {boolean} True if enabled
   */
  isEffectsEnabled() {
    return this.isEnabled;
  }

  /**
   * Get list of loaded sounds
   * @returns {Array} Array of loaded sound names
   */
  getLoadedSounds() {
    return Array.from(this.sounds.keys());
  }

  /**
   * Resume audio context (required for some browsers)
   */
  async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Failed to resume audio context:', error);
      }
    }
  }
}

export default SoundService;
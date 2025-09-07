/**
 * Sound Effects Manager Component
 * Provides controls for managing sound effects and audio feedback
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button.jsx';

const SoundEffectsManager = ({ 
  isEnabled = true,
  volume = 0.6,
  onToggleEnabled,
  onVolumeChange,
  onTestSound,
  loadedSounds = [],
  className = ''
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [testingSound, setTestingSound] = useState(null);
  
  const handleVolumeChange = (newVolume) => {
    if (onVolumeChange) {
      onVolumeChange(newVolume);
    }
  };
  
  const handleTestSound = async (soundName) => {
    setTestingSound(soundName);
    if (onTestSound) {
      await onTestSound(soundName);
    }
    setTimeout(() => setTestingSound(null), 1000);
  };
  
  const soundCategories = {
    'Core Sounds': [
      { key: 'notification', name: 'Notification Ting', description: 'New message alert' },
      { key: 'typewriter', name: 'Typewriter', description: 'AI typing effect' },
      { key: 'messageSent', name: 'Message Sent', description: 'Send confirmation' }
    ],
    'Character Typing': [
      { key: 'typewriter-mystical', name: 'Mystical Typing', description: 'Gandalf\'s typing sound' },
      { key: 'typewriter-classic', name: 'Classic Typing', description: 'Sherlock\'s typing sound' },
      { key: 'typewriter-robotic', name: 'Robotic Typing', description: 'AI Robot\'s typing sound' },
      { key: 'typewriter-medieval', name: 'Medieval Typing', description: 'Knight\'s typing sound' },
      { key: 'typewriter-cosmic', name: 'Cosmic Typing', description: 'Alien DJ\'s typing sound' },
      { key: 'typewriter-magical', name: 'Magical Typing', description: 'Sorceress\'s typing sound' }
    ],
    'Character Notifications': [
      { key: 'bell-magical', name: 'Magical Bell', description: 'Gandalf\'s notification' },
      { key: 'bell-victorian', name: 'Victorian Bell', description: 'Sherlock\'s notification' },
      { key: 'beep-digital', name: 'Digital Beep', description: 'AI Robot\'s notification' },
      { key: 'bell-castle', name: 'Castle Bell', description: 'Knight\'s notification' },
      { key: 'beep-alien', name: 'Alien Beep', description: 'Alien DJ\'s notification' },
      { key: 'chime-ethereal', name: 'Ethereal Chime', description: 'Sorceress\'s notification' }
    ]
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
          Sound Effects
        </h3>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className={`w-5 h-5 transform transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Main controls */}
      <div className="flex items-center space-x-4 mb-4">
        
        {/* Enable/Disable toggle */}
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => onToggleEnabled && onToggleEnabled(e.target.checked)}
              className="sr-only"
            />
            <div className={`relative w-12 h-6 rounded-full transition-colors ${
              isEnabled ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              {isEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>
        
        {/* Volume control */}
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776L4.777 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.777l3.606-2.776a1 1 0 011.617.776z" clipRule="evenodd" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            disabled={!isEnabled}
          />
          <span className="text-sm text-gray-600 min-w-[3rem]">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
      
      {/* Sound status */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <span>
          {loadedSounds.length} sounds loaded
        </span>
        <span className={`flex items-center ${isEnabled ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${isEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
          {isEnabled ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      {/* Detailed controls */}
      {showDetails && (
        <div className="border-t pt-4 space-y-4 animate-fade-in">
          
          {/* Sound categories */}
          {Object.entries(soundCategories).map(([category, sounds]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">{category}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sounds.map((sound) => (
                  <div 
                    key={sound.key}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">{sound.name}</div>
                      <div className="text-xs text-gray-500">{sound.description}</div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Loaded indicator */}
                      <div className={`w-2 h-2 rounded-full ${
                        loadedSounds.includes(sound.key) ? 'bg-green-500' : 'bg-red-500'
                      }`} title={loadedSounds.includes(sound.key) ? 'Loaded' : 'Not loaded'} />
                      
                      {/* Test button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestSound(sound.key)}
                        disabled={!isEnabled || !loadedSounds.includes(sound.key)}
                        loading={testingSound === sound.key}
                        className="text-xs px-2 py-1"
                      >
                        {testingSound === sound.key ? '♪' : '▶'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Info */}
          <div className="text-xs text-gray-500 bg-gray-50 rounded-md p-3">
            <p className="mb-1">
              <strong>🔊 Sound Effects:</strong> Enhance your chat experience with character-specific audio feedback.
            </p>
            <p>
              <strong>🎵 Character Sounds:</strong> Each character has unique typing and notification sounds.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

SoundEffectsManager.propTypes = {
  isEnabled: PropTypes.bool,
  volume: PropTypes.number,
  onToggleEnabled: PropTypes.func,
  onVolumeChange: PropTypes.func,
  onTestSound: PropTypes.func,
  loadedSounds: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string
};

export default SoundEffectsManager;
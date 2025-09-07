/**
 * Text-to-Speech Controls Component
 * Provides controls for TTS functionality with usage monitoring
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button.jsx';

const TTSControls = ({ 
  isEnabled = true,
  isGenerating = false,
  isPlaying = false,
  onToggleEnabled,
  onStop,
  onVolumeChange,
  volume = 0.8,
  usage = { charactersUsed: 0, characterLimit: 10000 },
  className = ''
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localVolume, setLocalVolume] = useState(volume);
  
  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);
  
  const handleVolumeChange = (newVolume) => {
    setLocalVolume(newVolume);
    if (onVolumeChange) {
      onVolumeChange(newVolume);
    }
  };
  
  const usagePercentage = (usage.charactersUsed / usage.characterLimit) * 100;
  const isNearLimit = usagePercentage > 80;
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776L4.777 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.777l3.606-2.776a1 1 0 011.617.776zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Text-to-Speech
        </h3>
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className={`w-5 h-5 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
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
              isEnabled ? 'bg-blue-600' : 'bg-gray-300'
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
        
        {/* Stop button */}
        {isPlaying && (
          <Button
            variant="danger"
            size="sm"
            onClick={onStop}
            className="flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
            Stop
          </Button>
        )}
        
        {/* Status indicator */}
        <div className="flex items-center">
          {isGenerating && (
            <div className="flex items-center text-blue-600">
              <svg className="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm">Generating...</span>
            </div>
          )}
          {isPlaying && (
            <div className="flex items-center text-green-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Playing</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Advanced controls */}
      {showAdvanced && (
        <div className="border-t pt-4 space-y-4 animate-fade-in">
          
          {/* Volume control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volume: {Math.round(localVolume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={localVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              disabled={!isEnabled}
            />
          </div>
          
          {/* Usage monitor */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                API Usage
              </label>
              <span className={`text-xs ${isNearLimit ? 'text-red-600' : 'text-gray-500'}`}>
                {usage.charactersUsed.toLocaleString()} / {usage.characterLimit.toLocaleString()}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isNearLimit ? 'bg-red-500' : usagePercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            
            {isNearLimit && (
              <p className="text-xs text-red-600 mt-1">
                ⚠️ Approaching usage limit. TTS may be disabled soon.
              </p>
            )}
          </div>
          
          {/* Info */}
          <div className="text-xs text-gray-500 bg-gray-50 rounded-md p-3">
            <p className="mb-1">
              <strong>💡 How it works:</strong> Only text within *asterisks* or very short responses are spoken.
            </p>
            <p>
              <strong>🎯 Tip:</strong> Characters express emotions through *actions* that will be read aloud.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

TTSControls.propTypes = {
  isEnabled: PropTypes.bool,
  isGenerating: PropTypes.bool,
  isPlaying: PropTypes.bool,
  onToggleEnabled: PropTypes.func,
  onStop: PropTypes.func,
  onVolumeChange: PropTypes.func,
  volume: PropTypes.number,
  usage: PropTypes.shape({
    charactersUsed: PropTypes.number,
    characterLimit: PropTypes.number
  }),
  className: PropTypes.string
};

export default TTSControls;
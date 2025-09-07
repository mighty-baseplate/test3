/**
 * Enhanced Typing Indicator Component
 * Shows when AI character is generating a response with sound effects
 */

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Avatar from '../ui/Avatar.jsx';

const TypingIndicator = ({ 
  character,
  isVisible = true,
  onSoundEffect,
  className = ''
}) => {
  
  useEffect(() => {
    // Play typewriter sound effect when typing starts
    if (isVisible && onSoundEffect) {
      onSoundEffect('typewriter', character?.id);
    }
  }, [isVisible, onSoundEffect, character]);
  
  if (!isVisible) return null;
  
  return (
    <div className={`flex justify-start mb-4 ${className}`}>
      <div className="flex items-end space-x-2">
        
        {/* Character avatar */}
        {character && (
          <div className="flex-shrink-0 mr-2">
            <Avatar
              character={character}
              emotion="thinking"
              size="md"
              showEmotionIndicator={true}
            />
          </div>
        )}
        
        <div className="flex flex-col space-y-1">
          {/* Character name */}
          {character && (
            <div className="text-xs text-gray-500 px-2">
              {character.name}
            </div>
          )}
          
          {/* Typing bubble */}
          <div 
            className={`
              max-w-xs px-4 py-3 rounded-2xl rounded-bl-md
              bg-white border-2 shadow-lg
              animate-pulse
              ${character?.font || 'font-sans'}
            `}
            style={character ? {
              borderColor: character.themeColor + '60',
              boxShadow: `0 4px 12px ${character.themeColor}20`
            } : {
              borderColor: '#e5e7eb'
            }}
          >
            
            {/* Typing dots animation */}
            <div className="flex items-center space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full animate-bounce`}
                  style={{ 
                    backgroundColor: character?.themeColor || '#9ca3af',
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1.4s'
                  }}
                />
              ))}
            </div>
            
            {/* Character-specific typing text */}
            <div className="text-xs text-gray-500 mt-1 italic">
              {getTypingMessage(character)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Get character-specific typing message
 * @param {Object} character - Character object
 * @returns {string} Typing message
 */
const getTypingMessage = (character) => {
  if (!character) return 'typing...';
  
  const typingMessages = {
    'gandalf': 'weaving words of wisdom...',
    'sherlock': 'deducing the perfect response...',
    'robot': 'PROCESSING QUERY... PLEASE WAIT...',
    'knight': 'composing noble words...',
    'alien': 'tuning into cosmic frequencies...',
    'sorceress': 'channeling starlight thoughts...'
  };
  
  return typingMessages[character.id] || `${character.name} is thinking...`;
};

TypingIndicator.propTypes = {
  character: PropTypes.object,
  isVisible: PropTypes.bool,
  onSoundEffect: PropTypes.func,
  className: PropTypes.string
};

export default TypingIndicator;
/**
 * Enhanced Chat Input Component
 * Handles message input with character theming and audio feedback
 */

import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button.jsx';

const ChatInput = ({ 
  onSendMessage,
  onSoundEffect,
  character,
  disabled = false,
  placeholder = "Type your message...",
  className = ''
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled || isSending) return;
    
    setIsSending(true);
    
    try {
      // Play message send sound effect
      if (onSoundEffect) {
        onSoundEffect('messageSent');
      }
      
      // Send the message
      await onSendMessage(trimmedMessage);
      
      // Clear input after successful send
      setMessage('');
      
      // Focus back on input
      if (inputRef.current) {
        inputRef.current.focus();
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
      // Keep the message in input on error
    } finally {
      setIsSending(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };
  
  const getPlaceholder = () => {
    if (!character) return placeholder;
    
    const characterPlaceholders = {
      'gandalf': 'Speak, and I shall listen with wisdom...',
      'sherlock': 'Present your case, and I shall deduce...',
      'robot': 'INPUT YOUR QUERY FOR PROCESSING...',
      'knight': 'Share your thoughts, noble friend...',
      'alien': 'Drop your cosmic vibes here...',
      'sorceress': 'Whisper your thoughts to the stars...'
    };
    
    return characterPlaceholders[character.id] || `Chat with ${character.name}...`;
  };
  
  return (
    <div className={`bg-white border-t shadow-lg ${className}`}>
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          
          {/* Message input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={getPlaceholder()}
              disabled={disabled || isSending}
              rows={1}
              className={`
                w-full px-4 py-3 border rounded-full resize-none
                focus:outline-none focus:ring-2 focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                ${character ? 'focus:ring-2' : 'focus:ring-blue-500'}
                ${character?.font || 'font-sans'}
              `}
              style={character ? {
                borderColor: character.themeColor + '40',
                focusRingColor: character.themeColor
              } : {}}
              maxLength={500}
            />
            
            {/* Character counter */}
            <div className="absolute bottom-1 right-3 text-xs text-gray-400">
              {message.length}/500
            </div>
          </div>
          
          {/* Send button */}
          <Button
            type="submit"
            disabled={!message.trim() || disabled || isSending}
            loading={isSending}
            variant="character"
            size="lg"
            className="px-6 rounded-full"
            style={character ? {
              backgroundColor: character.themeColor,
              borderColor: character.themeColor
            } : {}}
            onSoundPlay={onSoundEffect}
          >
            {isSending ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </Button>
        </form>
        
        {/* Character-specific hint */}
        {character && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            <span style={{ color: character.themeColor }}>
              💡 Tip: {getCharacterHint(character)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Get character-specific interaction hint
 * @param {Object} character - Character object
 * @returns {string} Interaction hint
 */
const getCharacterHint = (character) => {
  const hints = {
    'gandalf': 'Ask about Middle-earth adventures or seek wise counsel',
    'sherlock': 'Present a mystery or ask for deductive insights',
    'robot': 'Query about technology, logic, or human behavior analysis',
    'knight': 'Discuss honor, quests, or seek chivalrous advice',
    'alien': 'Talk about music, space, or universal cosmic vibes',
    'sorceress': 'Ask about magic, stars, or mystical wisdom'
  };
  
  return hints[character.id] || `Engage in roleplay conversation with ${character.name}`;
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  onSoundEffect: PropTypes.func,
  character: PropTypes.object,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string
};

export default ChatInput;
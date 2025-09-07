/**
 * Enhanced Chat Bubble Component
 * Displays chat messages with character theming, emotions, and animations
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Avatar from '../ui/Avatar.jsx';

const ChatBubble = ({ 
  message,
  character,
  isTyping = false,
  onMessageComplete,
  onTTSRequest,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTTSButton, setShowTTSButton] = useState(false);
  
  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Show TTS button for AI messages with TTS text
    if (message.sender === 'ai' && message.ttsText && onTTSRequest) {
      setShowTTSButton(true);
    }
  }, [message, onTTSRequest]);
  
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';
  
  // Base bubble classes
  const bubbleBaseClasses = `
    max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md
    transform transition-all duration-500 ease-out
    ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
    ${isTyping ? 'animate-pulse' : ''}
  `;
  
  // User message styling
  const userBubbleClasses = `
    ${bubbleBaseClasses}
    bg-blue-600 text-white ml-auto
    rounded-br-md shadow-lg
  `;
  
  // AI message styling with character theming
  const aiBubbleClasses = `
    ${bubbleBaseClasses}
    bg-white text-gray-800 mr-auto border-2 rounded-bl-md
    ${character ? `border-opacity-30 shadow-lg` : 'border-gray-200'}
  `;
  
  // Character-specific styling
  const getCharacterStyling = () => {
    if (!character) return {};
    
    return {
      borderColor: character.themeColor + '60',
      boxShadow: `0 4px 12px ${character.themeColor}20`
    };
  };
  
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const handleTTSClick = () => {
    if (onTTSRequest && message.ttsText) {
      onTTSRequest(message.ttsText, character);
    }
  };
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 ${className}`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-full`}>
        
        {/* Avatar for AI messages */}
        {isAI && character && (
          <div className={`flex-shrink-0 ${isUser ? 'ml-2' : 'mr-2'}`}>
            <Avatar
              character={character}
              emotion={message.emotion || 'neutral'}
              size="md"
              showEmotionIndicator={true}
            />
          </div>
        )}
        
        <div className="flex flex-col space-y-1">
          {/* Character name for AI messages */}
          {isAI && character && (
            <div className={`text-xs text-gray-500 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
              {character.name}
            </div>
          )}
          
          {/* Message bubble */}
          <div 
            className={isUser ? userBubbleClasses : aiBubbleClasses}
            style={isAI && character ? getCharacterStyling() : {}}
          >
            <div className={`${character?.font || 'font-sans'}`}>
              {message.text}
            </div>
            
            {/* TTS button for AI messages */}
            {showTTSButton && (
              <button
                onClick={handleTTSClick}
                className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1 transition-colors"
                title="Play audio"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776L4.777 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.777l3.606-2.776a1 1 0 011.617.776zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
                <span>Play</span>
              </button>
            )}
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs text-gray-400 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

ChatBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    sender: PropTypes.oneOf(['user', 'ai']).isRequired,
    timestamp: PropTypes.instanceOf(Date).isRequired,
    emotion: PropTypes.string,
    ttsText: PropTypes.string
  }).isRequired,
  character: PropTypes.object,
  isTyping: PropTypes.bool,
  onMessageComplete: PropTypes.func,
  onTTSRequest: PropTypes.func,
  className: PropTypes.string
};

export default ChatBubble;
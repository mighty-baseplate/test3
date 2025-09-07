/**
 * Chat Container Component
 * Main container for the chat interface with message display and scrolling
 */

import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChatBubble from './ChatBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

const ChatContainer = ({ 
  messages = [],
  character,
  isLoading = false,
  isTyping = false,
  onTTSRequest,
  onMessageComplete,
  className = ''
}) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages, isTyping]);
  
  // Handle smooth scrolling for better UX
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className={`
        flex-1 overflow-y-auto px-4 py-6 space-y-4
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
        ${className}
      `}
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Welcome message for new chats */}
        {messages.length === 0 && !isLoading && character && (
          <div className="text-center py-12">
            <div 
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-lg"
              style={{ backgroundColor: character.themeColor + '20' }}
            >
              <img
                src={character.emotionalImages?.waving || character.avatar}
                alt={character.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: character.themeColor }}
            >
              Welcome to chat with {character.name}!
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              {getWelcomeMessage(character)}
            </p>
          </div>
        )}
        
        {/* Loading state */}
        {isLoading && messages.length === 0 && (
          <div className="flex justify-center py-12">
            <LoadingSpinner 
              character={character}
              variant="character"
              size="lg"
              message="Preparing chat experience..."
            />
          </div>
        )}
        
        {/* Chat messages */}
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            character={character}
            onTTSRequest={onTTSRequest}
            onMessageComplete={onMessageComplete}
          />
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <TypingIndicator
            character={character}
            isVisible={isTyping}
          />
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

/**
 * Get character-specific welcome message
 * @param {Object} character - Character object
 * @returns {string} Welcome message
 */
const getWelcomeMessage = (character) => {
  const welcomeMessages = {
    'gandalf': 'A wizard is never late, nor is he early. He arrives precisely when he means to. How may I assist you on your journey?',
    'sherlock': 'The game is afoot! Present your case, and I shall apply the science of deduction to unravel any mystery.',
    'robot': 'SYSTEM INITIALIZED. I am ready to process your queries and assist with logical analysis of human behavior patterns.',
    'knight': 'Greetings, noble friend! I stand ready to discuss matters of honor, chivalry, and the noble quest for justice.',
    'alien': 'Greetings from the cosmic dance floor! Ready to vibe with some intergalactic beats and universal wisdom?',
    'sorceress': 'The stars have aligned for our meeting. Share your thoughts, and I shall weave them with moonlight and magic.'
  };
  
  return welcomeMessages[character.id] || `Start a conversation with ${character.name} and experience their unique personality!`;
};

ChatContainer.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    sender: PropTypes.oneOf(['user', 'ai']).isRequired,
    timestamp: PropTypes.instanceOf(Date).isRequired,
    emotion: PropTypes.string,
    ttsText: PropTypes.string
  })),
  character: PropTypes.object,
  isLoading: PropTypes.bool,
  isTyping: PropTypes.bool,
  onTTSRequest: PropTypes.func,
  onMessageComplete: PropTypes.func,
  className: PropTypes.string
};

export default ChatContainer;
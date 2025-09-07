/**
 * Chat Interface Page
 * Main chat page with character interaction, TTS, and sound effects
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, actionCreators } from '../context/AppContext.jsx';
import ChatContainer from '../components/chat/ChatContainer.jsx';
import ChatInput from '../components/chat/ChatInput.jsx';
import CharacterImageDisplay from '../components/chat/CharacterImageDisplay.jsx';
import TTSControls from '../components/audio/TTSControls.jsx';
import SoundEffectsManager from '../components/audio/SoundEffectsManager.jsx';
import Button from '../components/ui/Button.jsx';
import useChat from '../hooks/useChat.js';
import useElevenLabsTTS from '../hooks/useElevenLabsTTS.js';
import useSoundEffects from '../hooks/useSoundEffects.js';

const ChatInterface = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [showAudioControls, setShowAudioControls] = useState(false);
  
  // Custom hooks
  const {
    messages,
    isTyping,
    isLoading,
    currentEmotion,
    sendMessage,
    resetChat,
    getChatStats
  } = useChat();
  
  const {
    isEnabled: ttsEnabled,
    isGenerating: ttsGenerating,
    isPlaying: ttsPlaying,
    volume: ttsVolume,
    usage: ttsUsage,
    generateAndPlay: playTTS,
    stopAudio,
    toggleEnabled: toggleTTS,
    setVolume: setTTSVolume
  } = useElevenLabsTTS();
  
  const {
    isEnabled: soundEnabled,
    volume: soundVolume,
    loadedSounds,
    playSound,
    playTypewriterEffect,
    playNotification,
    playMessageSent,
    toggleEnabled: toggleSoundEffects,
    setVolume: setSoundVolume,
    testSound,
    resumeAudioContext
  } = useSoundEffects();
  
  // Redirect if no character selected
  useEffect(() => {
    if (!state.selectedCharacter) {
      navigate('/');
    }
  }, [state.selectedCharacter, navigate]);
  
  // Resume audio context on mount
  useEffect(() => {
    resumeAudioContext();
  }, [resumeAudioContext]);
  
  // Auto-play TTS for new AI messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'ai' && lastMessage.ttsText && ttsEnabled) {
        // Small delay to ensure message is displayed first
        setTimeout(() => {
          playTTS(lastMessage.ttsText, state.selectedCharacter);
        }, 500);
      }
    }
  }, [messages, ttsEnabled, playTTS, state.selectedCharacter]);
  
  // Play notification sound for new AI messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'ai' && !lastMessage.isError) {
        playNotification(state.selectedCharacter?.id);
      }
    }
  }, [messages, playNotification, state.selectedCharacter]);
  
  const handleSendMessage = async (messageText) => {
    try {
      // Play message sent sound
      playMessageSent();
      
      // Send message and get response
      const result = await sendMessage(messageText);
      
      return result;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };
  
  const handleTTSRequest = (text, character) => {
    if (ttsEnabled) {
      playTTS(text, character);
    }
  };
  
  const handleSoundEffect = (soundType, characterId) => {
    switch (soundType) {
      case 'typewriter':
        playTypewriterEffect(characterId, 2000);
        break;
      default:
        playSound(soundType, characterId);
    }
  };
  
  const handleResetChat = () => {
    resetChat();
    playSound('notification');
  };
  
  const handleBackToCharacters = () => {
    dispatch(actionCreators.selectCharacter(null));
    navigate('/');
  };
  
  if (!state.selectedCharacter) {
    return null; // Will redirect
  }
  
  const character = state.selectedCharacter;
  const chatStats = getChatStats();
  
  return (
    <div 
      className={`min-h-screen flex flex-col ${character.backgroundColor || 'bg-gradient-to-br from-slate-50 to-blue-50'}`}
    >
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            
            {/* Character info */}
            <div className="flex items-center space-x-4">
              <img
                src={character.emotionalImages?.[currentEmotion] || character.avatar}
                alt={character.name}
                className="w-12 h-12 rounded-full shadow-md"
              />
              <div>
                <h1 className={`text-xl font-bold ${character.font || 'font-sans'}`} style={{ color: character.themeColor }}>
                  {character.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {chatStats.totalMessages > 0 ? `${chatStats.totalMessages} messages` : 'Ready to chat'}
                </p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-2">
              
              {/* Audio controls toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAudioControls(!showAudioControls)}
                className="flex items-center"
                title="Audio Settings"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776L4.777 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.777l3.606-2.776a1 1 0 011.617.776z" clipRule="evenodd" />
                </svg>
              </Button>
              
              {/* Reset chat */}
              <Button
                variant="secondary"
                size="sm"
                onClick={handleResetChat}
                className="flex items-center"
                title="Reset Chat"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Reset
              </Button>
              
              {/* Back to characters */}
              <Button
                variant="primary"
                size="sm"
                onClick={handleBackToCharacters}
                className="flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Characters
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Audio controls panel */}
      {showAudioControls && (
        <div className="bg-gray-50 border-b animate-fade-in">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* TTS Controls */}
              <TTSControls
                isEnabled={ttsEnabled}
                isGenerating={ttsGenerating}
                isPlaying={ttsPlaying}
                onToggleEnabled={toggleTTS}
                onStop={stopAudio}
                onVolumeChange={setTTSVolume}
                volume={ttsVolume}
                usage={ttsUsage}
              />
              
              {/* Sound Effects Controls */}
              <SoundEffectsManager
                isEnabled={soundEnabled}
                volume={soundVolume}
                onToggleEnabled={toggleSoundEffects}
                onVolumeChange={setSoundVolume}
                onTestSound={testSound}
                loadedSounds={loadedSounds}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col relative">
        
        {/* Chat messages */}
        <ChatContainer
          messages={messages}
          character={character}
          isLoading={isLoading}
          isTyping={isTyping}
          onTTSRequest={handleTTSRequest}
          className="flex-1"
        />
        
        {/* Chat input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onSoundEffect={handleSoundEffect}
          character={character}
          disabled={isLoading || isTyping}
        />
        
        {/* Character image display */}
        <CharacterImageDisplay
          character={character}
          currentEmotion={currentEmotion}
          position="bottom-right"
          size="medium"
          onImageClick={(char, emotion) => {
            console.log(`${char.name} is feeling ${emotion}`);
          }}
        />
      </div>
      
      {/* Error display */}
      {state.error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 animate-bounce-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{state.error}</span>
            <button
              onClick={() => dispatch(actionCreators.clearError())}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
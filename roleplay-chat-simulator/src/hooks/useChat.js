/**
 * Custom Hook for Chat Functionality
 * Manages chat operations, message sending, and AI responses
 */

import { useCallback } from 'react';
import { useApp, actionCreators } from '../context/AppContext.jsx';
import GeminiService from '../services/geminiService.js';
import { v4 as uuidv4 } from 'uuid';

const useChat = () => {
  const { state, dispatch } = useApp();
  const geminiService = new GeminiService();
  
  /**
   * Send a message and get AI response
   * @param {string} messageText - User message text
   */
  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || !state.selectedCharacter) {
      throw new Error('Message text and selected character are required');
    }
    
    try {
      dispatch(actionCreators.setError(null));
      
      // Add user message
      const userMessage = {
        id: uuidv4(),
        text: messageText.trim(),
        sender: 'user',
        timestamp: new Date()
      };
      
      dispatch(actionCreators.addMessage(userMessage));
      
      // Set typing indicator
      dispatch(actionCreators.setTyping(true));
      
      // Get AI response
      const response = await geminiService.sendMessage(
        messageText,
        state.selectedCharacter,
        state.messages
      );
      
      if (response.success) {
        // Add AI message
        const aiMessage = {
          id: uuidv4(),
          text: response.message,
          sender: 'ai',
          timestamp: new Date(),
          emotion: response.emotion || 'neutral',
          ttsText: response.ttsText,
          characterId: state.selectedCharacter.id
        };
        
        dispatch(actionCreators.addMessage(aiMessage));
        
        // Update character emotion
        if (response.emotion && response.emotion !== state.currentEmotion) {
          dispatch(actionCreators.setEmotion(response.emotion));
        }
        
        return {
          success: true,
          message: aiMessage,
          emotion: response.emotion,
          ttsText: response.ttsText
        };
      } else {
        throw new Error(response.error || 'Failed to get AI response');
      }
      
    } catch (error) {
      console.error('Chat error:', error);
      dispatch(actionCreators.setError(error.message));
      dispatch(actionCreators.setTyping(false));
      
      // Add error message for user feedback
      const errorMessage = {
        id: uuidv4(),
        text: `*${state.selectedCharacter?.name || 'AI'} seems to be having trouble responding. Please try again.*`,
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'sad',
        ttsText: 'having trouble responding',
        characterId: state.selectedCharacter?.id,
        isError: true
      };
      
      dispatch(actionCreators.addMessage(errorMessage));
      
      throw error;
    } finally {
      dispatch(actionCreators.setTyping(false));
    }
  }, [state.selectedCharacter, state.messages, state.currentEmotion, dispatch]);
  
  /**
   * Clear all chat messages
   */
  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch(actionCreators.setEmotion('neutral'));
  }, [dispatch]);
  
  /**
   * Reset entire chat session
   */
  const resetChat = useCallback(() => {
    dispatch(actionCreators.resetChat());
  }, [dispatch]);
  
  /**
   * Get chat statistics
   */
  const getChatStats = useCallback(() => {
    const messages = state.messages;
    const userMessages = messages.filter(m => m.sender === 'user');
    const aiMessages = messages.filter(m => m.sender === 'ai');
    
    return {
      totalMessages: messages.length,
      userMessages: userMessages.length,
      aiMessages: aiMessages.length,
      currentEmotion: state.currentEmotion,
      chatStartTime: messages.length > 0 ? messages[0].timestamp : null,
      lastMessageTime: messages.length > 0 ? messages[messages.length - 1].timestamp : null
    };
  }, [state.messages, state.currentEmotion]);
  
  /**
   * Get messages with emotion analysis
   */
  const getEmotionHistory = useCallback(() => {
    return state.messages
      .filter(m => m.sender === 'ai' && m.emotion)
      .map(m => ({
        timestamp: m.timestamp,
        emotion: m.emotion,
        text: m.text
      }));
  }, [state.messages]);
  
  /**
   * Export chat history
   */
  const exportChat = useCallback(() => {
    const chatData = {
      character: state.selectedCharacter,
      messages: state.messages,
      stats: getChatStats(),
      exportedAt: new Date()
    };
    
    return JSON.stringify(chatData, null, 2);
  }, [state.selectedCharacter, state.messages, getChatStats]);
  
  return {
    // State
    messages: state.messages,
    isTyping: state.isTyping,
    isLoading: state.isLoading,
    currentEmotion: state.currentEmotion,
    selectedCharacter: state.selectedCharacter,
    error: state.error,
    
    // Actions
    sendMessage,
    clearMessages,
    resetChat,
    
    // Utilities
    getChatStats,
    getEmotionHistory,
    exportChat
  };
};

export default useChat;
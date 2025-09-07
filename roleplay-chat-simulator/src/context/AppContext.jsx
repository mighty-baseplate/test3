/**
 * Main Application Context
 * Manages global state for the roleplay chat simulator
 */

import { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

// Initial state
const initialState = {
  // Character state
  selectedCharacter: null,
  currentEmotion: 'neutral',
  
  // Chat state
  messages: [],
  isTyping: false,
  isLoading: false,
  
  // Audio state
  tts: {
    isEnabled: true,
    isGenerating: false,
    isPlaying: false,
    volume: 0.8,
    usage: {
      charactersUsed: 0,
      characterLimit: 10000
    }
  },
  
  soundEffects: {
    isEnabled: true,
    volume: 0.6,
    loadedSounds: []
  },
  
  // UI state
  theme: 'light',
  sidebarOpen: false,
  
  // Error state
  error: null
};

// Action types
export const actionTypes = {
  // Character actions
  SELECT_CHARACTER: 'SELECT_CHARACTER',
  SET_EMOTION: 'SET_EMOTION',
  
  // Chat actions
  ADD_MESSAGE: 'ADD_MESSAGE',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
  SET_TYPING: 'SET_TYPING',
  SET_LOADING: 'SET_LOADING',
  
  // Audio actions
  SET_TTS_ENABLED: 'SET_TTS_ENABLED',
  SET_TTS_GENERATING: 'SET_TTS_GENERATING',
  SET_TTS_PLAYING: 'SET_TTS_PLAYING',
  SET_TTS_VOLUME: 'SET_TTS_VOLUME',
  UPDATE_TTS_USAGE: 'UPDATE_TTS_USAGE',
  
  SET_SOUND_EFFECTS_ENABLED: 'SET_SOUND_EFFECTS_ENABLED',
  SET_SOUND_EFFECTS_VOLUME: 'SET_SOUND_EFFECTS_VOLUME',
  SET_LOADED_SOUNDS: 'SET_LOADED_SOUNDS',
  
  // UI actions
  SET_THEME: 'SET_THEME',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  
  // Error actions
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Reset actions
  RESET_CHAT: 'RESET_CHAT',
  RESET_ALL: 'RESET_ALL'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SELECT_CHARACTER:
      return {
        ...state,
        selectedCharacter: action.payload,
        currentEmotion: 'neutral',
        messages: [], // Clear messages when switching characters
        error: null
      };
      
    case actionTypes.SET_EMOTION:
      return {
        ...state,
        currentEmotion: action.payload
      };
      
    case actionTypes.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isTyping: false
      };
      
    case actionTypes.CLEAR_MESSAGES:
      return {
        ...state,
        messages: []
      };
      
    case actionTypes.SET_TYPING:
      return {
        ...state,
        isTyping: action.payload
      };
      
    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case actionTypes.SET_TTS_ENABLED:
      return {
        ...state,
        tts: {
          ...state.tts,
          isEnabled: action.payload
        }
      };
      
    case actionTypes.SET_TTS_GENERATING:
      return {
        ...state,
        tts: {
          ...state.tts,
          isGenerating: action.payload
        }
      };
      
    case actionTypes.SET_TTS_PLAYING:
      return {
        ...state,
        tts: {
          ...state.tts,
          isPlaying: action.payload
        }
      };
      
    case actionTypes.SET_TTS_VOLUME:
      return {
        ...state,
        tts: {
          ...state.tts,
          volume: action.payload
        }
      };
      
    case actionTypes.UPDATE_TTS_USAGE:
      return {
        ...state,
        tts: {
          ...state.tts,
          usage: action.payload
        }
      };
      
    case actionTypes.SET_SOUND_EFFECTS_ENABLED:
      return {
        ...state,
        soundEffects: {
          ...state.soundEffects,
          isEnabled: action.payload
        }
      };
      
    case actionTypes.SET_SOUND_EFFECTS_VOLUME:
      return {
        ...state,
        soundEffects: {
          ...state.soundEffects,
          volume: action.payload
        }
      };
      
    case actionTypes.SET_LOADED_SOUNDS:
      return {
        ...state,
        soundEffects: {
          ...state.soundEffects,
          loadedSounds: action.payload
        }
      };
      
    case actionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
      
    case actionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
      
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isTyping: false
      };
      
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case actionTypes.RESET_CHAT:
      return {
        ...state,
        messages: [],
        currentEmotion: 'neutral',
        isTyping: false,
        isLoading: false,
        error: null
      };
      
    case actionTypes.RESET_ALL:
      return {
        ...initialState,
        // Preserve audio settings
        tts: state.tts,
        soundEffects: state.soundEffects
      };
      
    default:
      return state;
  }
};

// Create contexts
const AppStateContext = createContext();
const AppDispatchContext = createContext();

// Custom hooks
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};

export const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within an AppProvider');
  }
  return context;
};

// Combined hook for convenience
export const useApp = () => {
  return {
    state: useAppState(),
    dispatch: useAppDispatch()
  };
};

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Load persisted state on mount
  useEffect(() => {
    try {
      const persistedState = localStorage.getItem('roleplay-chat-state');
      if (persistedState) {
        const parsed = JSON.parse(persistedState);
        
        // Restore audio preferences
        if (parsed.tts) {
          dispatch({ type: actionTypes.SET_TTS_ENABLED, payload: parsed.tts.isEnabled });
          dispatch({ type: actionTypes.SET_TTS_VOLUME, payload: parsed.tts.volume });
        }
        
        if (parsed.soundEffects) {
          dispatch({ type: actionTypes.SET_SOUND_EFFECTS_ENABLED, payload: parsed.soundEffects.isEnabled });
          dispatch({ type: actionTypes.SET_SOUND_EFFECTS_VOLUME, payload: parsed.soundEffects.volume });
        }
        
        if (parsed.theme) {
          dispatch({ type: actionTypes.SET_THEME, payload: parsed.theme });
        }
      }
    } catch (error) {
      console.warn('Failed to load persisted state:', error);
    }
  }, []);
  
  // Persist state changes
  useEffect(() => {
    try {
      const stateToPersist = {
        tts: {
          isEnabled: state.tts.isEnabled,
          volume: state.tts.volume
        },
        soundEffects: {
          isEnabled: state.soundEffects.isEnabled,
          volume: state.soundEffects.volume
        },
        theme: state.theme
      };
      
      localStorage.setItem('roleplay-chat-state', JSON.stringify(stateToPersist));
    } catch (error) {
      console.warn('Failed to persist state:', error);
    }
  }, [state.tts.isEnabled, state.tts.volume, state.soundEffects.isEnabled, state.soundEffects.volume, state.theme]);
  
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Action creators for common operations
export const actionCreators = {
  selectCharacter: (character) => ({
    type: actionTypes.SELECT_CHARACTER,
    payload: character
  }),
  
  setEmotion: (emotion) => ({
    type: actionTypes.SET_EMOTION,
    payload: emotion
  }),
  
  addMessage: (message) => ({
    type: actionTypes.ADD_MESSAGE,
    payload: {
      ...message,
      id: message.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: message.timestamp || new Date()
    }
  }),
  
  setTyping: (isTyping) => ({
    type: actionTypes.SET_TYPING,
    payload: isTyping
  }),
  
  setLoading: (isLoading) => ({
    type: actionTypes.SET_LOADING,
    payload: isLoading
  }),
  
  setError: (error) => ({
    type: actionTypes.SET_ERROR,
    payload: error
  }),
  
  clearError: () => ({
    type: actionTypes.CLEAR_ERROR
  }),
  
  resetChat: () => ({
    type: actionTypes.RESET_CHAT
  })
};

export default AppProvider;
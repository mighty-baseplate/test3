/**
 * Character Picker Page
 * Main page for selecting a character to chat with
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, actionCreators } from '../context/AppContext.jsx';
import { characters } from '../data/characters.js';
import CharacterGrid from '../components/character/CharacterGrid.jsx';
import Button from '../components/ui/Button.jsx';
import useSoundEffects from '../hooks/useSoundEffects.js';

const CharacterPicker = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const { playSound, resumeAudioContext } = useSoundEffects();
  
  useEffect(() => {
    // Resume audio context on user interaction (required by browsers)
    resumeAudioContext();
  }, [resumeAudioContext]);
  
  const handleCharacterSelect = (character) => {
    dispatch(actionCreators.selectCharacter(character));
    playSound('select', character.id);
  };
  
  const handleStartChat = () => {
    if (state.selectedCharacter) {
      playSound('notification', state.selectedCharacter.id);
      navigate('/chat');
    }
  };
  
  const handleSoundEffect = (soundType, characterId) => {
    switch (soundType) {
      case 'hover':
        // Subtle hover sound - could be implemented later
        break;
      case 'select':
        playSound('notification', characterId);
        break;
      default:
        playSound(soundType, characterId);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🎭 Roleplay Chat Simulator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your character and embark on an immersive conversation experience 
              with AI-powered personalities, dynamic emotions, and professional voice synthesis.
            </p>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Character selection */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Choose Your Character
            </h2>
            <p className="text-gray-600">
              Each character has unique personality, voice, and emotional expressions
            </p>
          </div>
          
          <CharacterGrid
            characters={characters}
            selectedCharacter={state.selectedCharacter}
            onCharacterSelect={handleCharacterSelect}
            onSoundEffect={handleSoundEffect}
          />
        </section>
        
        {/* Action buttons */}
        {state.selectedCharacter && (
          <section className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="mb-6">
                <img
                  src={state.selectedCharacter.emotionalImages?.waving || state.selectedCharacter.avatar}
                  alt={state.selectedCharacter.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 shadow-lg"
                />
                <h3 className="text-xl font-bold mb-2" style={{ color: state.selectedCharacter.themeColor }}>
                  Ready to chat with {state.selectedCharacter.name}?
                </h3>
                <p className="text-gray-600 text-sm">
                  Experience their unique personality with dynamic emotions and voice synthesis
                </p>
              </div>
              
              <div className="space-y-3">
                <Button
                  variant="character"
                  size="lg"
                  onClick={handleStartChat}
                  className="w-full"
                  style={{
                    backgroundColor: state.selectedCharacter.themeColor,
                    borderColor: state.selectedCharacter.themeColor
                  }}
                  onSoundPlay={handleSoundEffect}
                >
                  Start Conversation
                </Button>
                
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => dispatch(actionCreators.selectCharacter(null))}
                  className="w-full"
                  onSoundPlay={handleSoundEffect}
                >
                  Choose Different Character
                </Button>
              </div>
            </div>
          </section>
        )}
        
        {/* Features highlight */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Experience Features
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Dynamic Conversations</h3>
              <p className="text-gray-600 text-sm">
                AI-powered responses with character-specific personalities and speaking patterns
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Emotional Intelligence</h3>
              <p className="text-gray-600 text-sm">
                Characters express emotions through dynamic images and voice inflections
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776L4.777 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.777l3.606-2.776a1 1 0 011.617.776z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Professional Audio</h3>
              <p className="text-gray-600 text-sm">
                High-quality text-to-speech and immersive sound effects for each character
              </p>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>
              Powered by Google Gemini Flash 1.5 AI and ElevenLabs Professional TTS
            </p>
            <p className="mt-2">
              Built with React, Vite, and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CharacterPicker;
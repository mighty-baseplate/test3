/**
 * Character Grid Component
 * Responsive grid layout for character selection with enhanced animations
 */

import PropTypes from 'prop-types';
import CharacterCard from './CharacterCard.jsx';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

const CharacterGrid = ({ 
  characters = [],
  selectedCharacter = null,
  onCharacterSelect,
  onSoundEffect,
  isLoading = false,
  className = ''
}) => {
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner 
          size="xl"
          variant="dots"
          message="Loading characters..."
          showMessage={true}
        />
      </div>
    );
  }
  
  if (characters.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-gray-400 text-6xl mb-4">🎭</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Characters Available</h3>
        <p className="text-gray-500">Please check your character data configuration.</p>
      </div>
    );
  }
  
  return (
    <div className={`${className}`}>
      
      {/* Grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {characters.map((character, index) => (
          <div
            key={character.id}
            className="animate-fade-in"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <CharacterCard
              character={character}
              isSelected={selectedCharacter?.id === character.id}
              onSelect={onCharacterSelect}
              onSoundEffect={onSoundEffect}
            />
          </div>
        ))}
      </div>
      
      {/* Selection summary */}
      {selectedCharacter && (
        <div className="mt-8 text-center animate-bounce-in">
          <div 
            className="inline-block px-6 py-3 rounded-full shadow-lg"
            style={{ 
              backgroundColor: selectedCharacter.themeColor + '20',
              border: `2px solid ${selectedCharacter.themeColor}40`
            }}
          >
            <span 
              className="font-semibold"
              style={{ color: selectedCharacter.themeColor }}
            >
              ✨ {selectedCharacter.name} selected! Ready to begin your adventure?
            </span>
          </div>
        </div>
      )}
      
      {/* Character count info */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>
          Choose from {characters.length} unique characters, each with their own personality, 
          voice, and emotional expressions.
        </p>
      </div>
    </div>
  );
};

CharacterGrid.propTypes = {
  characters: PropTypes.arrayOf(PropTypes.object),
  selectedCharacter: PropTypes.object,
  onCharacterSelect: PropTypes.func.isRequired,
  onSoundEffect: PropTypes.func,
  isLoading: PropTypes.bool,
  className: PropTypes.string
};

export default CharacterGrid;
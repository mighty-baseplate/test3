/**
 * Character Image Display Component
 * Shows dynamic character images that change based on emotions at bottom corners
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CharacterImageDisplay = ({ 
  character,
  currentEmotion = 'neutral',
  position = 'bottom-right',
  size = 'medium',
  className = '',
  onImageClick,
  autoResetToNeutral = true,
  resetDelay = 3000
}) => {
  const [displayEmotion, setDisplayEmotion] = useState('neutral');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Update emotion with smooth transition
  useEffect(() => {
    if (currentEmotion !== displayEmotion) {
      setIsTransitioning(true);
      
      // Delay to allow fade out
      const transitionTimer = setTimeout(() => {
        setDisplayEmotion(currentEmotion);
        setImageError(false); // Reset error state on emotion change
        setIsTransitioning(false);
      }, 150);
      
      return () => clearTimeout(transitionTimer);
    }
  }, [currentEmotion, displayEmotion]);
  
  // Auto-reset to neutral after delay
  useEffect(() => {
    if (autoResetToNeutral && currentEmotion !== 'neutral') {
      const resetTimer = setTimeout(() => {
        setDisplayEmotion('neutral');
      }, resetDelay);
      
      return () => clearTimeout(resetTimer);
    }
  }, [currentEmotion, autoResetToNeutral, resetDelay]);
  
  if (!character) return null;
  
  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };
  
  const positionClasses = {
    'bottom-left': 'fixed bottom-4 left-4',
    'bottom-right': 'fixed bottom-4 right-4',
    'top-left': 'fixed top-20 left-4',
    'top-right': 'fixed top-20 right-4'
  };
  
  const getImageSource = () => {
    if (character.emotionalImages && character.emotionalImages[displayEmotion]) {
      return character.emotionalImages[displayEmotion];
    }
    // Fallback to neutral if specific emotion not available
    return character.emotionalImages?.neutral || character.avatar;
  };
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(character, displayEmotion);
    }
  };
  
  const getEmotionColor = (emotion) => {
    const emotionColors = {
      neutral: '#9CA3AF',
      happy: '#10B981',
      thinking: '#3B82F6',
      sad: '#6B7280',
      waving: '#F59E0B',
      surprised: '#8B5CF6'
    };
    return emotionColors[emotion] || emotionColors.neutral;
  };
  
  return (
    <div className={`${positionClasses[position]} z-20 ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]} relative group
          transform transition-all duration-300 ease-in-out
          hover:scale-110 cursor-pointer
          ${isTransitioning ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}
        `}
        onClick={handleImageClick}
      >
        
        {/* Main character image */}
        {!imageError ? (
          <img
            src={getImageSource()}
            alt={`${character.name} - ${displayEmotion}`}
            className={`
              w-full h-full object-cover rounded-full shadow-xl
              border-4 border-white transition-all duration-300
              ${isTransitioning ? 'opacity-0' : 'opacity-100'}
            `}
            onError={handleImageError}
          />
        ) : (
          // Fallback when image fails to load
          <div 
            className={`
              w-full h-full rounded-full shadow-xl border-4 border-white
              bg-gradient-to-br from-gray-300 to-gray-400
              flex items-center justify-center text-white font-bold
              ${sizeClasses[size]}
            `}
          >
            {character.name.charAt(0)}
          </div>
        )}
        
        {/* Character theme glow effect */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            boxShadow: `0 0 30px ${character.themeColor}60`,
            opacity: isTransitioning ? 0.3 : 0.6
          }}
        />
        
        {/* Emotion indicator ring */}
        <div 
          className="absolute inset-0 rounded-full border-2 pointer-events-none transition-all duration-300"
          style={{
            borderColor: getEmotionColor(displayEmotion),
            opacity: displayEmotion !== 'neutral' ? 0.8 : 0.3
          }}
        />
        
        {/* Emotion status dot */}
        {displayEmotion !== 'neutral' && (
          <div 
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-md animate-pulse"
            style={{ backgroundColor: getEmotionColor(displayEmotion) }}
            title={`Feeling ${displayEmotion}`}
          />
        )}
        
        {/* Hover tooltip */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div 
            className="px-3 py-1 text-xs text-white rounded-md shadow-lg whitespace-nowrap"
            style={{ backgroundColor: character.themeColor }}
          >
            {character.name} - {displayEmotion}
          </div>
          <div 
            className="w-2 h-2 transform rotate-45 mx-auto -mt-1"
            style={{ backgroundColor: character.themeColor }}
          />
        </div>
        
        {/* Pulsing animation for strong emotions */}
        {(displayEmotion === 'happy' || displayEmotion === 'surprised') && (
          <div 
            className="absolute inset-0 rounded-full animate-ping pointer-events-none"
            style={{ 
              backgroundColor: getEmotionColor(displayEmotion) + '40',
              animationDuration: '2s'
            }}
          />
        )}
      </div>
    </div>
  );
};

CharacterImageDisplay.propTypes = {
  character: PropTypes.object.isRequired,
  currentEmotion: PropTypes.oneOf(['neutral', 'happy', 'thinking', 'sad', 'waving', 'surprised']),
  position: PropTypes.oneOf(['bottom-left', 'bottom-right', 'top-left', 'top-right']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  onImageClick: PropTypes.func,
  autoResetToNeutral: PropTypes.bool,
  resetDelay: PropTypes.number
};

export default CharacterImageDisplay;
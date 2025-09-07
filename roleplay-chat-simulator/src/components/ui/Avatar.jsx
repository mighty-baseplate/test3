/**
 * Enhanced Avatar Component with Emotional States
 * Displays character avatars with support for different emotional expressions
 */

import { useState } from 'react';
import PropTypes from 'prop-types';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md',
  emotion = 'neutral',
  character,
  fallback,
  className = '',
  onClick,
  showEmotionIndicator = false,
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
    '3xl': 'w-48 h-48'
  };
  
  const emotionColors = {
    neutral: 'ring-gray-300',
    happy: 'ring-green-400',
    thinking: 'ring-blue-400',
    sad: 'ring-gray-400',
    waving: 'ring-yellow-400',
    surprised: 'ring-purple-400'
  };
  
  const emotionGlow = {
    neutral: '',
    happy: 'shadow-green-200',
    thinking: 'shadow-blue-200',
    sad: 'shadow-gray-200',
    waving: 'shadow-yellow-200',
    surprised: 'shadow-purple-200'
  };
  
  // Determine the image source
  const getImageSource = () => {
    if (imageError) return null;
    
    if (character && character.emotionalImages && character.emotionalImages[emotion]) {
      return character.emotionalImages[emotion];
    }
    
    return src;
  };
  
  // Generate fallback initials
  const getFallbackText = () => {
    if (fallback) return fallback;
    if (character && character.name) {
      return character.name.split(' ').map(word => word[0]).join('').toUpperCase();
    }
    if (alt) {
      return alt.split(' ').map(word => word[0]).join('').toUpperCase();
    }
    return '?';
  };
  
  const imageSource = getImageSource();
  const baseClasses = `
    relative inline-flex items-center justify-center rounded-full 
    transition-all duration-300 select-none overflow-hidden
    ${sizeClasses[size]}
    ${showEmotionIndicator ? `ring-2 ${emotionColors[emotion]} ${emotionGlow[emotion]}` : ''}
    ${onClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };
  
  return (
    <div className={baseClasses} onClick={handleClick} {...props}>
      {imageSource && !imageError ? (
        <>
          <img
            src={imageSource}
            alt={alt || (character ? character.name : 'Avatar')}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
              <div className="w-1/2 h-1/2 bg-gray-300 rounded"></div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-semibold">
          <span className={`${size === 'xs' || size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-lg'}`}>
            {getFallbackText()}
          </span>
        </div>
      )}
      
      {/* Emotion indicator dot */}
      {showEmotionIndicator && emotion !== 'neutral' && (
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
          emotion === 'happy' ? 'bg-green-400' :
          emotion === 'thinking' ? 'bg-blue-400' :
          emotion === 'sad' ? 'bg-gray-400' :
          emotion === 'waving' ? 'bg-yellow-400' :
          emotion === 'surprised' ? 'bg-purple-400' :
          'bg-gray-300'
        }`} />
      )}
      
      {/* Character theme glow effect */}
      {character && showEmotionIndicator && (
        <div 
          className="absolute inset-0 rounded-full opacity-20 pointer-events-none"
          style={{
            boxShadow: `0 0 20px ${character.themeColor}40`
          }}
        />
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']),
  emotion: PropTypes.oneOf(['neutral', 'happy', 'thinking', 'sad', 'waving', 'surprised']),
  character: PropTypes.object,
  fallback: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  showEmotionIndicator: PropTypes.bool
};

export default Avatar;
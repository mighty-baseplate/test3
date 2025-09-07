/**
 * Enhanced Loading Spinner Component
 * Provides character-specific loading animations and states
 */

import PropTypes from 'prop-types';

const LoadingSpinner = ({ 
  size = 'md',
  color = 'blue',
  character,
  message = 'Loading...',
  showMessage = true,
  variant = 'spinner',
  className = ''
}) => {
  
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  
  const colorClasses = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
    pink: 'text-pink-600'
  };
  
  // Use character theme color if available
  const getSpinnerColor = () => {
    if (character && character.themeColor) {
      return { color: character.themeColor };
    }
    return {};
  };
  
  const getCharacterLoadingMessage = () => {
    if (!character) return message;
    
    const characterMessages = {
      'gandalf': '*strokes beard thoughtfully*',
      'sherlock': '*analyzing the situation*',
      'robot': 'PROCESSING REQUEST...',
      'knight': '*preparing noble response*',
      'alien': '*tuning cosmic frequencies*',
      'sorceress': '*weaving starlight magic*'
    };
    
    return characterMessages[character.id] || `${character.name} is thinking...`;
  };
  
  const SpinnerVariant = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size]} bg-current rounded-full animate-pulse`}
                style={{ 
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.4s',
                  ...getSpinnerColor()
                }}
              />
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <div 
            className={`${sizeClasses[size]} bg-current rounded-full animate-ping`}
            style={getSpinnerColor()}
          />
        );
      
      case 'bounce':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`}
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  ...getSpinnerColor()
                }}
              />
            ))}
          </div>
        );
      
      case 'character':
        if (character) {
          return (
            <div className="relative">
              <div 
                className={`${sizeClasses[size]} rounded-full animate-spin border-2 border-transparent`}
                style={{ 
                  borderTopColor: character.themeColor,
                  borderRightColor: character.themeColor + '40'
                }}
              />
              <div 
                className="absolute inset-0 rounded-full animate-pulse"
                style={{ 
                  backgroundColor: character.themeColor + '20'
                }}
              />
            </div>
          );
        }
        // Fallback to spinner if no character
        return <SpinnerDefault />;
      
      default: // 'spinner'
        return <SpinnerDefault />;
    }
  };
  
  const SpinnerDefault = () => (
    <div 
      className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-transparent border-t-current ${colorClasses[color]}`}
      style={getSpinnerColor()}
    />
  );
  
  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <SpinnerVariant />
      {showMessage && (
        <p 
          className="text-sm text-gray-600 animate-pulse"
          style={character ? { color: character.themeColor } : {}}
        >
          {getCharacterLoadingMessage()}
        </p>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['blue', 'gray', 'green', 'red', 'purple', 'yellow', 'pink']),
  character: PropTypes.object,
  message: PropTypes.string,
  showMessage: PropTypes.bool,
  variant: PropTypes.oneOf(['spinner', 'dots', 'pulse', 'bounce', 'character']),
  className: PropTypes.string
};

export default LoadingSpinner;
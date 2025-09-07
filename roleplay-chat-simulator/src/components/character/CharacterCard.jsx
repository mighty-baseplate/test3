/**
 * Enhanced Character Card Component
 * Displays character information with emotional state previews and hover effects
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../ui/Card.jsx';
import Avatar from '../ui/Avatar.jsx';
import Button from '../ui/Button.jsx';

const CharacterCard = ({ 
  character,
  isSelected = false,
  onSelect,
  onSoundEffect,
  className = ''
}) => {
  const [previewEmotion, setPreviewEmotion] = useState('neutral');
  const [isHovered, setIsHovered] = useState(false);
  
  const emotions = ['neutral', 'happy', 'thinking', 'sad', 'waving', 'surprised'];
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onSoundEffect) {
      onSoundEffect('hover', character.id);
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setPreviewEmotion('neutral');
  };
  
  const handleEmotionPreview = (emotion) => {
    setPreviewEmotion(emotion);
  };
  
  const handleSelect = () => {
    if (onSoundEffect) {
      onSoundEffect('select', character.id);
    }
    if (onSelect) {
      onSelect(character);
    }
  };
  
  return (
    <Card
      className={`
        character-card relative overflow-hidden transition-all duration-300
        ${isSelected ? 'ring-4 ring-offset-2 scale-105' : ''}
        ${isHovered ? 'shadow-2xl' : ''}
        ${className}
      `}
      style={isSelected ? { 
        ringColor: character.themeColor,
        transform: 'scale(1.05)'
      } : {}}
      hover={!isSelected}
      clickable={true}
      onClick={handleSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      padding="lg"
    >
      
      {/* Character theme background */}
      <div 
        className="absolute inset-0 opacity-5 transition-opacity duration-300"
        style={{ 
          backgroundColor: character.themeColor,
          opacity: isHovered ? 0.1 : 0.05
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10">
        
        {/* Character avatar with emotion preview */}
        <div className="flex justify-center mb-4">
          <Avatar
            character={character}
            emotion={previewEmotion}
            size="3xl"
            showEmotionIndicator={previewEmotion !== 'neutral'}
            className="transition-all duration-300"
          />
        </div>
        
        {/* Character name */}
        <h3 
          className={`text-xl font-bold text-center mb-2 ${character.font || 'font-sans'}`}
          style={{ color: character.themeColor }}
        >
          {character.name}
        </h3>
        
        {/* Character description */}
        <p className="text-gray-600 text-center text-sm mb-4 line-clamp-2">
          {character.description}
        </p>
        
        {/* Personality traits */}
        <div className="text-center mb-4">
          <span 
            className="inline-block px-3 py-1 text-xs font-medium rounded-full"
            style={{ 
              backgroundColor: character.themeColor + '20',
              color: character.themeColor
            }}
          >
            {character.personality}
          </span>
        </div>
        
        {/* Emotion preview controls */}
        {isHovered && (
          <div className="mb-4 animate-fade-in">
            <p className="text-xs text-gray-500 text-center mb-2">Preview emotions:</p>
            <div className="flex justify-center space-x-1">
              {emotions.map((emotion) => (
                <button
                  key={emotion}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEmotionPreview(emotion);
                  }}
                  className={`
                    w-6 h-6 rounded-full text-xs font-medium transition-all duration-200
                    hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1
                    ${previewEmotion === emotion ? 'shadow-md' : 'hover:shadow-sm'}
                  `}
                  style={{
                    backgroundColor: previewEmotion === emotion 
                      ? character.themeColor 
                      : character.themeColor + '40',
                    color: previewEmotion === emotion ? 'white' : character.themeColor,
                    focusRingColor: character.themeColor
                  }}
                  title={emotion}
                >
                  {getEmotionIcon(emotion)}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Select button */}
        <Button
          variant="character"
          size="md"
          className="w-full"
          style={{
            backgroundColor: character.themeColor,
            borderColor: character.themeColor
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect();
          }}
          onSoundPlay={onSoundEffect}
        >
          {isSelected ? 'Selected' : 'Chat with ' + character.name}
        </Button>
        
        {/* Character stats/info */}
        {isHovered && (
          <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div>
                <span className="font-medium">Theme:</span>
                <br />
                <span style={{ color: character.themeColor }}>
                  {getThemeName(character.id)}
                </span>
              </div>
              <div>
                <span className="font-medium">Voice:</span>
                <br />
                <span>Professional TTS</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: character.themeColor }}
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </Card>
  );
};

/**
 * Get emoji icon for emotion
 * @param {string} emotion - Emotion name
 * @returns {string} Emoji icon
 */
const getEmotionIcon = (emotion) => {
  const icons = {
    neutral: '😐',
    happy: '😊',
    thinking: '🤔',
    sad: '😢',
    waving: '👋',
    surprised: '😲'
  };
  return icons[emotion] || '😐';
};

/**
 * Get theme display name
 * @param {string} characterId - Character ID
 * @returns {string} Theme name
 */
const getThemeName = (characterId) => {
  const themes = {
    'gandalf': 'Mystical Gold',
    'sherlock': 'Victorian Blue',
    'robot': 'Cyber Green',
    'knight': 'Noble Silver',
    'alien': 'Cosmic Purple',
    'sorceress': 'Ethereal Pink'
  };
  return themes[characterId] || 'Classic';
};

CharacterCard.propTypes = {
  character: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onSoundEffect: PropTypes.func,
  className: PropTypes.string
};

export default CharacterCard;
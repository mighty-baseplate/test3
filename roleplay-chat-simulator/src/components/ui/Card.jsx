/**
 * Enhanced Card Component
 * Provides consistent card styling with animation support for character selection and chat
 */

import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  clickable = false,
  onClick,
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  background = 'white',
  ...props 
}) => {
  
  const baseClasses = 'transition-all duration-300';
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };
  
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full'
  };
  
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    transparent: 'bg-transparent',
    gradient: 'bg-gradient-to-br from-white to-gray-50'
  };
  
  const hoverClasses = hover ? 'hover:shadow-lg hover:scale-105 hover:-translate-y-1' : '';
  const clickableClasses = clickable ? 'cursor-pointer select-none' : '';
  
  const classes = `
    ${baseClasses}
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${roundedClasses[rounded]}
    ${backgroundClasses[background]}
    ${hoverClasses}
    ${clickableClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  const handleClick = (e) => {
    if (clickable && onClick) {
      onClick(e);
    }
  };
  
  return (
    <div
      className={classes}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full']),
  background: PropTypes.oneOf(['white', 'gray', 'transparent', 'gradient'])
};

export default Card;
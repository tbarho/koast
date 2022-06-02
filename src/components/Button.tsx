import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  className?: string;
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
const _Button = ({
  className,
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary ? 'primary' : 'secondary';
  return (
    <button
      type="button"
      className={[className, mode, size].join(' ')}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};

export const Button = styled(_Button)`
  font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 700;
  border: 0;
  border-radius: 3em;
  cursor: pointer;
  display: inline-block;
  line-height: 1;
  
  &.primary {
    color: white;
    background-color: #1ea7fd;
  }
  &.secondary {
    color: #333;
    background-color: transparent;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
  }
  &.small {
    font-size: 12px;
    padding: 10px 16px;
  }
  &.medium {
    font-size: 14px;
    padding: 11px 20px;
  }
  &.large {
    font-size: 16px;
    padding: 12px 24px;
  }
`;
import React from 'react';
import './Button.scss';

interface ButtonProps {
    content: string; 
    handleClick: () => void; 
    isInput: boolean;
    styles: React.CSSProperties;
}

export default function Button({content, handleClick, isInput, styles} : ButtonProps) {
  return (
    <>
    {isInput ? (
        <input 
            type="text" 
            value={content} 
            className='button-input' 
            style={styles} 
        />
    ) : (
        <button 
            className='button' 
            onClick={handleClick} 
            style={styles} 
        >
            {content}
        </button>
    )}
    </>
  )
}

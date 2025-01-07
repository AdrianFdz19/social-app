import React from 'react';
import './Button.scss';

interface ButtonProps {
    content: string; 
    handleClick: () => void; 
    isInput: boolean;
    styles: React.CSSProperties;
    disabled: boolean;
}

export default function Button({content, handleClick, isInput, styles, disabled} : ButtonProps) {
  return (
    <>
    {isInput ? (
        <input 
            type="submit" 
            onChange={()=>{}}
            value={content} 
            className='button-input' 
            style={styles} 
            disabled={disabled}
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

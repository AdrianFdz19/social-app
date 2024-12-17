import React from 'react'

import './Close.scss';
import { utilIcons as icon } from '../assets/icons';

interface CloseProps {
    handleClick: () => void;
}

export default function Close({handleClick} : CloseProps) {
  return (
    <div className="close" onClick={handleClick} >
        <icon.close className='close__icon' />
    </div>
  )
}

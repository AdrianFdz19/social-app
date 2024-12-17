import React from 'react'

import './Overlay.scss';

interface OverlayProps {
    children: React.ReactNode;
}

export default function Overlay({children} : OverlayProps) {
  return (
    <div className="overlay">
        {children}
    </div>
  )
}

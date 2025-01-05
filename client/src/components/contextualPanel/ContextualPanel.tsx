// ContextualPanel.tsx

import React, { useEffect, useRef } from 'react';
import './ContextualPanel.scss';
import NotificationPanel from './NotificationPanel';

interface ContextualPanelProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContextualPanel({ isOpen, setIsOpen }: ContextualPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div className="contextual-panel" ref={panelRef}>
      <div className="contextual-panel__box">
        <div className="contextual-panel__box__cont">
          <NotificationPanel />
        </div>
      </div>
    </div>
  );
}

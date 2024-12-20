// ContextualPanel.tsx

import './ContextualPanel.scss';
import NotificationPanel from './NotificationPanel';

export default function ContextualPanel() {
  return (
    <div className="contextual-panel">
        <div className="contextual-panel__box">
            <div className="contextual-panel__box__cont">
                <NotificationPanel />
            </div>
        </div>
    </div>
  )
}

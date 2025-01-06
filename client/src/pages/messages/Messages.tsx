// Messages.tsx

import Chats from './Chats';
import CurrentChat from './CurrentChat';
import './Messages.scss';

export default function Messages() {
  return (
    <div className="messages">
        <div className="messages__box">
            <Chats />
            <CurrentChat />
        </div>
    </div>
  )
}

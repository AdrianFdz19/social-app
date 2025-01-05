// ChatItem.tsx

import ProfilePicture from "../../components/ProfilePicture";
import { formatTimestampChatStyle } from "../../utils/time";
import { Chat } from "../../types/messages";
import './ChatItem.scss';

interface ChatItemProps {
  chat: Chat;
}

export default function ChatItem({ chat }: ChatItemProps) {
  const handleChatClick = () => {
    // Lógica para manejar el clic en el chat
  };

  return (
    <div key={chat.id} className="chat-item" onClick={handleChatClick}>
      <div className="chat-item__picture">
        <ProfilePicture
          url={chat.pictureUrl}
          size={3}
          handleClick={() => {}}
          isOnline={false}
        />
      </div>
      <div className="chat-item__details">
        <div className="chat-item__details__name">
          <label htmlFor="chat-name">{chat.name}</label>
          <span className="chat-item__details__name__timestamp">
              {formatTimestampChatStyle(chat.lastMessage.sendAt)}
          </span>
        </div>
        <div className="chat-item__details__last-message">
          <span className="chat-item__details__last-message__text">
            {chat.lastMessage.text}
          </span>
          { chat.unReadCount > 0 &&
            <div className="chat-item__details__last-message__unread">
              {chat.unReadCount}
            </div>
          }
        </div>
      </div>
    </div>
  );
}


// CurrentChat.tsx
import Button from '../../components/Button';
import ProfilePicture from '../../components/ProfilePicture';
import './CurrentChat.scss';
import Message from './Message';

export default function CurrentChat() {
  let chat = {
    id: 100,
    name: 'Frank Ruiz',
    pictureUrl: 'https://res.cloudinary.com/dlnapytj1/image/upload/v1733857902/post/ffojridccfqvq9mze5s4.jpg',
    messages: [
      {
        id: 100,
        text: 'Hola Frank, ¿cómo estás?',
        sendAt: '2025-01-03T09:30:00Z',
        status: 'delivered',
        isUserMsg: true,
      },
      {
        id: 101,
        text: 'Todo bien, gracias. ¿Y tú?',
        sendAt: '2025-01-03T09:32:00Z',
        status: 'read',
        isUserMsg: false,
      },
      {
        id: 102,
        text: 'Perfecto, ¿qué tal la reunión de ayer?',
        sendAt: '2025-01-03T09:35:00Z',
        status: 'sent',
        isUserMsg: true,
      },
    ],
  };

  return (
    <div className="chat-container">
      <div className="chat-container__content">
        <div className="chat-container__header">
          <div className="chat-header__info">
            <ProfilePicture
              size={2.5}
              url={chat.pictureUrl}
              handleClick={() => {}}
              outline={false}
              isOnline={false}
            />
            <div className="chat-header__details">
              <label id="chat-header__name">{chat.name}</label>
              <label id="chat-header__status">offline</label>
            </div>
          </div>
        </div>
        <div className="chat-container__messages">
          {chat.messages.map((msg) => (
            <Message key={msg.id} msg={msg} />
          ))}
        </div>
        <div className="chat-container__input">
          <textarea placeholder="write something..."></textarea>
          <Button
            content="send"
            handleClick={() => {}}
            isInput={true}
            styles={{ width: '4rem' }}
          />
        </div>
      </div>
    </div>
  );
}

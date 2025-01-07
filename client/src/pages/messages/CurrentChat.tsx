// CurrentChat.tsx

import { ChangeEvent, useEffect, useState } from 'react';
import Button from '../../components/Button';
import ProfilePicture from '../../components/ProfilePicture';
import './CurrentChat.scss';
import Message from './Message';
import { useAppContext } from '../../contexts/AppProvider';
import useAuthToken from '../../hooks/useAuthToken';
import { updateChats, useChatContext } from '../../contexts/ChatProvider';
import { MessagesType } from '../../types/messages';

export default function CurrentChat() {

  const { apiUrl, user } = useAppContext();
  const tokenManager = useAuthToken();
  const [message, setMessage] = useState('');
  const { currentChatId, messages, setMessages, setChats } = useChatContext();
  const [chat, setChat] = useState({
    id: null, 
    name: '', 
    isGroup: '', 
    pictureUrl: '',
    isActive: ''
  });

  useEffect(() => {
    const fetchChatInfo = async () => {
      try {
        const token = tokenManager.get();
        const response = await fetch(`${apiUrl}/chats/current/${currentChatId}`, {
          method: 'GET', 
          headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          /* console.log(data); */
          setChat(data.chat);
          setMessages(data.messages);
          /* console.log(data.messages); */
        } else {
          const data = await response.json();
          console.log(data);
        }
      } catch(err) {
        console.error('Server internal error.');
      }
    };
    if (currentChatId) fetchChatInfo();
  }, [currentChatId]);

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setMessage(value);
  };

  const handleReceiveSendedMessage = (message: MessagesType) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = tokenManager.get();
    /* console.log({ chatId: currentChatId, senderId: user.id, message }); */
    let isFirstMessage = messages.length === 0;
    try {
      const response = await fetch(`${apiUrl}/chats/message`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}`
        }, 
        body: JSON.stringify({ chatId: currentChatId, senderId: user.id, message, isFirstMessage})
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        handleReceiveSendedMessage(data.message);
        updateChats(setChats, data.message);
        /* console.log(data); */
      } else {
        console.error('Server internal error.');
      }
    } catch(err) {
      console.error(err);
    }

  };

  /* 
    LOGICA DE ENVIO DE MENSAJES
    3.- emitir la logica del socket para el mensaje en tiempo real
  */

  return (
    <div className="chat-container">
      { chat.id ? (
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
            {messages.map((msg) => (
              <Message key={msg.id} msg={msg} />
            ))}
          </div>
          <form className="chat-container__input" onSubmit={handleSendMessage}>
            <textarea 
              placeholder="write something..."
              value={message}
              onChange={handleTextChange}
            ></textarea>
            <Button
              content="send"
              handleClick={() => {}}
              isInput={true}
              styles={{ width: '4rem' }}
              disabled={message === ''}
            />
          </form>
        </div>
      ) : (
        <div className="chat-container__none">
          <p>There is no current chat</p>
        </div>
      ) }
    </div>
  );
}

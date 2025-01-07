// Chats.tsx
import { useEffect, useState } from 'react';
import ProfilePicture from '../../components/ProfilePicture';
import { useAppContext } from '../../contexts/AppProvider';
import { useChatContext } from '../../contexts/ChatProvider';
import useAuthToken from '../../hooks/useAuthToken';
import { openChat } from '../../services/openChat.service';
import { Chat } from '../../types/messages';
import { formatTimestampChatStyle, formatTimestampRelative } from '../../utils/time';
import ChatItem from './ChatItem';
import './Chats.scss';

export default function Chats() {

    /* let chats: Chat[] = [
        { 
            id: 100,
            name: 'Frank Ruiz', 
            pictureUrl: 'https://res.cloudinary.com/dlnapytj1/image/upload/v1733857902/post/ffojridccfqvq9mze5s4.jpg', 
            lastMessage: {
                senderId: 2,
                text: 'hello!.',
                sendAt: '2025-01-03T08:00:00Z', // Hace 2 horas (siendo las 10:00 UTC actuales)
                status: 'sent',
            },
            unReadCount: 3,
        },
        {
            id: 101,
            name: 'Grupo de Desarrollo',
            pictureUrl: 'https://res.cloudinary.com/dlnapytj1/image/upload/v1733857902/post/ffojridccfqvq9mze5s4.jpg',
            lastMessage: {
                senderId: 1,
                text: 'Reunión a las 5 PM.',
                sendAt: '2025-01-03T09:00:00Z', // Hace 1 hora
                status: 'delivered',
            },
            unReadCount: 0,
            participants: [
                { id: 1, name: 'Ana Martínez' },
                { id: 2, name: 'Carlos Pérez' },
                { id: 3, name: 'Luisa Gómez' },
            ],
        },
        {
            id: 102,
            name: 'Empleados HR',
            pictureUrl: 'https://res.cloudinary.com/dlnapytj1/image/upload/v1733857902/post/ffojridccfqvq9mze5s4.jpg',
            lastMessage: {
                senderId: 3,
                text: 'El evento de fin de año está confirmado.',
                sendAt: '2025-01-03T09:30:00Z', // Hace 30 minutos
                status: 'read',
            },
            unReadCount: 1,
            participants: [
                { id: 1, name: 'José Ramírez' },
                { id: 2, name: 'Marta Fernández' },
                { id: 3, name: 'Luis Torres' },
            ],
        }
    ];     */
    const { setCurrentChatId } = useChatContext();
    const { apiUrl } = useAppContext();
    const tokenManager = useAuthToken();
    const [chats, setChats] = useState([]);

    // Obtener todos los chats activos 

    useEffect(() => {
        const handleFetchAllChats = async () => {
            try {
                const token = tokenManager.get();
                const response = await fetch(`${apiUrl}/chats`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json', 
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setChats(data.chats);
                } else {
                    console.error('Server internal error.');
                }
            } catch(err) {
                console.error(err);
            }
        };
        handleFetchAllChats();
    }, []);

    const handleOpenChat = (chatId: number) => {
        setCurrentChatId(chatId);
    };

  return (
    <div className="chats">
        <div className="chats__content">
            <h1>chats</h1>
            <div className="chats__items">
                { 
                    chats.length > 0 ? (
                        <>
                        {chats.map((chat) => (
                            <ChatItem key={chat.id} chat={chat} openChat={handleOpenChat} />
                        ))}
                        </>
                    ) : (
                        <p>There is no chat actives</p>
                    )
                }
            </div>
        </div>
    </div>
  )
}

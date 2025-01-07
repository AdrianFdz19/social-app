import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useSocket } from './SocketProvider';
import { useAppContext } from './AppProvider';
import { ChatItemProps, MessagesType } from '../types/messages';

interface ChatContextProps {
    currentChatId: number | null;
    setCurrentChatId: React.Dispatch<React.SetStateAction<number | null>>;
    messages: MessagesType[];
    setMessages: React.Dispatch<React.SetStateAction<MessagesType[]>>;
    chats: ChatItemProps[];
    setChats: React.Dispatch<React.SetStateAction<ChatItemProps[]>>;
}

const ChatContext = createContext<undefined | ChatContextProps>(undefined);

export const useChatContext = () => {
    const context = useContext(ChatContext);

    if (!context) {
        throw new Error('useChatContext debe ser usado dentro de un ChatProvider.');
    }

    return context;
};

interface ChatProviderProps {
    children: ReactNode;
}

// Funcion para actualizar los chats al recibir un mensaje nuevo
export const updateChats = (
    setChats: React.Dispatch<React.SetStateAction<ChatItemProps[]>>,
    message: MessagesType
) => {
    setChats((prevChats) =>
        prevChats.map((chat) => {
            if (Number(chat.id) === Number(message.chatId)) {
                return {
                    ...chat,
                    lastMessage: {
                        text: message.text,
                        sendAt: message.sendAt,
                        status: message.status,
                        senderId: message.senderId
                    },
                };
            }
            return chat;
        })
    );
};

export default function ChatProvider({children} : ChatProviderProps ) {

    const { socket } = useSocket();
    const { user } = useAppContext();
    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState<MessagesType[] | undefined>(undefined);
    const [chats, setChats] = useState([]);

    // Guardar el currentChatId en el localStorage cada que cambie 
    useEffect(() => {
        if (currentChatId) {
            if (localStorage.getItem('current_chat_id')) {
                localStorage.removeItem('current_chat_id');
            }
            localStorage.setItem('current_chat_id', currentChatId);
        }
    }, [currentChatId]);

    // Cada que se recarge la aplicacion establecer el currentChatId si hay uno en el localStorage
    useEffect(() => {
        if (localStorage.getItem('current_chat_id')) {
            setCurrentChatId(localStorage.getItem('current_chat_id'));
        }
    }, []);   

    // Escuchar el evento 'new-message'
    useEffect(() => {
        if (user) {
            /* console.log(`Socket status: `, socket.connected); */
            socket.on('new-message', (message: MessagesType) => {
                console.log(message.chatId);
                setMessages((prev) => [...prev, message]);
                console.log('Nuevo mensaje recibido:', message);

                // Actualizar los chats
                updateChats(setChats, message);
            });

            return () => {
                socket.off('new-message');
            };
        }
    }, [user]);

    useEffect(() => {
        console.log(chats);
    }, [chats]);  

    let data: ChatContextProps = {
        currentChatId, 
        setCurrentChatId, 
        messages,   
        setMessages,
        chats, 
        setChats
    }

  return (
    <ChatContext.Provider value={data}>
        {children}
    </ChatContext.Provider>
  )
}

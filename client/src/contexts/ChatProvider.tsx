import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

/* messages: [
      {
        id: 100,
        text: 'Hola Frank, ¿cómo estás?',
        sendAt: '2025-01-03T09:30:00Z',
        status: 'delivered',
        isUserMsg: true,
      },
], */

type MessagesType = {
    id: number;
    text: string;
    sendAt: string;
    status: string;
    isUserMsg: boolean;
}

interface ChatContextProps {
    currentChatId: number | null;
    setCurrentChatId: React.Dispatch<React.SetStateAction<number | null>>;
    messages: MessagesType[];
    setMessages: React.Dispatch<React.SetStateAction<MessagesType[]>>;
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

export default function ChatProvider({children} : ChatProviderProps ) {

    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState();

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

    let data: ChatContextProps = {
        currentChatId, 
        setCurrentChatId, 
        messages,   
        setMessages
    }

  return (
    <ChatContext.Provider value={data}>
        {children}
    </ChatContext.Provider>
  )
}

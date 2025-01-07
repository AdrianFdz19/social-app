// messages.d.ts

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface LastMessage {
    senderId: number;
    text: string;
    sendAt: string;
    status: MessageStatus;
}

export interface MessagesType {
    chatId?: number;
    id: number;
    senderId: number; 
    text: string; 
    sendAt: string;
    status: MessageStatus;
    isUserMsg: boolean;
}

export interface ChatItemProps {
    id: number | Key;
    name: string;
    pictureUrl: string;
    lastMessage: LastMessage;
    unReadCount: number;
    participants?: { id: number; name: string }[]; // Solo para chats grupales
}
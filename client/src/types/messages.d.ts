// messages.d.ts

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface LastMessage {
senderId: number;
text: string;
sendAt: string;
status: MessageStatus;
}

export interface Chat {
id: number;
name: string;
pictureUrl: string;
lastMessage: LastMessage;
unReadCount: number;
participants?: { id: number; name: string }[]; // Solo para chats grupales
}
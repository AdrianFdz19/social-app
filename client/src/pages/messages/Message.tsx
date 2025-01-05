// Message.tsx

import './Message.scss';
import { formatTimestampRelative } from '../../utils/time';

type MessageType = {
    id: number;
    text: string;
    sendAt: string;
    status: string;
    isUserMsg: boolean;
};

interface MessageProps {
    msg: MessageType;
}

export default function Message({ msg }: MessageProps) {
    return (
        <div className={`chat-message ${!msg.isUserMsg ? 'external' : ''}`} key={msg.id}>
            <div className={`chat-message__box ${!msg.isUserMsg ? 'external' : ''}`}>
                <div className="chat-message__content">
                    <p>{msg.text}</p>
                </div>
                <div className="chat-message__details">
                    <p id="send-time">{formatTimestampRelative(msg.sendAt)}</p>
                    <p id="message-status">{msg.status}</p>
                </div>
            </div>
        </div>
    );
}

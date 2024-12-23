// notification.d.ts

type NotificationSenderType = {
    id: number;
    username: string;
    pictureUrl: string | null;
}

export type NotificationType = {
    id: number;
    type: string;
    isRead: boolean | null; 
    createdAt: string; 
    reactionType: string;
    relatedPostId?: number;
    relatedCommentId?: number;
    sender: NotificationSenderType;
};

export type NotificationsProps = {
    noReadCount: null | number; 
    list: NotificationType[]
};


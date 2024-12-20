// notification.d.ts

export type NotificationType = {
    id: number;
    type: string;
    isRead: boolean | null; 
    createdAt: string; 
    reactionType: string;
    relatedPostId?: number;
    relatedCommentId?: number;
    sender: {
        id: number;
        username: string;
        pictureUrl: string | null;
    }
};


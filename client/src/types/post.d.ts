

export interface PostType {
    id: number;
    author: {
        id: number;
        username: string;
        profilePictureUrl: string;
        isOnline: boolean;
    },
    content: string;
    mediaFiles: string[];
    reactions: {
        likes?: number;
    },
    commentsCount: number;
    userReaction: string | null;
    createdAt: string;
}
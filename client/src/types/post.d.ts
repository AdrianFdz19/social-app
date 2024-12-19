// post.d.ts

export interface PostType {
    id: number;
    author: {
        id: number;
        username: string;
        profilePictureUrl: string;
        isOnline: boolean;
    };
    content: string;
    mediaFiles: string[];
    reactions: {
        [key: string]: any; // Permite claves dinámicas
        like?: any | string;
        love?: any | string;
        haha?: any | string;
        sad?: any | string;
        angry?: any | string;
    };
    commentsCount: number;
    userReaction: string | null;
    createdAt: string;
}
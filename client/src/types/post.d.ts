

export interface PostType {
    id: number;
    author: {
        username: string;
        profilePictureUrl: string;
        isOnline: boolean;
    },
    content: string;
    mediaFiles: string[];
    reactions: Record<string, number>;
    userReaction: string | null;
    createdAt: string;
}
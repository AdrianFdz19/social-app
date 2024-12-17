import { createContext, useContext, useEffect, useState } from 'react';
import { PostType } from '../types/post';

interface FeedContextType {
    posts: PostType[] | undefined; 
    setPosts: React.Dispatch<React.SetStateAction<PostType[] | undefined>>;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const useFeedContext = () => {
    const context = useContext(FeedContext);
    if (!context) {
        throw new Error('useFeedContext debe usarse dentro de un FeedProvider');
    }
    return context;
};

export default function FeedProvider({ children }: { children: React.ReactNode }) {

    const [posts, setPosts] = useState<PostType[] | undefined>(undefined);

    const value: FeedContextType = {
        posts,
        setPosts
    };

    return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

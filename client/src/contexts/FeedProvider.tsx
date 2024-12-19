import { createContext, useContext, useEffect, useState } from 'react';
import { PostType } from '../types/post';
import { useAppContext } from './AppProvider';

interface FeedContextType {
    posts: PostType[] | undefined; 
    setPosts: React.Dispatch<React.SetStateAction<PostType[] | undefined>>;
    handleReact: (reaction: string, token: string, postId: number) => void;
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
    const { apiUrl } = useAppContext();

    // Handle react to post
    const handleReact = async (reaction: string, token: string, postId: number) => {
        try {
            const response = await fetch(`${apiUrl}/posts/${postId}/reactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ reaction }),
            });
    
            if (response.ok) {
                const data = await response.json();
                const { reactionUpdate } = data;
                console.log(reactionUpdate);
    
                setPosts(prev =>
                    prev.map((post) => {
                        if (post.id === postId) {
                            const currentReactionCount = post.reactions[reaction] || 0;
                            const updatedReactions = { ...post.reactions };
                
                            if (reactionUpdate.type === 'none') {
                                updatedReactions[reaction] = currentReactionCount - 1;
                                
                            } else if (post.userReaction && post.userReaction !== reactionUpdate.type) {
                                updatedReactions[post.userReaction] -= 1;
                                
                                updatedReactions[reaction] = currentReactionCount + 1;
                                
                            } else {
                                updatedReactions[reaction] = currentReactionCount + 1;
                                
                            }
                
                            return {
                                ...post,
                                userReaction: reactionUpdate.type,
                                reactions: updatedReactions,
                            };
                        }
                        return post;
                    })
                );                
            } else {
                console.error('Failed to update reaction:', await response.text());
            }
        } catch (err) {
            console.error(err);
        }
    };    

    useEffect(() => {
        console.log(posts);
    }, [posts]);

    const value: FeedContextType = {
        posts,
        setPosts,
        handleReact
    };

    return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

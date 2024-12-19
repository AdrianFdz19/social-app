// Feed.tsx
import { useEffect, useState } from 'react';
import Post from '../components/post/Post';
import PostSkeleton from '../components/post/PostSkeleton';
import './Feed.scss';
import CreatePost from '../components/CreatePost/CreatePost.tsx';
import { useFeedContext } from '../contexts/FeedProvider';
import { useAppContext } from '../contexts/AppProvider';
import useAuthToken from '../hooks/useAuthToken';

interface FeedProps {
    context: string;
    profileId: string;
}

export default function Feed({context, profileId}: FeedProps) {

    const [isLoading, setIsLoading] = useState(true);
    const { posts, setPosts } = useFeedContext();
    const { apiUrl } = useAppContext();
    const tokenManager = useAuthToken();

    useEffect(() => {
        const token = tokenManager.get();
        const fetchPosts = async (profileId: string) => {
            try {
                const response = await fetch(`${apiUrl}/posts?context=${context}&&profileid=${profileId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data.posts);

                } else {
                    console.error('Server internal error.');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts(profileId);
    }, [apiUrl]);

  return (
    <div className="feed">
        <div className="feed__content">
            <CreatePost />
            {isLoading ? (
                Array(2).fill(0).map((_, index) => <PostSkeleton key={index} />)
            ) : (
                <>
                {posts.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
                </>
            )}
            <div className="feed__end">
                <label>✨ You’ve reached the end! Thanks for exploring. ✨</label>
            </div>
        </div>
    </div>
  )
}

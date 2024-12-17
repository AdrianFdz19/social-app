// Feed.tsx
import { useEffect, useState } from 'react';
import Post from '../components/post/Post';
import PostSkeleton from '../components/post/PostSkeleton';
import './Feed.scss';
import { PostType } from '../types/post';
import CreatePost from '../components/createPost/CreatePost';
import { useFeedContext } from '../contexts/FeedProvider';

export default function Feed() {

    const [isLoading, setIsLoading] = useState(true);
    const { posts, setPosts } = useFeedContext();

    let clientPosts: PostType[] = [
        {
            id: 100, 
            author: {
                id: 1, 
                username: 'AdrianFdz19', 
                profilePictureUrl: 'https://res.cloudinary.com/dlnapytj1/image/upload/v1733857902/post/ffojridccfqvq9mze5s4.jpg',
                isOnline: false,
            },
            content: 'redbull f1 news content', 
            mediaFiles: ['https://res.cloudinary.com/dlnapytj1/image/upload/v1733866920/profileImage/dexc2c0l09pvdf7laewm.jpg'], 
            reactions: {
                likes: 95,
            },
            commentsCount: 0,
            userReaction: null, 
            createdAt: '2024-12-17 13:49:28.32396'
        },
        {
            id: 101, 
            author: {
                id: 5,
                username: 'Juana', 
                profilePictureUrl: 'https://res.cloudinary.com/dlnapytj1/image/upload/v1733852462/samples/upscale-face-1.jpg',
                isOnline: true,
            },
            content: 'Great!', 
            mediaFiles: ['https://res.cloudinary.com/dlnapytj1/image/upload/v1733852460/samples/balloons.jpg'], 
            reactions: {
                likes: 95,
            },
            commentsCount: 3,
            userReaction: null, 
            createdAt: '2024-12-17 13:49:28.32396'
        }
    ]

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setTimeout(() => {
                    setPosts(clientPosts);
                    setIsLoading(false); // Mueve aquí el cambio de estado
                }, 2000);
            } catch (err) {
                console.error(err);
                setIsLoading(false); // Asegúrate de manejar errores correctamente
            }
        };
        fetchPosts();
    }, []);

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
        </div>
    </div>
  )
}

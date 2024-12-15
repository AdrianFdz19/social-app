// Post.tsx

import { useState } from 'react';
import './Post.scss';
import PostActions from './PostActions'
import PostBody from './PostBody'
import PostComments from './PostComments'
import PostHeader from './PostHeader'
import PostSummary from './PostSummary'
import { PostType } from '../../types/post';

interface PostProps {
  post: PostType;
}

export default function Post({post}: PostProps) {

  const [comments, setComments] = useState(false);

  return (
    <div className="post">
        <PostHeader author={post.author} createdAt={post.createdAt} />
        <PostBody content={post.content} mediaFiles={post.mediaFiles} /> 
        <PostSummary reactions={post.reactions} commentsCount={post.commentsCount} /> 
        <PostActions userReaction={post.userReaction} /> 
        {comments && 
        <PostComments />
        }
    </div>
  )
}

// PostActions.tsx

import { postIcons } from "../../assets/icons"
import { useAppContext } from "../../contexts/AppProvider";
import { useFeedContext } from "../../contexts/FeedProvider";
import useAuthToken from "../../hooks/useAuthToken";

interface PostActionsProps {
  userReaction: string | null;
  postId: number;
}

export default function PostActions({userReaction, postId} : PostActionsProps) {

  const { handleReact } = useFeedContext();
  const manageToken = useAuthToken();

  // Handle react to post
  const handleReactPost = () => {
    handleReact('like', manageToken.get(), postId)
  }

  return (
    <div className="post__actions">
        <div className="post__actions__action" onClick={handleReactPost} >
          <postIcons.like className="postact-icon" />
          <p>{userReaction === 'like' ? 'Liked' : 'Like'}</p>
        </div>
        <div className="post__actions__action">
          <postIcons.comment className="postact-icon" />
          <p>Comment</p>
        </div>
        <div className="post__actions__action">
          <postIcons.share className="postact-icon" />
          <p>Share</p>
        </div>
        <div className="post__actions__action">
          <postIcons.save className="postact-icon" />
          <p>Save</p>
        </div>
    </div>
  )
}

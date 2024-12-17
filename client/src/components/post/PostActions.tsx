// PostActions.tsx

import { postIcons } from "../../assets/icons"
import { useAppContext } from "../../contexts/AppProvider";
import useAuthToken from "../../hooks/useAuthToken";

interface PostActionsProps {
  userReaction: string | null;
  postId: number;
}

export default function PostActions({userReaction, postId} : PostActionsProps) {

  const { apiUrl } = useAppContext();
  const manageToken = useAuthToken();

  const handleReact = async (reaction: string) => {
    const authToken = manageToken.get();
    console.log("Auth Token:", authToken); // Verifica que el token no sea null o vacío
    try {
      console.log("API URL:", `${apiUrl}/posts/${postId}/reactions`);
      const response = await fetch(`${apiUrl}/posts/${postId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${authToken}`, // Si usas JWT
        },
        body: JSON.stringify({
          reaction, // e.g., "like", "love", "angry"
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error('Server internal error.');
      }
    } catch (err) {
      console.error(err);
    }
  };  

  return (
    <div className="post__actions">
        <div className="post__actions__action" onClick={()=>handleReact('like')} >
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

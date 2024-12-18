// PostHeader.tsx

import { useNavigate } from "react-router-dom";
import Button from "../Button";
import ProfilePicture from "../ProfilePicture";
import { formatTimestampRelative } from "../../utils/time";
import { useAppContext } from "../../contexts/AppProvider";

interface PostHeaderProps {
  author: {
    id: number;
    username: string;
    profilePictureUrl: string;
    isOnline: boolean;
  },
  createdAt: string;
}

export default function PostHeader({author, createdAt}: PostHeaderProps) {

  const { user } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="post__header">
        <div className="post__header__author-info">
            <ProfilePicture
                url={author.profilePictureUrl} 
                size={3} 
                outline={false}
                handleClick={()=>navigate(`/profile/${author.id}`)}
                isOnline={author.isOnline}
            />
            <div className="ph-author-inf">
                <p id="ph-username" >{author.username}</p>
                <p id="ph-createdat" >{formatTimestampRelative(createdAt)}</p>
            </div>
        </div>
        { parseInt(user.id) !== author.id && 
            <Button
            content={`Follow`} 
            handleClick={()=>{}} 
            isInput={false} 
            styles={{width: '3.5rem', height: '2rem'}}
          />
        }
    </div>
  )
}

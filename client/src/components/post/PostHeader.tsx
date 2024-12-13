// PostHeader.tsx

import Button from "../Button";
import ProfilePicture from "../ProfilePicture";

export default function PostHeader({author, createdAt}) {
  return (
    <div className="post__header">
        <div className="post__header__author-info">
            <ProfilePicture
                url={author.profilePictureUrl} 
                size={3} 
                outline={false}
                handleClick={()=>{}}
                isOnline={author.isOnline}
            />
            <div className="ph-author-inf">
                <p id="ph-username" >{author.username}</p>
                <p id="ph-createdat" >{createdAt}</p>
            </div>
        </div>
        <Button
          content={`Follow`} 
          handleClick={()=>{}} 
          isInput={false} 
          styles={{width: '3.5rem', height: '2rem'}}
        />
    </div>
  )
}

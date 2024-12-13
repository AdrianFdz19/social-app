// ProfilePicture.tsx

import './ProfilePicture.scss';

interface ProfilePictureType {
    url: string | null;
    size: number;
    outline?: boolean;
    handleClick: () => void;
    isOnline: boolean;
}

export default function ProfilePicture({url, size, outline, handleClick, isOnline} : ProfilePictureType) {
  return (
    <div className="profpic-cont">
        { isOnline && <div className="profpic__online"></div> }
    <div className={`profpic ${outline ? 'outline' : ''}`} 
        style={{width: `${size}rem`, height: `${size}rem`}}
        onClick={handleClick}
        >
        <div className="profpic__content">
            { url ? (
                <img src={url} alt="profile_picture_url" />
            ) : (
                <p>none</p>
            )}
        </div>
    </div>
    </div>
  )
}

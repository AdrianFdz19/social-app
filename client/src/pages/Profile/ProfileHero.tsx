import React from 'react'
import { ProfileType } from '../../types/user';
import ProfilePicture from '../../components/ProfilePicture';
import useMobileSize from '../../hooks/useMobileSize';

interface ProfileHeroProps {
    data: ProfileType;
}

export default function ProfileHero({data} : ProfileHeroProps) {

    const { id, username, bio, pictureUrl, bannerPictureUrl, createdAt, updatedAt } = data;

    const isMobile = useMobileSize();

  return (
    <div className="profile__hero">
        <div className="banner">
            { bannerPictureUrl ? (
                <img src={bannerPictureUrl} alt="banner_picture" />
            ) : (
                <div className="banner-none"></div>
            )}
        </div>
        <div className="picture-box">
            <div className="picture">
                <ProfilePicture
                    url={pictureUrl} 
                    size={isMobile ? 7 : 10} 
                    handleClick={() => {}} 
                    outline={true} 
                    isOnline={false}
                />
            </div>
            <h3 id='pf-username' >{username}</h3>
        </div>
    </div>
  )
}

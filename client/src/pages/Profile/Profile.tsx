// Profile.tsx

import { useParams } from 'react-router-dom';
import './Profile.scss';
import { useAppContext } from '../../contexts/AppProvider';
import { useEffect } from 'react';
import ProfileHero from './ProfileHero';
import { ProfileType } from '../../types/user';
import Feed from '../Feed';

export default function Profile() {

  const { user } = useAppContext();
  const { profileUserId } = useParams();

  const userProfile = profileUserId == user.id;

  useEffect(() => {
    window.scrollTo(0,0);
    if (user && profileUserId) {
      console.log(userProfile);
    }
  }, [user, profileUserId]);

  let profile: ProfileType = {
    id: 1,
    username: 'Adrian Fdz',
    pictureUrl: 'https://res.cloudinary.com/dlnapytj1/image/upload/v1733857902/post/ffojridccfqvq9mze5s4.jpg',
    bannerPictureUrl: 'https://res.cloudinary.com/dlnapytj1/image/upload/v1733866920/profileImage/dexc2c0l09pvdf7laewm.jpg',
    bio: '', 
    createdAt: '', 
    updatedAt: ''
  };
    
  return (
    <div className="profile">
        <div className="profile__content">
            <ProfileHero data={profile} />

            <Feed />
        </div>
    </div>
  )
}

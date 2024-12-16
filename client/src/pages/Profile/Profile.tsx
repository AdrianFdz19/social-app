// Profile.tsx

import { useParams } from 'react-router-dom';
import './Profile.scss';
import { useAppContext } from '../../contexts/AppProvider';
import { useEffect, useState } from 'react';
import ProfileHero from './ProfileHero';
import { ProfileType } from '../../types/user';
import Feed from '../Feed';

export default function Profile() {

  const { user, apiUrl } = useAppContext();
  const { profileUserId } = useParams();
  const [profile, setProfile] = useState<ProfileType | undefined>(undefined)

  const userProfile = profileUserId == user.id;
  console.log(profileUserId, userProfile);

  useEffect(() => {
    window.scrollTo(0,0);

    const fetchProfileInfo = async() => {
      try { 
        const response = await fetch(`${apiUrl}/users/profile/${profileUserId}`);
        if (response.ok) {
          const data = await response.json();
          const object = data.profileInfo;
          let profileInfo = {
            id: object.id, 
            username: object.username, 
            email: object.email, 
            bio: object.bio, 
            pictureUrl: object.profile_picture_url, 
            bannerPictureUrl: object.banner_picture_url,
            createdAt: object.created_at,
            updatedAt: object.updated_at
          };
          setProfile(profileInfo);
        }
      } catch(err) {
        console.error(err);
      }
    }
    const setUserProfile = () => {
      let userProfile: ProfileType = {
        id: user.id, 
        username: user.username, 
        email: user.email, 
        bio: user.bio,
        pictureUrl: user.profilePictureUrl, 
        bannerPictureUrl: user.bannerPictureUrl, 
        createdAt: user.createdAt, 
        updatedAt: user.updatedAt
      };
      setProfile(userProfile)
    }
    userProfile ? setUserProfile() : fetchProfileInfo();
  }, [user, profileUserId]);

  return (
    <div className="profile">
        <div className="profile__content">
            {profile && <ProfileHero data={profile} /> }

            <Feed />
        </div>
    </div>
  )
}

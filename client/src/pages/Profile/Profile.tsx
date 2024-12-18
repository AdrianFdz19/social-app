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

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);

    // Determine if the profile is the user's own profile
    const isUserProfile = profileUserId === user.id;

    const fetchProfile = async () => {
      try {
        if (isUserProfile) {
          // Set local user profile data directly
          setProfile({
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            pictureUrl: user.profilePictureUrl,
            bannerPictureUrl: user.bannerPictureUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          });
        } else {
          // Fetch profile data for another user
          const response = await fetch(`${apiUrl}/users/profile/${profileUserId}`);
          if (!response.ok) throw new Error("Failed to fetch profile data");
          
          const { profileInfo } = await response.json();
          setProfile({
            id: profileInfo.id,
            username: profileInfo.username,
            email: profileInfo.email,
            bio: profileInfo.bio,
            pictureUrl: profileInfo.profile_picture_url,
            bannerPictureUrl: profileInfo.banner_picture_url,
            createdAt: profileInfo.created_at,
            updatedAt: profileInfo.updated_at,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [user, profileUserId, apiUrl]);

  return (
    <div className="profile">
        <div className="profile__content">
        {profile ? <ProfileHero data={profile} /> : <p>Loading profile...</p>}
        <Feed context='profile' profileId={profileUserId} />
        </div>
    </div>
  )
}

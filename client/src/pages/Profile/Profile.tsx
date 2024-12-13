// Profile.tsx

import { useParams } from 'react-router-dom';
import './Profile.scss';
import { useAppContext } from '../../contexts/AppProvider';
import { useEffect } from 'react';

export default function Profile() {

  const { user } = useAppContext();
  const {profileUserId} = useParams();

  const userProfile = profileUserId == user.id;

  useEffect(() => {
    if (user && profileUserId) {
      console.log(userProfile);
    }
  }, [user, profileUserId]);
    
  return (
    <div className="profile">
        <div className="profile__content">
            <p>Profile</p>
        </div>
    </div>
  )
}

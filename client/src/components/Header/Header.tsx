// Header.tsx

import { useNavigate } from 'react-router-dom';
import { headerIcons as icon } from '../../assets/icons';
import { useAppContext } from '../../contexts/AppProvider';
import ProfilePicture from '../ProfilePicture';
import './Header.scss';
import HeaderMobile from './HeaderMobile';
import useMobileSize from '../../hooks/useMobileSize';
import { useEffect, useState } from 'react';
import ContextualPanel from '../contextualPanel/ContextualPanel';
import useAuthToken from '../../hooks/useAuthToken';

export default function Header() {

    const [openContextualPanel, setOpenContextualPanel] = useState(true);
    const { user, apiUrl, noReadNotificationsCount, setNoReadNotificationsCount } = useAppContext();
    const navigate = useNavigate();
    const isMobile = useMobileSize();
    const tokenConfig = useAuthToken();

    // Fetch no read notifications count
    useEffect(() => {
        const token = tokenConfig.get();
        const fetchNoReadCount = async() => {
            try {
                const response = await fetch(`${apiUrl}/users/notifications/noread`, {
                    headers: {
                        'Content-Type': 'application/json', 
                        Authorization: `Bearer ${token}`
                    }
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setNoReadNotificationsCount(parseInt(data.count));
                } else { 
                    const data = await response.json();
                    console.error(data.error);
                } 
            } catch(err) {
                console.error(err);
            }
        };
        fetchNoReadCount();
    }, [apiUrl]);

  return (
    <>
    {isMobile ? (
        <HeaderMobile /> 
    ) : (
        <div className="header">
            { openContextualPanel && <ContextualPanel /> }
        <div className="header__content">
            <label onClick={()=>navigate(`/`)} >Social App</label>
            <div className="header__sections">

                <div className="header__sections__section" onClick={()=>navigate(`/`)}>
                    <icon.home className='hss-icon' /> 
                    <label>Home</label>
                </div>
                <div className="header__sections__section">
                    <icon.followers className='hss-icon' /> 
                    <label>Followers</label>
                </div>
                <div className="header__sections__section">
                    <icon.messages className='hss-icon' /> 
                    <label>Messages</label>
                </div>
                <div className="header__sections__section">
                    { noReadNotificationsCount && <div className="hss-noreadcount">{noReadNotificationsCount}</div> }
                    <icon.notifications className='hss-icon' /> 
                    <label>Notifications</label>
                </div>
                
                <div className="header__sections__section">
                    <ProfilePicture
                        url={user?.profilePictureUrl}
                        size={2} 
                        outline={false} 
                        handleClick={()=>navigate(`/profile/${user.id}`)} 
                        isOnline={false}
                    />
                    <label>Profile</label>
                </div>

            </div>
        </div>
        </div>
    )}
    </>
    
  )
}

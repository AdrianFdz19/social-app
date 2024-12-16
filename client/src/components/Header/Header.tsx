// Header.tsx

import { useNavigate } from 'react-router-dom';
import { headerIcons as icon } from '../../assets/icons';
import { useAppContext } from '../../contexts/AppProvider';
import ProfilePicture from '../ProfilePicture';
import './Header.scss';
import useMobileSize from '../../hooks/useMobileSize';
import HeaderMobile from './HeaderMobile';

export default function Header() {

    const { user } = useAppContext();
    const navigate = useNavigate();
    const isMobile = useMobileSize();

  return (
    <>
    {isMobile ? (
        <HeaderMobile />
    ): (
        <div className="header">
        <div className="header__content">
            <label onClick={()=>navigate(`/`)} >Social App</label>
            <div className="header__sections">

                <div className="header__sections__section">
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

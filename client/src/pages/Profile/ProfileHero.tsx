// ProfileHero.tsx

import { ProfileType } from '../../types/user';
import ProfilePicture from '../../components/ProfilePicture';
import useMobileSize from '../../hooks/useMobileSize';
import Button from '../../components/Button';
import { useAppContext } from '../../contexts/AppProvider';
import useAuthToken from '../../hooks/useAuthToken';
import { useChatContext } from '../../contexts/ChatProvider';
import { useNavigate } from 'react-router-dom';
import { openChat } from '../../services/openChat.service';

interface ProfileHeroProps {
    isUserProfile: boolean;
    data: ProfileType;
    targetId: string;
}

export default function ProfileHero({data, isUserProfile, targetId} : ProfileHeroProps) {

    const { apiUrl } = useAppContext();
    const redirect = useNavigate();
    const { setCurrentChatId } = useChatContext();
     const { id, username, bio, pictureUrl, bannerPictureUrl, createdAt, updatedAt } = data;
    const isMobile = useMobileSize();
    const tokenManager = useAuthToken();

    const handleOpenChat = async () => {
        try {
            const token = tokenManager.get();
            const result = await openChat(apiUrl, token, Number(targetId));
            if (result.chatId) {
                setCurrentChatId(result.chatId);
                redirect('/messages');
            } else {
                console.error('Server internal error.');
            }
        } catch(err) {
            console.error(err);
        } 
    };

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

            { !isUserProfile && 
                <Button
                    content={`Send Message`} 
                    handleClick={handleOpenChat} 
                    styles={{}} 
                    isInput={false} 
                    disabled={false}
                />
            }
        </div>
    </div>
  )
}

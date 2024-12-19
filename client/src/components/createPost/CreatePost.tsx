// CreatePost.scss

import './CreatePost.scss';
import ProfilePicture from '../ProfilePicture.tsx'
import { useAppContext } from '../../contexts/AppProvider.tsx'
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useState } from 'react';
import Overlay from '../../layouts/Overlay.tsx';
import Close from '../Close.tsx';
import useAuthToken from '../../hooks/useAuthToken.tsx';
import { postIcons as icon } from '../../assets/icons.ts';
import CreatePostModal from './CreatePostModal';

export default function CreatePost() {

    const navigate = useNavigate();
    const { user } = useAppContext();
    const [openModal, setOpenModal] = useState(false);

    const handleModal = () => {
        setOpenModal(prev => !prev);
    }

  return (
    <>
    { openModal &&
        <CreatePostModal handleModal={handleModal} />
    }
    <div className="crpost" onClick={handleModal}>
        <div className="crpost__box">
            <ProfilePicture
                url={user.profilePictureUrl} 
                size={3}
                isOnline={false}
                outline={false} 
                handleClick={()=>navigate(`/profile/${user.id}`)}
            />

            <label>Post something!</label>
        </div>
    </div>
    </>
  )
}

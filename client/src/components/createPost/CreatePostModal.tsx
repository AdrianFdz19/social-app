import React, { ChangeEvent, FormEvent, useState } from 'react'
import Overlay from '../../layouts/Overlay'
import { postIcons as icon } from '../../assets/icons';
import Close from '../Close';
import useAuthToken from '../../hooks/useAuthToken';
import { useAppContext } from '../../contexts/AppProvider';
import MediaPreview from '../mediaPreview/MediaPreview';
import { useUploadMedia } from '../../hooks/useUploadMedia';
import { useFeedContext } from '../../contexts/FeedProvider';
import ProfilePicture from '../ProfilePicture';

interface CreatePostProps {
    handleModal: () => any;
}

export default function CreatePostModal({handleModal} : CreatePostProps) {

    const { apiUrl, user } = useAppContext();
    const { setPosts } = useFeedContext();
    const { uploadMedia, loading, error } = useUploadMedia(apiUrl);
    const manageToken = useAuthToken();
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [post, setPost] = useState({
        content: '', 
    });

    const handleFileChanging = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        console.log(files);
        setFiles(prev => ([...prev, ...files]));
    };

    const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setPost(prev => ({...prev, content: value}));
    };

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const authToken = manageToken.get();
        setIsLoading(true);
        try {
            let mediaUrls = [];
            // Si hay archivos multimedia subirlos primero 
            if (files.length > 0) {
                try {
                  mediaUrls = await Promise.all(
                    Array.from(files).map(async (file) => {
                      return await uploadMedia(file);
                    })
                  );
                  console.log(mediaUrls); // Aquí tienes una lista de URLs
                } catch (err) {
                  console.error('Error subiendo archivos:', err);
                }
            }
            console.log({...post, mediaUrls});
            const response = await fetch(`${apiUrl}/posts`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${authToken}`
                }, 
                body: JSON.stringify({...post, mediaUrls})
            });

            if (response.ok) {
                const data = await response.json();
                let post = data.newPost;
                let newPost = {
                    ...post, 
                    author: {
                        id: user.id, 
                        username: user.username, 
                        profilePictureUrl: user.profilePictureUrl
                    }
                };
                setPosts(prev => (prev ? [newPost, ...prev] : [newPost]))
                handleModal();
            } else {
                console.error('Server internal error');
            }
        } catch(err) {
            console.error(err);
            setIsLoading(false);
        }
    }

  return (
    <Overlay>
        <div className="crpost-modal">
            <form onSubmit={handleFormSubmit} className="crpost-modal__form">
                <Close handleClick={handleModal} />
                <h2>Create Post</h2>

                <div className="crpost-modal__form__options">
                    <div className="crpost-modal__form__options__option">
                        <input 
                            onChange={handleFileChanging}
                            type="file" 
                            multiple />
                        <icon.addmedia className="crpost-modal__form__options__option__icon" />
                        <label>Add media files</label>
                    </div>
                </div>

                <div className="crpost-modal__form__textarea">
                    <textarea
                        placeholder="Write something..."
                        value={post.content}
                        onChange={handleTextareaChange}
                        name="textarea"
                        id=""
                    ></textarea>
                </div>

                { files.length > 0 &&
                    <MediaPreview mediaArray={files} setMediaArray={setFiles} />
                }

                <div className="crpost-modal__form__actions">
                    <button>Save as a draft</button>
                    <input
                        type="submit"
                        disabled={!post.content}
                        value="Post it"
                    />
                </div>
            </form>
        </div>
    </Overlay>
  )
}

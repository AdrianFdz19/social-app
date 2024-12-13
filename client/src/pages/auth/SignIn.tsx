// SignIn.tsx

import { useState } from "react";
import { useAppContext } from "../../contexts/AppProvider";
import './Sign.scss';
import useAuthToken from "../../hooks/useAuthToken";
import { useNavigate } from "react-router-dom";
import { signIcons } from "../../assets/icons";

interface FormDataType {
    username: string;
    password: string;
}

export default function SignUp() {
    const redirect = useNavigate();
    const { apiUrl, setUser } = useAppContext();
    const [formData, setFormData] = useState<FormDataType>({
        username: '',
        password: ''
    });
    const manageToken = useAuthToken();
    const [showPswd, setShowPswd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({
        clientError: '', username: '', password: ''
    });

    const changePswdVisibility = () => {
        setShowPswd(prev => !prev);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name as keyof FormDataType]: value }));
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setErrors({clientError: '', username: '', password: ''});
    
        try {
            const response = await fetch(`${apiUrl}/auth/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            // Verificar si la respuesta es válida antes de intentar convertir a JSON
            if (!response.ok) {
                const errorData = await response.json();
                const signErrors = errorData.errors;
                console.log(signErrors);
                setErrors(prev => ({...prev, ...signErrors}));
            }
    
            const data = await response.json();
            
            // Respuesta exitosa
            setFormData({ username: '', password: '' }); // Limpiar formulario
            /* console.log('User signed up successfully:', data); */

            // Guardar el token y la información del usuario de forma reactiva
            manageToken.save(data.token);
            setUser({
                id: data.user.id, 
                username: data.user.username, 
                email: data.user.email, 
                profilePictureUrl: data.user.profile_picture_url,
                bannerPictureUrl: data.user.banner_picture_url,
                bio: data.user.bio, 
                isOnline: data.user.is_online, 
                createdAt: data.user.created_at, 
                updatedAt: data.user.updated_at
            });

            redirect('/');
    
        } catch (err: unknown) {
            // Manejo de errores genéricos
            if (err instanceof Error) {
                console.error('Sign error occurred:', err.message);
                setErrors(prev => ({...prev, clientError: err.message}));
            } else {
                console.error('An unexpected error occurred.');
                setErrors(prev => ({...prev, clientError: 'An unexpected error occurred.'}));
            }
        } finally {
            setLoading(false);
        }
    };

    function fieldError(field: string) {
        if (errors[field]) return <p className="sign__error" >{errors[field]}</p>
    };
    
    return (
        <div className="sign">
            <form onSubmit={handleFormSubmit}>
                <h2>Sign In</h2>
                <div className="sign__question">
                    <p>{`Don't have an account?`}</p>
                    <label onClick={()=>redirect('/sign-up')} >Sign Up</label>
                </div>
                <label>
                    <input
                        type="text"
                        placeholder="Email or username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                    { fieldError('username') }
                </label>
                <label>
                    <div className="sign__password">
                        <input
                            type={showPswd ? 'text' : 'password'}
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        { showPswd ? <signIcons.hide className="sign__password__icon" onClick={changePswdVisibility} /> 
                        : <signIcons.show className="sign__password__icon" onClick={changePswdVisibility} /> }
                    </div>
                    { fieldError('password') }
                </label>
                <input 
                    className="sign__submit" 
                    type="submit" value={loading ? 'Submitting...' : 'Submit'}  
                    disabled={loading} 
                />
            </form>
        </div>
    );
}


// SearchBar.tsx

import { ChangeEvent, useState, useEffect, useRef } from 'react';
import './SearchBar.scss';
import { OrbitProgress } from 'react-loading-indicators';
import { useAppContext } from '../../contexts/AppProvider';
import ProfilePicture from '../ProfilePicture';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';

type UserSearchedProps = {
    id: number;
    username: string;
    pictureUrl: string | null;
};

export default function SearchBar() {
    const navigate = useNavigate();
    const { apiUrl } = useAppContext();
    const [searchValue, setSearchValue] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');
    const [users, setUsers] = useState<UserSearchedProps[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchBarRef = useRef<HTMLDivElement>(null);

    // Manejo del debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(searchValue.trim());
        }, 500);

        return () => clearTimeout(handler);
    }, [searchValue]);

    // Buscar usuarios al cambiar el valor debounced
    useEffect(() => {
        if (debouncedValue !== '') {
            fetchUsers(debouncedValue);
        } else {
            setUsers(null);
        }
    }, [debouncedValue]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setError(null);
    };

    const fetchUsers = async (query: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/users/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ searchValue: query }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to fetch users.');
            }

            const data = await response.json();
            setUsers(data.users || []);
        } catch (err: any) {
            setError(err.message);
            setUsers(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Ocultar el modal al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchBarRef.current &&
                !searchBarRef.current.contains(event.target as Node)
            ) {
                setSearchValue('');
                setDebouncedValue('');
                setUsers(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="searchbar" ref={searchBarRef}>
            <div className="searchbar__box">
                <input
                    className="searchbar__input"
                    placeholder="Find users"
                    onChange={handleInputChange}
                    aria-label="Search for users"
                />
            </div>

            {debouncedValue && (
                <div className="searchcont">
                    <div className="searchcont__box">
                        <div className="searchcont__content">
                            {isLoading ? (
                                <div className="searchloading">
                                    <OrbitProgress
                                        dense
                                        color="#e4e4e4"
                                        size="medium"
                                        text=""
                                        textColor=""
                                    />
                                </div>
                            ) : error ? (
                                <p className="searcherror">{error}</p>
                            ) : users && users.length > 0 ? (
                                <ul className="userlist">
                                    {users.map((user) => (
                                        <li key={user.id} className="useritem">
                                            <ProfilePicture
                                                url={user.pictureUrl}
                                                outline={false}
                                                handleClick={() => navigate(`/profile/${user.id}`)}
                                                size={3}
                                                isOnline={false}
                                            />
                                            <span onClick={() => navigate(`/profile/${user.id}`)} >{user.username}</span>
                                            <Button
                                                content="follow"
                                                handleClick={() => {}}
                                                isInput={false}
                                                styles={{ width: '3.5rem' }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="searchnone">No users found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



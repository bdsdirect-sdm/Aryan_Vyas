import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../api';
import "./UserProfile.css"
const UserProfile = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) {
                setError('User not authenticated.');
                setLoading(false);
                return;
            }
            try {
                const response = await getUserProfile(token);
                setUser(response.data);
            } catch (err) {
                setError(`Error fetching profile: ${err}`);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/register');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>User Profile</h2>
            <p><strong>First Name:</strong> {user.firstName}</p>
            <p><strong>Last Name:</strong> {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>User Type:</strong> {user.userType}</p>
            {user.userType === 'Job Seeker' && (
                <div>
                    <p><strong>Agency:</strong> {user.agencyId || 'None'}</p>
                </div>
            )}
            {user.profileImage && (
                <div>
                    <img src={user.profileImage} alt="Profile" width="100" />
                </div>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default UserProfile;




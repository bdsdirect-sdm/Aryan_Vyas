import React, { useEffect, useState } from 'react';
import { getProfile } from '../../api';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate('/profile');
        return;
      }

      try {
        const response:any = await getProfile(token);
        console.log('API Response:', response);
        setProfile(response?.data?.user);
      } catch (err: any) {
        setError(`Failed to fetch profile. Please log in again.${err}`);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signup');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
console.log(`${profile}>>>>>>>`);

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <p>Name: {profile.firstName} {profile.lastName}</p>
      <p>Email: <span className="email">{profile.email}</span></p>
      <div className="buttons">
        <button onClick={() => navigate('/updateProfile')}>Update Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;

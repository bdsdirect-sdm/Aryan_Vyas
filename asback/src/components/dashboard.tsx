import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

interface User {
  agencyId: string;
  profileImage:string;
  resumeFile:string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  userType: string;
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get('http://localhost:4001/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data.userList);
      } catch (error) {
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const handleLogout=()=>{
    try {
      localStorage.removeItem("token");
      setUsers([])
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
console.log(users)
  return (
    <div className="dashboard-container">
      <h1>Welcome</h1>
      <div className="user-cards-container">
        
        {users.map(user => (
          
          <div className="user-card" key={user.id}>
            <p><strong>User Type:</strong> {user.userType === '1' ? 'Job Seeker' : 'Agency'}</p>
            <img src={`http://localhost:4004/uploads/${user.profileImage}`} alt='' />
            <h2>{`${user.firstName} ${user.lastName}`}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Gender:</strong> {user.gender}</p>

            <h1>Agency</h1>
            {/* <p><strong></strong> {user.location}</p> */}
            
            <button 
                className="view-button" 
                onClick={() => window.open(`http://localhost:4004/uploads/${user.resumeFile}`, "_blank")}
              >
                Download Resume
              </button>
            
            <button onClick={handleLogout}>Logout</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Dashboard;
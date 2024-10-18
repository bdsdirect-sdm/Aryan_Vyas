import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface User {
  usertype: string;
  resumeFile: string | null;
  profileImage: string | null;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  userType: string;
  agencyId: number | null;
}

const JobSeeker: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  const navigate = useNavigate();
  
  const logout = () => {
    console.log("logout");
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No token found. Please log in.');
        }
  
        const response = await axios.get(`http://localhost:4001/api/job/${id}`, {
          headers: { Authorization: `Bearer ${token}` }, 
        });
  
        const userData = Array.isArray(response.data) ? response.data : [response.data];

        setUsers(userData);
        
      } catch (error) {
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, [id]);
  
  console.log("users", users);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  
  return (
    <div>
      <h1>Hello,</h1>
      <h1>Agency Dashboard</h1>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>User Type</th>
            <th>Profile Image</th>
            <th>Resume File</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.gender}</td>
              <td>
                {user.usertype === '1' ? 'Job Seeker' : 'Agency'}
              </td>
              
              <td>
                {user.profileImage ? (
                  <img
                    src={`${user.profileImage}`}
                    alt="Profile"
                    
                  />
                ) : (
                  'No image'
                )}
              </td>

              <td>
                {user.resumeFile ? (
                  <a href={`${user.resumeFile}`} target="_blank" rel="noopener noreferrer">
                    Download Resume
                  </a>
                ) : (
                  'No resume'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <center style={{ marginTop: '10%' }}>
        <button 
         
          onClick={logout}
        >
          Logout
        </button>
      </center>
    </div>
  );
};

export default JobSeeker;

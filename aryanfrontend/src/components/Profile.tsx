import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosPath } from '../service';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from 'uuid';
import "../css/Profile.css"

interface JobSeeker {
  status: any;
  isApproved: any;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  resume: string | null;
  profileImg: string | null;
  gender: string;
  Agency: {
    contact: string;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImg: string | null;
  } | null;
}

interface Agency {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImg: string | null;
  gender: string;
  JobSeekers: JobSeeker[];
}

const Profile = () => {
  const [userData, setUserData] = useState<JobSeeker | Agency | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token: any = localStorage.getItem('token');
        if (!token) {
          return navigate('/login');
        }
        const decoded: any = jwtDecode(token);
        const { userId } = decoded.id;
        const response = await axios.get(`${axiosPath}userDetails/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  if (!userData) {
    return <div className="text-center">User not found.</div>;
  }

  const handleApprovalChange = async (userId: number, status: boolean) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${axiosPath}userApproval/${userId}`, { isApproved: status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Successfully Logged Out');
    navigate('/login');
  };

  const isJobSeeker = (user: JobSeeker | Agency): user is JobSeeker => {
    return (user as JobSeeker).Agency !== undefined;
  };

  const openChat = async (jobSeekerId?: number) => {
    try {
      if (isJobSeeker(userData)) {
        if (userData.isApproved && userData.Agency) {
          const jobseekerId = userData.id;
          const agencyId = userData.Agency.id;
          const roomId = uuidv4();

          const response = await axios.post(`${axiosPath}chat/createRoom`, {
            jobseekerId,
            agencyId,
            roomId,
          });

          navigate(`/chat/${response.data.roomId}`);
        }
      } else {
        if (jobSeekerId) {
          const agencyId = userData.id;
          const roomId = uuidv4();

          const response = await axios.post(`${axiosPath}chat/createRoom`, {
            jobseekerId: jobSeekerId,
            agencyId,
            roomId,
          });

          navigate(`/chat/${response.data.roomId}`);
        }
      }
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-header">
        {isJobSeeker(userData) ? 'Job Seeker Profile' : 'Agency Profile'}
      </h2>
      <div className="profile-card">
        <div className="card-body">
          <h3 className="card-title">
            {userData.firstName} {userData.lastName}
          </h3>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Gender:</strong> {userData.gender}
          </p>
          <img
            src={`${axiosPath}${userData.profileImg}`}
            alt="Profile"
            className="profile-img"
          />

          {isJobSeeker(userData) && (
            <>
              <p>
                <strong>Contact:</strong> {userData.contact}
              </p>
              {userData.resume && (
                <p>
                  <strong>Resume:</strong>{' '}
                  <a
                    href={`${axiosPath}${userData.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </p>
              )}
              <p>
                <strong>Current Status:</strong>{' '}
                {userData.isApproved ? 'Approved' : 'Pending Approval'}
              </p>
              {userData.isApproved && userData.Agency && (
                <button
                  onClick={() => openChat()}
                >
                  Chat with Agency
                </button>
              )}
              {userData.Agency && (
                <div>
                  <h4>Agency Details:</h4>
                  <p>
                    <strong>Name:</strong> {userData.Agency.firstName} {userData.Agency.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {userData.Agency.email}
                  </p>
                  <p>
                    <strong>Contact No:</strong> {userData.Agency.contact}
                  </p>
                  {userData.Agency.profileImg && (
                    <img
                      src={`${axiosPath}${userData.Agency.profileImg}`}
                      alt="Agency"
                      className="agency-img"
                    />
                  )}
                </div>
              )}
            </>
          )}

          {!isJobSeeker(userData) && (
            <div>
              <h4>Job Seekers:</h4>
              <ul>
                {userData.JobSeekers.map((jobSeeker) => (
                  <li key={jobSeeker.id}>
                    <strong>
                      {jobSeeker.firstName} {jobSeeker.lastName}
                    </strong> - {jobSeeker.email}
                    <br />
                    <span>Contact: {jobSeeker.contact}</span>
                    <br />
                    <span>Gender: {jobSeeker.gender}</span>
                    <br />
                    {jobSeeker.resume && (
                      <a
                        href={`${axiosPath}${jobSeeker.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Resume
                      </a>
                    )}
                    <span>
                      Current Status: {jobSeeker.isApproved ? 'Approved' : 'Rejected'}
                    </span>
                    <select
                      onChange={(e) =>
                        handleApprovalChange(jobSeeker.id, e.target.value === 'true')
                      }
                      value={jobSeeker.isApproved ? 'true' : 'false'}
                    >
                      <option value="false">Reject</option>
                      <option value="true">Approve</option>
                    </select>
                    {jobSeeker.isApproved && (
                      <button onClick={() => openChat(jobSeeker.id)}>
                        Chat
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;

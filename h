import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../services/userServices';
import {useQuery} from "@tanstack/react-query"
import "./ViewUser.css";

const ViewUser = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response: any = await getUsers();
      setUsers(response);
    };

    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h1 className='userheading'>Users List</h1>
      {users.map((user: any) => (
        <div key={user.id} className="user-card">
          <img src={`http://localhost:4004/images/${user.profilePhoto}`} alt="Profile" />
          <div className="user-info">
            <h3>Name: {user.firstName} {user.lastName}</h3>
            <h3>Email: {user.email}</h3>
            <h3>Company Address: {user.Address.companyAddress}</h3>
            <h3>Company City: {user.Address.companyCity}</h3>
            <h3>Company State: {user.Address.companyState}</h3>
            <h3>Company Zip: {user.Address.companyZip}</h3>
            <h3>Home Address: {user.Address.homeAddress}</h3>
            <h3>Home City: {user.Address.homeCity}</h3>
            <h3>Home State: {user.Address.homeState}</h3>
            <h3>Home Zip: {user.Address.homeZip}</h3>
            <div className="button-group"> 
              <button 
                className="view-button" 
                onClick={() => window.open(`http://localhost:4004/images/${user.appointmentLetter}`, "_blank")}
              >
                View Appointment Letter
              </button>
              <Link to={`/edit-user/${user.id}`}>
                <button className="edit-button">Edit</button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewUser;

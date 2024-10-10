import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/userServices';
import './ViewUser.css';

const useFetchUsers = (pageId: number, limit: number) => {
  return useQuery({
    queryKey: ['users', pageId, limit],
    queryFn: async () => {
      const response: any = await getUsers(pageId,limit);
      return response;
    },
    placeholderData: keepPreviousData,
  });
};

const ViewUser = () => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isError } = useFetchUsers(page, limit);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching users</div>;
  }

  const { users, total } = data;

  return (
    <div className="container">
      <h1 className="userheading">Users List</h1>
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

      <div className="pagination">
        <button 
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))} 
          disabled={page === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button 
          onClick={() => setPage((prev) => (prev * limit < total ? prev + 1 : prev))} 
          disabled={page * limit >= total}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewUser;
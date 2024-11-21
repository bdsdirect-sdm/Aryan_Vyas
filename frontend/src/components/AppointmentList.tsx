/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AppointmentList.css';

const AppointmentsList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get(`${Local.GET_APPOINTMENT_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      toast.error(`${err.message || 'Error fetching appointments data'}`);
    }
  };

  const { data: appointmentsData, error, isLoading, isError } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments,
  });

  console.log("apppointmentttttttttt", appointmentsData);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-danger">
        Error: {error.message || 'Failed to load appointments data'}
      </div>
    );
  }

  return (
    <div className="appointments-list-container">
      <div className="appointments-list-header">
        <h5 className="appointments-list-title">Appointments List</h5>
        <div className="add-appointment-button">
          <button
            onClick={() => navigate('/add-appointment')}
            className="appointment-btn"
            disabled={loading}
          >
            {loading ? 'Adding Appointment...' : 'Add Appointment'}
          </button>
        </div>
      </div>

      <form className="d-flex mb-4 hi" role="search">
        <input
          className="form-control me-2 hi2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          />
        <button className="btn btn-primary btn-search" type="submit">Search</button>
      </form>


      {/* Appointments List Table */}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Patient Name</th>
            <th scope="col">Doctor Name</th>
            <th scope="col">Appointment Date</th>
            <th scope="col">Appointment Type</th>
            {/* <th scope="col">Action</th> */}
          </tr>
        </thead>
        <tbody>
          {appointmentsData?.map((appointment: any) => (
            <tr key={appointment.uuid}>
              <td>{appointment.Patient?.firstname} {appointment.Patient?.lastname}</td>
              <td>{appointment.User?.firstname} {appointment.User?.lastname}</td>
              <td>{appointment.date}</td>
              <td>{appointment.type}</td>
              {/* <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => navigate(`/appointment/${appointment.uuid}`)}
                >
                  View
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsList;
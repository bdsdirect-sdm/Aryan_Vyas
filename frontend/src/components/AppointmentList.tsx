import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import './AppointmentList.css';
import { Local } from '../environment/env';

const AppointmentsList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
const handleAppointment=()=>{
    navigate('/add-appointment')
}
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
      console.log("appointment name",response.data)
      return response.data.appointmentList;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error fetching appointments');
      return [];
    }
  };
  const { data: appointments, isLoading, isError, error } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments,
  });

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
      <div className="error-container">
        <div>Error: {error?.message || 'Error loading appointments'}</div>
      </div>
    );
  }

  return (
    <div className="appointments-list-container">
        <div className='heading-appointment'>
      <p className='my-appointment-heading'>My Appointments</p>
    <button className='appointment-btn' onClick={handleAppointment}>+Add Appointment</button>

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
          

      {appointments?.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Appointment Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment: any) => (
              <tr key={appointment.appointmentId}>
                <td>{appointment.patientName}</td>
        
                
                <td>{appointment.type}</td>
                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                <td>{'Pending'}</td>
                <td>
              <div className='view-icon'>

              <img
              src="view.png"
              alt="Update Address"
              className="googleIcon-3"
            />
            <img
              src="delete.png"
              alt="Delete Address"
              className="googleIcon-3"
            />
              </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No Appointments Available.</div>
      )}
    </div>
  );
};

export default AppointmentsList;

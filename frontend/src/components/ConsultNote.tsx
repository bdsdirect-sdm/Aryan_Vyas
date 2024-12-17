/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoIosArrowBack } from "react-icons/io";
import './ConsultNote.css';

const ConsultNote: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { patientId } = useParams();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchNotes = async () => {
    try {
      const response = await api.get(`${Local.GET_NOTES}/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Patient Notes>>>>>>>>>>", response.data);
      return response.data;
    } catch (err) {
      toast.error('Failed to fetch patient note');
    }
  };

  const { data: patientData, isError, isLoading } = useQuery({
    queryKey: ['patientNote', patientId],
    queryFn: fetchNotes,
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
        <div>Error: Failed to load patient data</div>
      </div>
    );
  }

  if (patientData) {
    const { patientNote, referedByUser, referedToUser } = patientData;


    const { firstname, lastname, notes } = patientNote;
    const patientName = `${firstname} ${lastname}`;


    const referedByName = referedByUser ? `${referedByUser.firstname} ${referedByUser.lastname}` : 'No referral information';

    const referedToName = referedToUser ? `${referedToUser.firstname} ${referedToUser.lastname}` : 'No referral information';

    return (
      <div className="patient-consult-note-container">
        <p className="note-back" onClick={() => navigate("/dashboard")}>
          <span className='arrow-note-back'><IoIosArrowBack /></span>Consult Notes
        </p>

        <div className="patient-consult-note">
          <div className='note'>
            <div className='note-patient-info' style={{ fontSize: 15.5 }}>
              <p className='name-note-heading'>
                Patient Name: <span className="name-note">{patientName}</span>
              </p>
              <p className='referedby-heading'>
                Referred By: <span className="name-note">{referedByName}</span>
              </p>
              <p className='referedto-heading'>
                Referred To: <span className="name-note">{referedToName}</span>
              </p>
            </div>

            <div className='note-data-info' style={{ fontSize: 15.5 }}>
              <p className='note-data-heading'>
                Consult Notes: <span className="note-data">{notes || 'No notes available'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="error-container">
      <div>No patient data available</div>
    </div>
  );
};

export default ConsultNote;

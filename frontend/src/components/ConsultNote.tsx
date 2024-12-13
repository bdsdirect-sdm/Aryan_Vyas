/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoIosArrowBack } from "react-icons/io";
import './ConsultNote.css';

const ConsultNote: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
 
    useEffect(() => {
      if (!token) {
        navigate("/login");
      }
    }, [token, navigate]);
  const fetchPatientList = async () => {
    try {
      const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('patient informaion', response);
      return response.data;
    } catch (err) {
      toast.error('Failed to fetch patient data');
    }
  };

  const { data: patientData, isError: patientError, error: patientErrorMsg, isLoading: patientLoading } = useQuery({
    queryKey: ['patientData'],
    queryFn: fetchPatientList,
  });

  if (patientLoading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (patientError) {
    return (
      <div className="error-container">
        <div>Error: {patientErrorMsg?.message || 'Failed to load patient data'}</div>
      </div>
    );
  }

  const { patientList } = patientData || {};

  if (!patientList) {
    return (
      <div className="error-container">
        <div>No patients found</div>
      </div>
    );
  }

  return (
    <div className="patient-consult-note-container">
      <p className="note-back" onClick={() => navigate("/dashboard")}><span className='arrow-note-back'><IoIosArrowBack /></span>Consult Notes</p>
      {patientList.length === 0 ? (
        <p>No patients available</p>
      ) : (
        patientList.map((patient: any) => (
          <div key={patient.uuid} className="patient-consult-note">
            {/* {console.log("hello",patient.firstname)}; */}
            <div className='note'>

            <div className='note-patient-info'>
            <p className='name-note-heading'>Patient Name:<span className="name-note"> {`${patient.firstname} ${patient.lastname}`}</span></p> 

            <p className='referedby-heading'>Referred By:<span className="name-note"> {patient.referedby ? `${patient.referedby.firstname} ${patient.referedby.lastname}` : 'No referral information'}</span></p>

            <p className='referedto-heading'>Referred To:<span className="name-note"> {patient.referedto ? `${patient.referedto.firstname} ${patient.referedto.lastname}` : 'No referral information'}</span></p>
            </div>  

            <div className='note-data-info'>
            <p className='note-data-heading'><td>{patient.appointmentType}</td><td>{patient.appointmentType}</td>Consult Notes:<span className="note-data"> {patient.notes || 'No notes available'}</span></p>
            </div>
          </div>
          </div>
        ))
      )}
    </div>
);

};

export default ConsultNote;

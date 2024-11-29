import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import { Local } from '../environment/env';
import './PatientDetails.css'
import { IoIosArrowBack } from "react-icons/io";
import moment from 'moment';

const UpdatePatientDetails: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const token = localStorage.getItem('token');
  const doctorType: string | null = localStorage.getItem("doctype");

  const doctorTypeNumber = doctorType ? parseInt(doctorType, 10) : 0;

  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<any>({
    firstname: '',
    lastname: '',
    gender: '',
    email: '',
    dob: '',
    disease: '',
    phoneNumber: '',
    laterality: '',
    timing: '',
    speciality: '',
    companyName: '',
    policyStartingDate: '',
    policyExpireDate: '',
    notes: '',
    referedtoUserId: '',
    referedbyUserId: '',
    appointmentDate: '',
    appointmentType: '',
  });

  const getPatient = async () => {
    try {
      const response = await api.get(`${Local.GET_PATIENT_DETAILS}/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("update>>>>>>>>...................",response);
      setFormData({ ...response.data.patientDetails });
    } catch (err) {
      toast.error("Failed to fetch patient data");
      console.log(err);
    }
  };

  const updatePatient = async () => {
    try {
      const response = await api.put(`${Local.UPDATE_PATIENT_DETAILS}/${patientId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      toast.success(response.data.message);
      navigate(`/patient/${patientId}`);
    } catch (err) {
      toast.error("Failed to update patient details");
      console.log(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    getPatient();
  }, [token]);

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="patient-details-container">
      <div className='details-btn'>
        <p className='back fw-bold' onClick={() => navigate("/patient")}><IoIosArrowBack /> Back</p>
        <button className="appointment-btn" onClick={updatePatient}>Update Patient</button>
      </div>
      <div className='patient-info'>
        <h6 className="fw-bold" style={{ marginTop: '1.5rem', marginBottom: "1.5rem" }}>Basic Information</h6>
        <div className="patient-details">
          <form>
            <div className='name-info row'>
            <div className="form-group2 col" style={{ marginTop: 15 }}>
  <label htmlFor="firstname">First Name:</label>
  <input
    type="text"
    id="firstname"
    name="firstname"
    value={`${formData?.firstname} ${formData?.lastname}`}
    onChange={handleChange}
    required
  />
</div>

              
              <div className="form-group2 col" style={{ marginTop: 15 }}>
                <label htmlFor="gender">Gender:</label>
                <input
                  type="text"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group2 col" style={{ marginTop: 15 }}>
                <label htmlFor="dob">Date of Birth:</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group2 col" style={{ marginTop: 15 }}>
                <label htmlFor="phoneNumber">Phone:</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group2 col" style={{ marginTop: 15 }}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <p style={{ marginTop: '1.5rem', marginBottom: "1.5rem", fontSize: 16, color: "black" }}>Reason of Consult</p>
            <div className="name-info row">
              <div className="form-group2 col p-3">
                <label htmlFor="disease">Reason:</label>
                <input
                  type="text"
                  id="disease"
                  name="disease"
                  value={formData.disease}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group2 col p-3">
                <label htmlFor="laterality">Laterality:</label>
                <input
                  type="text"
                  id="laterality"
                  name="laterality"
                  value={formData.laterality}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group2 col p-3">
                <label htmlFor="timing">Timing:</label>
                <input
                  type="text"
                  id="timing"
                  name="timing"
                  value={formData.timing}
                  onChange={handleChange}
                />
              </div>
            </div>

            <p style={{ marginTop: '1.5rem', marginBottom: "1.5rem", fontSize: 16, color: "black" }}>Referral OD/MD</p>
            <div className="name-info row">
              <div className="form-group2 col p-3">
                <label htmlFor="referedbyUser">MD/OD Name:</label>
                <input
                  type="text"
                  id="referedbyUser"
                  name="referedbyUserId"
                  value={
                    doctorTypeNumber === 1
                      ? `${formData.referedbyUser?.firstname} ${formData.referedbyUser?.lastname}`
                      : doctorTypeNumber === 2
                        ? `${formData.referedtoUser?.firstname} ${formData.referedtoUser?.lastname}`
                        : 'Not Available'
                  }
                  onChange={handleChange}
                />
              </div>
              <div className="form-group2 col p-3">
                <label htmlFor="referedbyLocation">Location:</label>
                <input
                  type="text"
                  id="referedbyLocation"
                  name="referedbyLocation"
                  value={formData.address?.street || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group2 col p-3">
                <label htmlFor="speciality">Speciality:</label>
                <input
                  type="text"
                  id="speciality"
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleChange}
                />
              </div>
            </div>

            <p style={{ marginTop: '1.5rem', marginBottom: "1.5rem", fontSize: 16, color: "black" }}>Appointment Details</p>
            <div className="name-info row">
              <div className="form-group2 col p-3">
                <label htmlFor="appointmentDate">Appointment Date:</label>
                <input
                  type="datetime-local"
                  id="appointmentDate"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group2 col p-3">
                <label htmlFor="appointmentType">Type:</label>
                <input
                  type="text"
                  id="appointmentType"
                  name="appointmentType"
                  value={formData.appointmentType}
                  onChange={handleChange}
                />
              </div>
            </div>

            <p style={{ marginTop: '1.5rem', marginBottom: "1.5rem", fontSize: 16, color: "black" }}>Insurance Details</p>
            <div className="name-info row">
              <div className="form-group2 col p-3">
                <label htmlFor="companyName">Company Name:</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group2 col p-3">
                <label htmlFor="policyStartingDate">Policy Start Date:</label>
                <input
                  type="date"
                  id="policyStartingDate"
                  name="policyStartingDate"
                  value={formData.policyStartingDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group2 col p-3">
                <label htmlFor="policyExpireDate">Policy End Date:</label>
                <input
                  type="date"
                  id="policyExpireDate"
                  name="policyExpireDate"
                  value={formData.policyExpireDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <p style={{ marginTop: '1.5rem', marginBottom: "1.5rem", fontSize: 16, color: "black" }}>Notes</p>
            <div className="name-info row">
              <div className="form-group2 col p-3">
                <label htmlFor="notes">Notes:</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePatientDetails;

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useQuery, useMutation } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Dashboard.css';
import { v4 as uuidv4 } from 'uuid';
import { MdOutlineAutoGraph } from "react-icons/md";
import moment from 'moment';
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const createChatRoomMutation = useMutation({
    mutationFn: async ({ referedById, referedToId, patientId, roomId }: any) => {
      try {
        const response = await api.post(`${Local.BASE_URL}chat/createRoom`, {
          referedById,
          referedToId,
          patientId,
          roomId
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (err) {
        console.error("Error creating chat room", err);
      }
    }
  });


  const getUser = async () => {
    try {
      const response = await api.get(`${Local.GET_USER}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (err) {
      toast.error("Failed to fetch user data");
    }
  };

  const fetchPatientList = async () => {
    try {
      const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("patient dashboard", response); 

      return response.data;
    } catch (err) {
      toast.error("Failed to fetch patient data");
    }
  };

  const fetchDoctorList = async () => {
    try {
      const response = await api.get(`${Local.GET_DOCTOR_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch doctor data");
    }
  };

  const { data: userData, isError: userError, error: userErrorMsg, isLoading: userLoading } = useQuery({
    queryKey: ['userData', token],
    queryFn: getUser
  });

  const { data: patientData, isError: patientError, error: patientErrorMsg, isLoading: patientLoading } = useQuery({
    queryKey: ['patientData'],
    queryFn: fetchPatientList
  });

  const { data: doctorData, isError: doctorError, error: doctorErrorMsg, isLoading: doctorLoading } = useQuery({
    queryKey: ['doctorData'],
    queryFn: fetchDoctorList
  });
  const userGraphData = userData?.data
  console.log("userGraphdata", userGraphData)

  const patientGraphData = patientData
  console.log("patientGraphdata", patientGraphData)

  const doctorGraphData = doctorData
  console.log("doctorGraphdata", doctorGraphData)

  const handleNavigateToGraph = () => {
    navigate('/chart', { state: { userGraphData, patientGraphData, doctorGraphData } });
  };
  if (userLoading || patientLoading || doctorLoading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (userError || patientError || doctorError) {
    return (
      <div className="error-container">
        <div>Error: {userErrorMsg?.message || patientErrorMsg?.message || doctorErrorMsg?.message}</div>
      </div>
    );
  }

  const { user } = userData?.data || {};
  const { patientList } = patientData || {};
  const { doctorList } = doctorData || {};

  localStorage.setItem("firstname", user?.firstname)
  localStorage.setItem("lastname", user?.lastname)

  const totalRefersReceived = patientList?.length || 0;

  const totalRefersCompleted = patientList?.filter((patient: { referalstatus: string; }) => patient.referalstatus === "Completed").length || 0;


  const totalDoctors = doctorList?.length || 0;

  // Pagination Logic
  const totalPages = Math.ceil(patientList?.length / patientsPerPage);
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patientList?.slice(indexOfFirstPatient, indexOfLastPatient);

  // Handle Page Change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Create Page Numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  const handleCreateChatRoom = (referedById: string, referedToId: string, patientId: string) => {
    const roomId = uuidv4();
    console.log("rommmmiiiidddd", roomId);


    createChatRoomMutation.mutate({
      referedById,
      referedToId,
      patientId,
      roomId
    });
  };
  const setRoomDetailsToLocal = (referedById: string, patientFirstname: string, patientLastname: string, referedtoFirstname: string, referedtoLastname: string, referedbyFirstname: string, referedbyLastname: string) => {
    localStorage.setItem("patientFirstName", patientFirstname)
    localStorage.setItem("patientLastName", patientLastname)
    if (referedById === user) {
      localStorage.setItem("doctor_name", referedtoFirstname + ' ' + referedtoLastname)
    } else {
      localStorage.setItem("doctor_name", referedbyFirstname + ' ' + referedbyLastname)
    }
  }
  return (
    <div className="dashboard-container">



      <div className='head-graph'>
        <span className="graph-btn" onClick={handleNavigateToGraph}>Graph<span className='graph-icon'><MdOutlineAutoGraph /></span></span>
      </div>





      <h6 className="dashboard-title fw-bold" style={{ fontSize: 16, color: "black" }}>Dashboard</h6>

      <div className="metrics-cards">
        <div className="card" onClick={() => navigate('/patient')}>
          <div className='card-heading' style={{ color: "black" }}>Referrals Received</div>
          <div className="card-body2">
            <div className='icon d-flex'>
              <img src="referReceived.png" alt="EyeRefer" className='icon-2' />
              <div className="card-text">{totalRefersReceived}</div>
            </div>
            <div className='d-flex justify-content-end fw-bold' style={{ color: "#737A7D" }}>Last update:Dec 17</div>
          </div>
        </div>

        <div className="card">
          <div className='card-heading' style={{ color: "black" }}>Total Refers Completed</div>
          <div className="card-body2">
            <div className='icon d-flex'>
              <img src="referCompleted.png" alt="EyeRefer" className='icon-2' />
              <div className="card-text">{totalRefersCompleted}</div>
            </div>
            <div className='d-flex justify-content-end fw-bold' style={{ color: "#737A7D" }}>Last update:Dec 17</div>
          </div>
        </div>

        <div className="card" onClick={() => navigate('/doctor')}>
          <div className='card-heading' style={{ color: "black" }}>Total Doctors OD/MD</div>
          <div className="card-body2">
            <div className='icon d-flex'>
              <img src="od_md.png" alt="EyeRefer" className='icon-2' />
              <div className="card-text">{totalDoctors}</div>
            </div>
            <div className='d-flex justify-content-end fw-bold' style={{ color: "#737A7D" }}>Last update:Dec 17</div>
          </div>
        </div>
      </div>

      <div className='refer d-flex'>
        {user?.doctype === 2 ? (
          <>
            <h6 className="refer-title">Refer a Patient</h6>
            <button className="appointment-btn" style={{ marginTop: -10 }} onClick={() => navigate("/add-patient")}>+Add Referral Patient</button>
          </>
        ) : (
          <>
            <h6 className="refer-title fw-bold" style={{ color: "black" }}>Referrals Placed</h6>
            <button className="appointment-btn fw-bold" style={{ marginTop: -5 }} onClick={() => navigate("/add-appointment")}>+Add Appointment</button>
          </>
        )}
      </div>

      <div className="patient-list-section">
        <div className="patient-table-container">
          <table className="table">
            <thead className='table-head'>
              <tr>
                <th scope="col table-heading" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Patient Name</th>
                <th scope="col" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>DOB</th>
                <th scope="col" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Created At</th>
                <th scope="col" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Refer by</th>
                <th scope='col' style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Consultation date</th>
                <th scope="col" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Type</th>
                <th scope="col" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Disease</th>
                <th scope="col" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Refer to</th>
                <th scope="col" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Refer back</th>
                <th scope="col" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Status</th>
                <th scope="col" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Consult note</th>
                <th scope="col" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Direct Message</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients?.map((patient: any, index: number) => (
                <tr key={index}>
                  <td><Link to={`/patients-details/${patient.uuid}`} style={{ color: "rgb(46, 113, 244)", borderBottom: "1px solid" }}>{patient.firstname} {patient.lastname}</Link></td>
                  <td>{moment(patient.dob).format("DD-MM-YYYY")}</td>
                  <td>{moment(patient.createdAt).format("DD-MM-YYYY")}</td>
                  <td>{patient.referedby.firstname} {patient.referedby.lastname}</td>
                  <td>{moment(patient.consultationdate).format("DD-MM-YYYY")}</td>
                  <td>{patient.appointmentType || '-'}</td>
                  <td>{patient.disease}</td>
                  <td>{patient.referedto.firstname} {patient.referedto.lastname}</td>
                  <td>{patient.referback ? 'Yes' : 'No'}</td>
                  <td>
                    <span
                      className={`form-select-dropdown ${patient.referalstatus === "Pending" ? 'pending' : patient.referalstatus === "Completed" ? 'completed' : 'rejected'}`}
                      style={{ padding: "2px 10px", width: 100, marginTop: -2 }}
                    >
                      {patient.referalstatus === null ? "Pending" : patient.referalstatus}
                    </span>
                  </td>
                  <td><Link to={`/consult-note/${patient.uuid}`} style={{ color: "rgb(46, 113, 244)", borderBottom: "1px solid" }}>View</Link></td>
                  {/* <td onClick={() => handleCreateChatRoom(patient.referedby.uuid, patient.referedto.uuid, patient.uuid)}>
                      <Link className='text-primary' to='/chat' style={{color:"rgb(46, 113, 244)",borderBottom:"1px solid"}}>Link</Link>
                    </td> */}

                  <td
                    onClick={() => {
                      handleCreateChatRoom(patient.referedby.uuid, patient.referedto.uuid, patient.uuid);
                      setRoomDetailsToLocal(
                        patient.referedby.uuid,
                        patient.firstname,
                        patient.lastname,
                        patient.referedto.firstname,
                        patient.referedto.lastname,
                        patient.referedby.firstname,
                        patient.referedby.lastname
                      );
                      navigate(`/chat`);
                    }}
                  >
                    <div style={{ cursor: "pointer", color:"rgb(46, 113, 244)"}}>
                    <u>Link</u>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-end">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <a className="page-link" href="#" aria-label="Previous" onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  handlePageChange(currentPage - 1);
                }
              }}>
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>

            {/* Page Numbers */}
            {pageNumbers.map((number) => (
              <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                <a
                  className="page-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(number);
                  }}
                >
                  {number}
                </a>
              </li>
            ))}

            {/* Next Button */}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <a className="page-link" href="#" aria-label="Next" onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  handlePageChange(currentPage + 1);
                }
              }}>
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;



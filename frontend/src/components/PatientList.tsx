import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './PatientList.css';
import moment from 'moment';
import { FaRegEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa6";

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;
  const queryClient = useQueryClient();
  
  const doctype = Number(localStorage.getItem("doctype"));

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchPatient = async () => {
    try {
      const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("patientlist status>>>>>>>>", response);
      return response.data;
    } catch (err) {
      toast.error(`Error fetching patients: ${err}`);
    }
  };

  const { data: Patients, error, isLoading, isError } = useQuery({
    queryKey: ['patient'],
    queryFn: fetchPatient,
  });

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };


  const deletePatientMutation = useMutation({
    mutationFn: async (patientId: string) => {
      const isConfirmed = window.confirm('Are you sure you want to delete this patient?');
      
      if (!isConfirmed) {
        return;
      }
  
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('User not authenticated');
        return;
      }
  
      try {
        await api.delete(`${Local.DELETE_PATIENT_DETAILS}/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Patient deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['patient'] });
      } catch (err) {
        toast.error(`Error deleting patient: ${err}`);
      }
    },
    onError: (error) => {
      toast.error(`Failed to delete patient: ${error}`);
    },
  });
  

  const updateStatus = async (patientId: string, newStatus: string) => {
    try {
      await api.put(`${Local.UPDATE_STATUS}/${patientId}`, { referalstatus: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Patient status updated successfully");
      queryClient.invalidateQueries({ queryKey: ['patient'] });
    } catch (err) {
      toast.error(`Error updating patient status: ${err}`);
    }
  };

  // Filter patients based on search query
  const handleSearch = () => {
    if (Patients?.patientList) {
      setFilteredPatients(
        Patients.patientList.filter((patient: any) =>
          `${patient.firstname} ${patient.lastname}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }
  };

  // Reset filtered list when search query is cleared
  useEffect(() => {
    if (Patients?.patientList && searchQuery === '') {
      setFilteredPatients(Patients.patientList); // Reset to original list if search query is cleared
    }
  }, [searchQuery, Patients]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (isLoading) {
    return (
      <>
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div className="text-danger">Error: {error.message}</div>
      </>
    );
  }

  return (
    <div className="patient-list-container">
      <div className='referal-patient'>
        <h6 style={{ marginTop: 15 }}>Referral Patient</h6>
      </div>

      {/* Patient List Heading and Search */}
      <div className="search-border d-flex mb-4 hii1" style={{ marginTop: 10 }} role="search">
        <input
          className="form-control me-2 hi2"
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
          onKeyDown={handleKeyDown}  // Trigger search on "Enter"
          aria-label="Search"
        />
        <button className="btn btn-primary btn-search" type="button" onClick={handleSearch}>
          <i className="fa fa-search" style={{ marginRight: 5 }}></i> Search
        </button>
      </div>

      {/* Patient Table */}
      <div className='table-responsive'>
        <table className="table">
            <thead>
              <tr>
                <th scope="col" style={{padding:"14px 10px",textAlign:"center"}}>Patient Name</th>
                <th scope="col" style={{padding:"14px 10px",textAlign:"center"}}>DOB</th>
                <th scope="col" style={{padding:"14px 10px",textAlign:"center"}}>Consult</th>
                <th scope="col" style={{padding:"14px 10px",textAlign:"center"}}>Appointment Date</th>
                <th scope="col" style={{padding:"14px 10px",textAlign:"center"}}>Refer By</th>
                <th scope="col" style={{padding:"14px 10px",textAlign:"center"}}>Refer To</th>
                <th scope="col" style={{padding:"14px 10px",textAlign:"center"}}>Refer Back</th>
                <th scope="col" style={{padding:"14px 10px",textAlign:"center"}}>Consult Note</th>
                <th scope="col" style={{padding:"14px 10px",textAlign:"center"}}>Status</th>
                <th scope="col" style={{padding:"14px 10px",textAlign:"center"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.length > 0 ? (
                currentPatients.map((patient: any, index: number) => (
                  <tr key={index}>
                    <td>{patient.firstname} {patient.lastname}</td>
                    <td>{moment(patient.dob).format('DD-MM-YYYY')}</td>
                    <td>{patient.disease}</td>
                    <td>{patient.appointmentDate}</td>
                    <td>{patient.referedby.firstname} {patient.referedby.lastname}</td>
                    <td>{patient.referedto.firstname} {patient.referedto.lastname}</td>
                    <td>{patient.referback ? 'Yes' : 'No'}</td>
                    <td>{patient.notes}</td>
                    <td>
                      {(doctype === 1 && patient.referalstatus !== 'Pending') || doctype === 2 ?  (
                        <span>{patient.referalstatus}</span>):
                        (<select
                          value={patient.referalstatus}
                          onChange={(e) => updateStatus(patient.uuid, e.target.value)}
                          className="form-select-dropdown"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      )}
                    </td>
                    <td>
                      <Link to={`/patients-details/${patient.uuid}`}><FaRegEye /></Link>
                      <span
                        style={{ color: "red" }}
                        onClick={() => deletePatientMutation.mutate(patient.uuid)}
                      >
                        <MdDelete />
                      </span>
                      <span>
                        <Link to={`/update-patient/${patient.uuid}`}><FaPen /></Link>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center">No patients found</td>
                </tr>
              )}
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
          {pageNumbers.map((number) => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <a className="page-link" href="#" onClick={(e) => {
                e.preventDefault();
                handlePageChange(number);
              }}>
                {number}
              </a>
            </li>
          ))}
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
  );
};

export default PatientList;

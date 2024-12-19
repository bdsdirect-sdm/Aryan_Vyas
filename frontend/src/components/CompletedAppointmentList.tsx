/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoIosArrowBack } from 'react-icons/io';
import "../components/CompleteAppointmentList.css"

const CompletedAppointmentList: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    const fetchViewCompletedAppointments = async () => {
        try {
            const response = await api.get(`${Local.VIEW_COMPLETED_APPOINTMENTS}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("fetchViewCompletedAppointments>>>>>>>", response.data);
            return response.data;
        } catch (err) {
            toast.error("Failed to fetch completed appointments");
        }
    }

    const { data: completedAppointment, isError: completedAppointmentError, error: completedAppointmentErrorMsg, isLoading: completedAppointmentLoading } = useQuery({
        queryKey: ['completedAppointment', token],
        queryFn: fetchViewCompletedAppointments
    });

    if (completedAppointmentLoading) {
        return (
            <div className="loading-container">
                <div>Loading...</div>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (completedAppointmentError) {
        return (
            <div className="error-container">
                <div>Error: {completedAppointmentErrorMsg?.message}</div>
            </div>
        );
    }

    const { data } = completedAppointment || {};

    const formatDate = (date: string) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0'); 
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };
    return (
        <div className="complete-appointment-list-container">
            <p className="complete-appointment-back" onClick={() => navigate("/dashboard")}>
                <span className='arrow-complete-appointment-back'><IoIosArrowBack /></span>Completed Appointments
            </p>
            
            {data && data.length > 0 ? (
                <div className="patient-table-container">
                    <table className="table">
                        <thead className='table-head'>
                            <tr>
                                <th scope="col table-heading" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Patient Name</th>
                                <th scope="col table-heading" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Status</th>
                                <th scope="col table-heading" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Disease</th>
                                <th scope="col table-heading" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>DOB</th>
                                <th scope="col table-heading" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Gender</th>
                                <th scope="col table-heading" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Email</th>
                                <th scope="col table-heading" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Phone Number</th>
                                <th scope="col table-heading" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Referred On</th>
                                <th scope="col table-heading" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Referred To</th>
                                <th scope="col table-heading" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Type</th>
                                <th scope="col" style={{ padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)" }}>Consult note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((patient: any) => (
                                <tr key={patient.uuid}>
                                    <td>{patient.firstname} {patient.lastname}</td>
                                    <td>{patient.referalstatus}</td>
                                    <td>{patient.disease}</td>
                                    <td>{formatDate(patient.dob)}</td>
                                    <td>{patient.gender}</td>
                                    <td>{patient.email}</td>
                                    <td>{patient.phoneNumber}</td>

                                    <td>{patient.appointments.length > 0 ? formatDate(patient.appointments[0].createdAt) : 'No appointment'}</td>
                                    <td>
                                        {patient.referedtoUser.firstname} {patient.referedtoUser.lastname}
                                    </td>
                                    <td>{patient.appointments.length > 0 ? patient.appointments[0].type : 'No appointment'}</td>

                                    
                                    <td>
                                        <Link to={`/consult-note/${patient.uuid}`} style={{ color: "rgb(46, 113, 244)", borderBottom: "1px solid" }}>
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            ) : (
                <div>No completed appointments found.</div>
            )}
        </div>
    );

}

export default CompletedAppointmentList;

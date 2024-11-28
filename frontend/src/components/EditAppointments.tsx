import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import { Local } from '../environment/env';
import { IoIosArrowBack } from "react-icons/io";
import moment from 'moment';
import "../components/PatientDetails.css";

const EditAppointment: React.FC = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [appointmentData, setAppointmentData] = useState<any>({
        date: '',
        type: '',
        firstname: '',
        lastname: '',
        patientId: '', // Store the patientId to navigate after update
    });

    // Fetch appointment data from API
    const getAppointment = async () => {
        try {
            const response = await api.get(`${Local.EDIT_APPOINTMENT}/${appointmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
console.log("appoinments>>>>>..............",response?.data);

            if (response.data && response.data.appointment) {
                return response.data.appointment;
            } else {
                toast.error("Appointment data not found");
                return {}; // Return an empty object if appointment data is missing
            }
        } catch (err) {
            toast.error("Failed to fetch appointment data");
            console.log(err);
            return {}; // Return an empty object in case of error
        }
    };

    // Query hook to get appointment data
    const { isError, error, isLoading, data } = useQuery({
        queryKey: ['appointmentData', appointmentId],
        queryFn: getAppointment,
    });

    // Set state when data is fetched
    useEffect(() => {
        if (data) {
            setAppointmentData({
                date: moment(data.date).format('YYYY-MM-DD'), // Ensure the date format is correct for input
                type: data.type,
                firstname: data.Patient?.firstname,
                lastname: data.Patient?.lastname,
                patientId: data.patientId,
            });
        }
    }, [data]);

    // Mutation for editing appointment
    const editAppointmentMutation = useMutation({
        mutationFn: async () => {
            const response = await api.put(
                `${Local.EDIT_APPOINTMENT}/${appointmentId}`,
                appointmentData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        },
        onError: (error: any) => {
            toast.error(`Error: ${error.message}`);
        },
        onSuccess: () => {
            toast.success("Appointment updated successfully");
            navigate(`/patient/${appointmentData.patientId}`);
        },
    });

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAppointmentData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (appointmentData.date && appointmentData.type) {
            editAppointmentMutation.mutate();
        } else {
            toast.error("Please fill all required fields");
        }
    };

    // Redirect to login if there's no token
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token]);

    // Loading and error states
    if (isLoading) {
        return (
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        );
    }

    if (isError) {
        return <div className="text-danger">Error: {error instanceof Error ? error.message : 'An error occurred'}</div>;
    }

    return (
        <div className="patient-details-container">
            <div className="details-btn">
                <p className="back fw-bold" onClick={() => navigate(`/patient/${appointmentData.patientId}`)}>
                    <IoIosArrowBack /> Back
                </p>
            </div>
            <div className="patient-info">
                <h6 className="fw-bold" style={{ marginTop: '1.5rem', marginBottom: "1.5rem" }}>Edit Appointment</h6>
                <div className="patient-details">
                    <form onSubmit={handleSubmit}>
                        <div className="name-info row">
                            <div className="form-group2 col">
                                <label htmlFor="patientId">Patient Name</label>
                                <input
                                    type="text"
                                    name="patientId"
                                    value={`${appointmentData.firstname} ${appointmentData.lastname}`} // Concatenate first and last name
                                    disabled
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group2 col">
                                <label htmlFor="date">Appointment Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={appointmentData.date}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group2 col">
                                <label htmlFor="type">Appointment Type</label>
                                <input
                                    type="text"
                                    name="type"
                                    value={appointmentData.type}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditAppointment;

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Local } from "../environment/env";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import moment from "moment";
import "./ViewAppointment.css";
import { IoIosArrowBack } from "react-icons/io";

const AppointmentDetails: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getAppointmentDetails = async () => {
    try {
      console.log("Getting appointment details");
      const response = await api.get(
        `${Local.VIEW_APPOINTMENT}/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      toast.error("Failed to fetch appointment details");
      console.error(err);
    }
  };

  const {
    data: appointmentData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["appointmentDetails", appointmentId],
    queryFn: getAppointmentDetails,
  });
  console.log(appointmentData);
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (isLoading) {
    return (
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-danger">
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );
  }

  if (!appointmentData) {
    return <div>No appointment data available.</div>;
  }

  return (
    <div className="view-appointment-container">  
      <div className="back fw-bold" onClick={() => navigate(-1)}><IoIosArrowBack />Back</div>
      <div className="appointment-info">
      <h6 style={{color:"black",fontWeight:"bold"}}>Basic Information</h6>
      <div className="appointment-details">
        <div className="upper">
        <div className="row">

        <div className="col" style={{display:"flex"}}> 
        <p className="appointment-heading" style={{fontWeight:"bold"}}>
            Name:</p><span style={{color:"#737a7d",fontWeight:"bold"}}>{appointmentData.patient.firstname}{" "}
            {appointmentData.patient.lastname}</span>
          
        </div>

        <div className="col" style={{display:"flex"}}>
          <p className="appointment-heading"style={{fontWeight:"bold"}}>Appointment Date: </p><span style={{color:"#737a7d",fontWeight:"bold"}}>{" "} {moment(appointmentData.appoinment.date).format("DD-MM-YYYY")}</span>
          
        </div>
      <div className="col">
        
      </div>


        </div>

        <div className="row">
        <div className="col" style={{display:"flex"}}>
        <p className="appointment-heading"style={{fontWeight:"bold"}}>Type: </p><span style={{color:"#737a7d",fontWeight:"bold"}}>{appointmentData.appoinment.type}</span>
        </div>

        </div>

      </div>
      </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
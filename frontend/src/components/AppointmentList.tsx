/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import { Local } from "../environment/env";
import api from "../api/axiosInstance";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AppointmentList.css";
import { FaRegEye } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";

const AppointmentsList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const appointmentsPerPage = 5; // Appointments to show per page
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get(`${Local.GET_APPOINTMENT_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
console.log("status",response);

      return response.data;
    } catch (err: any) {
      toast.error(`${err.message || "Error fetching appointments data"}`);
    }
  };

  const {
    data: appointmentsData,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
  });

  // Handle search query change
  const handleSearch = () => {
    if (appointmentsData) {
      setFilteredAppointments(
        appointmentsData.filter((appointment: any) =>
          `${appointment.Patient?.firstname} ${appointment.Patient?.lastname}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }
  };

  // Reset filtered list when search query is cleared
  useEffect(() => {
    if (appointmentsData && searchQuery === "") {
      setFilteredAppointments(appointmentsData); // Reset to original list if search query is cleared
    }
  }, [searchQuery, appointmentsData]);

  // Pagination Logic
  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle Enter key press for search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(); // Trigger search when Enter key is pressed
    }
  };

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
        Error: {error.message || "Failed to load appointments data"}
      </div>
    );
  }

  return (
    <div className="appointments-list-container">
      <div className="appointments-list-header">
        <h5 className="appointments-list-title">Appointments List</h5>
        <div className="add-appointment-button">
          <button
            onClick={() => navigate("/add-appointment")}
            className="appointment-btn"
            disabled={loading}
          >
            {loading ? "Adding Appointment..." : "Add Appointment"}
          </button>
        </div>
      </div>

      {/* Search Input and Button */}
      <div className="search-border d-flex mb-4 hi" role="search">
        <input
          className="form-control me-2 hi2"
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
          onKeyDown={handleKeyDown}  // Trigger search on "Enter"
          aria-label="Search"
        />
        <button
          className="btn btn-primary btn-search"
          type="button"
          onClick={handleSearch}
        >
          <i className="fa fa-search" style={{ marginRight: 5 }}></i> Search
        </button>
      </div>

      {/* Appointments List Table */}
      <div className="patient-table-container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" style={{padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)"}}>Patient Name</th>
              <th scope="col" style={{padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)"}}>Consultation Date</th>
              <th scope="col" style={{padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)"}}>Doctor Name</th>
              <th scope="col" style={{padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)"}}>Type</th>
              <th scope="col" style={{padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)"}}>Status</th>
              <th scope="col" style={{padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)"}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.length > 0 ? (
              currentAppointments.map((appointment: any) => (
                <tr key={appointment.uuid}>
                  <td>
                    {appointment.Patient?.firstname}{" "}
                    {appointment.Patient?.lastname}
                  </td>
                  <td>{appointment.date}</td>
                  <td>
                    {appointment.User?.firstname} {appointment.User?.lastname}
                  </td>
                  <td>{appointment.type}</td>
                  <td>
                    <span
                      className={`form-select-dropdown ${appointment.Patient?.referalstatus === "Pending" ? 'pending' : appointment.Patient?.referalstatus === "Completed" ? 'completed' : 'rejected'}`}
                      style={{ padding: "2px 10px", width: 100, marginTop: -2 }}
                    >
                      {appointment.Patient?.referalstatus === null ? "Pending" : appointment.Patient?.referalstatus}
                    </span>
                  </td>

                  <td>
                    <Link to={`/view-appointment/${appointment.uuid}`}>
                      <FaRegEye />
                    </Link>
                    <span style={{ paddingLeft: 20 }}>
                      <Link to={`/update-appointment/${appointment.uuid}`}>
                        <FaPenToSquare />
                      </Link>
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-end">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <a
              className="page-link"
              href="#"
              aria-label="Previous"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  handlePageChange(currentPage - 1);
                }
              }}
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>

          {/* Page Number Buttons */}
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? "active" : ""}`}
            >
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
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <a
              className="page-link"
              href="#"
              aria-label="Next"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  handlePageChange(currentPage + 1);
                }
              }}
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AppointmentsList;

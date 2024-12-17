/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './AddStaff.css';

const AddStaff: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStaff, setFilteredStaff] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const staffPerPage = 5;

  // Fetch staff list using useQuery
  const { data: staffList = [], isFetching, isError } = useQuery({
    queryKey: ['staffList'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view staff.');
        navigate('/login');
        return [];
      }

      const response = await api.get(import.meta.env.VITE_GET_STAFF, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("StaffList",response.data);
      
      return response.data;
    },
    staleTime: 60000, // Cache for 1 minute
  });

  // Set filtered staff when staff list is fetched
  useEffect(() => {
    if (staffList.length > 0) {
      setFilteredStaff(staffList); // Initialize filtered staff with the full list
    }
  }, [staffList]);

  // Add staff using useMutation
  const mutation = useMutation({
    mutationFn: async (staffData: any) => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to add staff.');
        navigate('/login');
        return;
      }

      await api.post('/add-Staff', staffData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success('Staff added successfully');
      queryClient.invalidateQueries();
      formik.resetForm();
      closeModal();
    },
    onError: () => {
      toast.error('Failed to add staff');
    },
  });

  const validationSchema = Yup.object({
    staffName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Staff Name must only contain letters and spaces') // Only letters and spaces allowed
      .required('Staff Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone Number is required')
      .matches(/^\d+$/, 'Phone Number must be a numeric value') // Ensure it's numeric
      .length(10, 'Phone Number must be exactly 10 digits long'), // Exactly 10 digits
    gender: Yup.string().required('Gender is required'),
  });

  const formik = useFormik({
    initialValues: {
      staffName: '',
      email: '',
      phone: '',
      gender: 'Male',
    },
    validationSchema,
    onSubmit: (values) => {
      const staffData = {
        staffName: values.staffName,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
      };
      mutation.mutate(staffData); // Call mutate to add staff
    },
  });

  // Open and close modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    formik.resetForm(); // Reset form fields when the modal is closed
  };

  const handleSearch = () => {
    if (searchQuery) {
      setFilteredStaff(
        staffList.filter((staff: any) =>
          staff.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.phone.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } 
    // else {
    //   setFilteredStaff(staffList);
    // }
  };
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredStaff(staffList); // Reset to original list if search query is cleared
    }
  }, [searchQuery, staffList]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredStaff.length / staffPerPage);
  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  // const handleStaffNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value.replace(/[^A-Za-z\s]/g, ''); 
  //   formik.setFieldValue('staffName', value);
  //   };
  // Prevent non-numeric input for phone number
  // const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
  //   formik.setFieldValue('phone', value); // Update the formik field with the cleaned value
  // };

  return (
    <>
      <div className="add-staff-container">
        <div className="add-staff">
          <h5 className="appointments-list-title">Staff List</h5>
          <button className="btn-add-staff" onClick={openModal}>+ Add Staff</button>
        </div>

        {/* Modal for adding new staff */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add Staff</h3>
              <form className="add-staff-form" onSubmit={formik.handleSubmit}>
                <div className="form-group1">
                  <label htmlFor="staffName">Staff Name<span className="star">*</span></label>
                  <input
                    type="text"
                    id="staffName"
                    className="form-control1"
                    value={formik.values.staffName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder='Enter Staff Name'
                  />
                  {formik.touched.staffName && formik.errors.staffName && (
                    <div className="text-danger1">{formik.errors.staffName}</div>
                  )}
                </div>

                <div className="form-group1">
                  <label htmlFor="email">Email<span className="star">*</span></label>
                  <input
                    type="email"
                    id="email"
                    className="form-control1"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder='Enter Staff Email'
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-danger1">{formik.errors.email}</div>
                  )}
                </div>

                <div className="form-group1">
                  <label htmlFor="phone">Phone Number<span className="star">*</span></label>
                  <input
                    type="text"
                    id="phone"
                    className="form-control1"
                    value={formik.values.phone}
                    onChange={formik.handleChange} // Custom handler to remove non-numeric characters
                    onBlur={formik.handleBlur}
                    maxLength={10}
                    placeholder='Enter Staff Phone number'
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <div className="text-danger1">{formik.errors.phone}</div>
                  )}
                </div>

                <div className="form-group1">
                  <label htmlFor="gender">Gender<span className="star">*</span></label>
                  <select
                    id="gender"
                    className="form-control1"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {formik.touched.gender && formik.errors.gender && (
                    <div className="text-danger1">{formik.errors.gender}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary">Add Staff</button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              </form>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <form className="d-flex mb-4 hi" role="search">
          <input
           style={{height:50}}
            type="search"
            className="form-control me-2 hi2"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); 
        handleSearch(); 
      }
    }}
    aria-label="Search"
          />
          <button className="btn btn-primary btn-search" style={{height:50,width:130}} type="button" onClick={handleSearch}>
            <i className="fa fa-search" style={{ marginRight: 1 }}></i> Search
          </button>
        </form>

        {/* Display staff list */}
        <div className="patient-table-container">
          <table className="table">
            <thead>
              <tr>
                <th scope="col"style={{padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)"}}>Staff Name</th>
                <th scope="col"style={{padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)"}}>Email</th>
                <th scope="col"style={{padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)"}}>Phone</th>
                <th scope="col"style={{padding: "14px 10px", textAlign: "center", fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.5rem", letterSpacing: "0.01071em", color: "rgba(0, 0, 0, 0.87)"}}  >Gender</th>
              </tr>
            </thead>
            <tbody>
              {currentStaff.map((staff: any) => (
                <tr key={staff.id}>
                  <td>{staff.staffName}</td>
                  <td>{staff.email}</td>
                  <td>{staff.phone}</td>
                  <td>{staff.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-end">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
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
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index + 1}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <a
                  className="page-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(index + 1);
                  }}
                >
                  {index + 1}
                </a>
              </li>
            ))}

            {/* Next Button */}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
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
    </>
  );
};
export default AddStaff;


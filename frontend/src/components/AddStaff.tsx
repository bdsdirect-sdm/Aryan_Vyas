/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AddStaff.css';

const AddStaff: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const staffPerPage = 5;

  useEffect(() => {
    const fetchStaff = async () => {
      setFetching(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view staff.');
        navigate('/login');
        return;
      }

      try {
        const response = await api.get(import.meta.env.VITE_GET_STAFF, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setStaffList(response.data);
          setFilteredStaff(response.data);
        } else {
          toast.error('Failed to fetch staff list.');
        }
      } catch (err: any) {
        toast.error('Error fetching staff list');
        console.log(err);
      } finally {
        setFetching(false);
      }
    };

    fetchStaff();
  }, [navigate]);

  const validationSchema = Yup.object({
    staffName: Yup.string().required('Staff Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone Number is required')
      .matches(/^\d+$/, 'Phone Number must be a numeric value')
      .length(10, 'Phone Number must be exactly 10 digits long'),
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
    onSubmit: async (values) => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to add staff.');
        navigate('/login');
        return;
      }

      const staffData = {
        staffName: values.staffName,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
      };

      try {
        setLoading(true);
        const response = await api.post('/add-Staff', staffData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 201) {
          toast.success('Staff added successfully');
          formik.resetForm();
          closeModal();
          await fetchStaff(); // Fetch the updated staff list
        } else {
          toast.error('Failed to add staff');
        }
      } catch (err: any) {
        console.log(err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Search functionality
  const handleSearch = () => {
    if (searchQuery) {
      setFilteredStaff(
        staffList.filter((staff: any) =>
          `${staff.staffName}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredStaff(staffList); // Reset if search query is empty
    }
  };

  // Event handler for "Enter" key press
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredStaff.length / staffPerPage);
  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="add-staff-container">
        <div className='add-staff'>
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
                  <label htmlFor="staffName">Staff Name<span className='star'>*</span></label>
                  <input
                    type="text"
                    id="staffName"
                    className="form-control1"
                    value={formik.values.staffName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.staffName && formik.errors.staffName && (
                    <div className="text-danger1">{formik.errors.staffName}</div>
                  )}
                </div>

                <div className="form-group1">
                  <label htmlFor="email">Email<span className='star'>*</span></label>
                  <input
                    type="email"
                    id="email"
                    className="form-control1"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-danger1">{formik.errors.email}</div>
                  )}
                </div>

                <div className="form-group1">
                  <label htmlFor="phone">Phone Number<span className='star'>*</span></label>
                  <input
                    type="text"
                    id="phone"
                    className="form-control1"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    maxLength={10}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <div className="text-danger1">{formik.errors.phone}</div>
                  )}
                </div>

                <div className="form-group1">
                  <label htmlFor="gender">Gender<span className='star'>*</span></label>
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

                <div className="add-staff-div">
                  <button className="btn btn-cancel1" onClick={closeModal}>Cancel</button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Adding Staff...' : 'Add Staff'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search Input */}
        <form className="d-flex mb-4 hii1" style={{ marginTop: 25 }} role="search" onSubmit={(e) => e.preventDefault()}>
          <input
            className="form-control1 me-2 hi2"
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown} // Added this event handler for Enter key press
            aria-label="Search"
          />
          <button className="btn btn-primary btn-search" type="button" onClick={handleSearch}>
            <i className="fa fa-search" style={{ marginRight: 5 }}></i>Search
          </button>
        </form>

        {/* Staff List Table */}
        {fetching ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : currentStaff.length > 0 ? (
          <div className="staff-list-container">
            <div className="patient-table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Staff Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStaff.map((staff: any, index: number) => (
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
          </div>
        ) : (
          <p>No staff found.</p>
        )}

        {/* Pagination Controls */}
        <div className="pagination-controls d-flex justify-content-end mt-4 pagination-color">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <a
                  className="page-link"
                  href="#"
                  aria-label="Previous"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              {/* Loop to create page numbers */}
              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <a
                    className="page-link"
                    href="#"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </a>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <a
                  className="page-link"
                  href="#"
                  aria-label="Next"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default AddStaff;

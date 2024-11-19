/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AddStaff.css';

const AddStaff: React.FC = () => {
  const navigate = useNavigate();

  const [staffName, setStaffName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [staffList, setStaffList] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  // Fetch staff list on component mount
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

  // Handle adding new staff
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to add staff.');
      navigate('/login');
      return;
    }

    const staffData = {
      staffName,
      email,
      phone,
      gender,
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
        setStaffName('');
        setEmail('');
        setPhone('');
        setGender('Male');
        closeModal();
        await fetchStaff();
      } else {
        toast.error('Failed to add staff');
      }
    } catch (err: any) {
      console.log(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="add-staff-container">
        <button className="btn-add-staff" onClick={openModal}>+ Add Staff</button>

        {/* Modal for adding new staff */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add Staff</h3>
              <form className="add-staff-form" onSubmit={handleAddStaff}>
                <div className="form-group">
                  <label htmlFor="staffName">Staff Name<span className='star'>*</span></label>
                  <input
                    type="text"
                    id="staffName"
                    className="form-control"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email<span className='star'>*</span></label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number<span className='star'>*</span></label>
                  <input
                    type="text"
                    id="phone"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender<span className='star'>*</span></label>
                  <select
                    id="gender"
                    className="form-control"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
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

        {/* Staff List Table */}
        <p className="staff-list-header fs-4 fw-bold">Staff List</p>

        <form className="d-flex mb-4 hi" role="search">
        <input
          className="form-control me-2 hi2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          />
        <button className="btn btn-primary btn-search" type="submit">Search</button>
      </form>



        {fetching ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : staffList.length > 0 ? (
          <div className="staff-list-container">
            <table className="table">
              <thead>
                <tr>
                  {/* <th scope="col">#</th> */}
                  <th scope="col">Staff Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Gender</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff: any, index: number) => (
                  <tr key={staff.id}>
                    {/* <td className="fw-bold">{index + 1}</td> */}
                    <td>{staff.staffName}</td>
                    <td>{staff.email}</td>
                    <td>{staff.phone}</td>
                    <td>{staff.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No staff found.</p>
        )}
      </div>
    </>
  );
};

export default AddStaff;
function fetchStaff() {
  throw new Error('Function not implemented.');
}
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { toast } from 'react-toastify';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './UpdatePassword.css'; // Optional: Add custom CSS for styling

const UpdatePassword: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [loading, setLoading] = React.useState(false);

  // Yup validation schema
  const validationSchema = Yup.object({
    oldPassword: Yup.string().required('Old password is required'),
    newPassword: Yup.string().min(8, "Password must be at least 8 characters long").required("Password is required")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[`~!@#$%^&*()"?<>|:{}(),.]/, "Password must contain at least one special Character"),
    confirmPassword: Yup.string().required("Confirm Password is required")
    .oneOf([Yup.ref('password')], 'Passwords must match')
  });

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        // Make API call to change password
        const response = await api.post(
          `${Local.CHANGE_PASSWORD}`,
          {
            currentPassword: values.oldPassword,
            newPassword: values.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success('Password changed successfully!');
        formik.resetForm();
        navigate('/dashboard');
      } catch (err) {
        toast.error('Failed to update password. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="update-password-container">
      <div className="update-password">
        <h3 className="update-password-title">Change Password</h3>

        <form onSubmit={formik.handleSubmit} className="update-password-form">
          <div className="form-group3">
            <label htmlFor="old-password">Old Password<span className='star'>*</span></label>
            <input
              type="password"
              id="old-password"
              name="oldPassword"
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              className="form-control"
              placeholder="Old Password"
            />
            {formik.touched.oldPassword && formik.errors.oldPassword ? (
              <div className="error" style={{color:"red"}}>{formik.errors.oldPassword}</div>
            ) : null}
          </div>

          <div className="form-group3">
            <label htmlFor="new-password">New Password<span className='star'>*</span></label>
            <input
              type="password"
              id="new-password"
              name="newPassword"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              className="form-control"
              placeholder="New Password"
              autoComplete="off"
            />
            {formik.touched.newPassword && formik.errors.newPassword ? (
              <div className="error" style={{color:"red"}}>{formik.errors.newPassword}</div>
            ) : null}
          </div>

          <div className="form-group3">
            <label htmlFor="confirm-password">Confirm New Password<span className='star'>*</span></label>
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              className="form-control"
              placeholder="Confirm Password"
              autoComplete="off"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="error" style={{color:"red"}}>{formik.errors.confirmPassword}</div>
            ) : null}
          </div>

          <div className="btn-reset">
            <button
              onClick={handleCancel}
              type="button"
              className="cancel-btn btn btn-outline-success"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="password-btn btn btn-info"
              disabled={loading}
              style={{ backgroundColor: "#35c0e4", borderColor: "#35c0e4" }}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;

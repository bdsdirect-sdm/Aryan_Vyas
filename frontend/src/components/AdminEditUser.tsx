/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Local } from "../environment/env";
import "../css/AdminEditUser.css";
import 'react-toastify/dist/ReactToastify.css'; 
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

interface EditUserModalProps {
  user: any;
  onClose: () => void;
  refreshUsers: () => void;
}

const AdminEditUser: React.FC<EditUserModalProps> = ({ user, onClose, refreshUsers }) => {
  const [activeSection, setActiveSection] = useState<'basic' | 'personal'>('basic');

  useEffect(() => {
    console.log("AdminEditUser mounted for user:", user);
  }, [user]);

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    phone_number: Yup.string().required("Phone Number is required"),
    address1: Yup.string().required("Address 1 is required"),
    address2: Yup.string().optional(),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zip: Yup.string().required("Zip Code is required"),
    dob: Yup.date().required('Date of birth is required').max(new Date(), 'Date of birth cannot be a future date'),
    gender: Yup.string().required("Gender is required"),
    marital_status: Yup.string().required("Marital Status is required"),
    social: Yup.string().required("Social is required"),
    kids: Yup.string()
            .typeError("Kids must be a number")
            .min(0, "Kids cannot be negative"),
     ssn: Yup.string()
    .matches(/^\d+$/, "Social Security Number must be numbers only")
    .min(5, "Social Security Number must be at least 5 digits")
            .max(9, "Social Security Number cannot exceed 9 digits")
            .required("Social Security Number Is Compulsory"),
  });

const handleSubmit = async (values: any) => {
  console.log("Submitting form:", values);

  try {
    const response = await axios.put(
      `${Local.BASE_URL}${Local.EDIT_ADMIN_USER}/${user.id}`,
      values,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    console.log("Admin Edit Users Response:", response.data);

    if (response.data.message) {
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });

      refreshUsers();
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      toast.error("No message received from server", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  } catch (error: any) {
    console.error("API Error:", error);
    toast.error(error.response?.data?.error || "Failed to update user", {
      position: "top-right",
      autoClose: 5000,
    });
  }
};

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <div className="edit-user-background">
          <p style={{fontSize:"85px",textAlign:"center",color:"#B89C67"}}>Edit User</p>
        </div>

        <div className="section-toggle">
          <h3
            className={`section-title ${activeSection === 'basic' ? "active" : ""}`}
            onClick={() => setActiveSection('basic')}
            style={{
              borderBottom: activeSection === 'basic' ? '2px solid #3e5677' : 'none',
              fontSize: "16px",
              fontWeight: "bold",
              color: "rgb(51, 51, 51)"
            }}
          >
            Basic Details
          </h3>
          <h3
            className={`section-title ${activeSection === 'personal' ? "active" : ""}`}
            onClick={() => setActiveSection('personal')}
            style={{
              borderBottom: activeSection === 'personal' ? '2px solid #3e5677' : 'none', 
              fontSize: "16px",
              fontWeight: "bold",
              color: "rgb(51, 51, 51)"
            }}
          >
            Personal Details
          </h3>
        </div>

        <Formik
          initialValues={{
            first_name: user.first_name || "",
            last_name: user.full_name.split(" ").slice(1).join(" ") || "",
            phone_number: user.phone_number || "",
            address1: user.address1 || "",
            address2: user.address2 || "",
            city: user.city || "",
            state: user.state || "",
            zip: user.zip || "",
            dob: user.dob || "",
            gender: user.gender || "Male",
            marital_status: user.marital_status || "Unmarried",
            social: user.social || "",
            kids: user.kids || "",
            ssn: user.ssn || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form className="admin-form">
              {activeSection === 'basic' && (
                <>
                  <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <Field type="text" name="first_name" placeholder="First Name" />
                    <ErrorMessage name="first_name" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <Field type="text" name="last_name" placeholder="Last Name" />
                    <ErrorMessage name="last_name" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone_number">Phone Number</label>
                    <Field type="text" name="phone_number" placeholder="Phone Number" />
                    <ErrorMessage name="phone_number" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address1">Address 1</label>
                    <Field type="text" name="address1" placeholder="Address 1" />
                    <ErrorMessage name="address1" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address2">Address 2</label>
                    <Field type="text" name="address2" placeholder="Address 2" />
                    <ErrorMessage name="address2" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <Field type="text" name="city" placeholder="City" />
                    <ErrorMessage name="city" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <Field type="text" name="state" placeholder="State" />
                    <ErrorMessage name="state" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="zip">Zip Code</label>
                    <Field type="text" name="zip" placeholder="Zip Code" />
                    <ErrorMessage name="zip" component="div" className="error-message" />
                  </div>
                </>
              )}

              {activeSection === 'personal' && (
                <>
                  <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <Field type="date" name="dob" placeholder="Date of Birth" />
                    <ErrorMessage name="dob" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <Field as="select" name="gender" style={{marginTop:"0px",width:"99%"}}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Field>
                    <ErrorMessage name="gender" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="marital_status">Marital Status</label>
                    <Field as="select" name="marital_status" style={{width:"97%"}}>
                      <option value="Married">Married</option>
                      <option value="Unmarried">Unmarried</option>
                    </Field>
                    <ErrorMessage name="marital_status" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="social">Social</label>
                    <Field type="text" name="social" placeholder="Social" style={{marginTop:"3px",padding:"10px"}} />
                    <ErrorMessage name="social" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="kids">Kids</label>
                    <Field type="text" name="kids" placeholder="Kids" />
                    <ErrorMessage name="kids" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="ssn">Social Security Number</label>
                    <Field type="text" name="ssn" placeholder="Social Security Number" />
                    <ErrorMessage name="ssn" component="div" className="error-message" />
                  </div>
                  <div className="form-group"></div>
                  <div className="form-group"></div>
                  <div className="form-group"></div>
                  <div className="form-group" style={{marginTop:27.5}}></div>
                </>
              )}

              <div className="modal-buttons">
                <button type="submit">Update</button>
                <button type="button" onClick={onClose}>Cancel</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminEditUser;

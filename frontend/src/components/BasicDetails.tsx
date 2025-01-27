/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Local } from "../environment/env";
import { useProfile } from "../context/ProfileContext";
import "../css/Profile.css";

const BasicDetails = () => {
  const { setUserName } = useProfile();

  const [initialValues, setInitialValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    ssn: "",
    phone_number: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
  })
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    getBasicDetails();
  }, []);


  const getBasicDetails = async () => {
    try {
      const response = await axios.get(`${Local.BASE_URL}${Local.GET_BASIC_DETAILS}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.status === 200) {
        const data = response.data.data;
        setInitialValues({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          ssn: data.ssn || "",
          phone_number: data.phone_number || "",
          address1: data.address1 || "",
          address2: data.address2 || "",
          city: data.city || "",
          state: data.state || "",
          zip: data.zip || "",

        })
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Cannot Update Your Details At The moment Please Try Again Later", {
        position: 'top-center',
        autoClose: 1000
      })
    }
  }

  const updateBasicDetails = async (data: any) => {
    try {
      const response = await axios.put(`${Local.BASE_URL}${Local.UPDATE_BASIC_DETAILS}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.status) {
        toast.success(response.data.message, {
          position: 'top-right',
          autoClose: 1000,
        })
      }
      setUserName(response.data.data.first_name);
    } catch (error: any) {
      console.error(error);
      toast.error("Cannot Update Your Details At The Momeny Please Try Again Later", {
        position: 'top-right',
        autoClose: 1000
      })
    }
  }
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      first_name: Yup.string().required("First Name Is Compulsory"),
      last_name: Yup.string().required("Last Name Is Compulsory"),
      email: Yup.string().email("Invalid email format").required("Email Is Compulsory"),
      ssn: Yup.string()
        .matches(/^\d+$/, "SSN must be numbers only")
        .min(5, "SSN must be at least 5 digits")
        .max(9, "SSN cannot be more than 9 digits")
        .required("Social Security Number Is Compulsory"),

      phone_number: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be in 10 digit")
        .required("Phone number Is Compulsory"),
      address1: Yup.string().required("Address One Is Compulsory"),
      address2: Yup.string().required("Address Two Is Compulsory"),
      city: Yup.string().required("City Is Compulsory"),
      state: Yup.string().required("State Is Compulsory"),
      zip: Yup.string()
        .matches(/^\d{6}$/, "Zip Code must be 6 digits")
        .required("Zip Code Is Compulsory"),
    }),
    onSubmit: (values) => {
      updateBasicDetails(values);
    },
  });

  return (
    <>
      <form id="basic-details-form" onSubmit={formik.handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first_name">First Name<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="First Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.first_name}
            />
            {formik.touched.first_name && formik.errors.first_name ? (
              <div className="error">{formik.errors.first_name}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Last Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.last_name}
            />
            {formik.touched.last_name && formik.errors.last_name ? (
              <div className="error">{formik.errors.last_name}</div>
            ) : null}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              disabled
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="ssn">Social Security Number<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              id="ssn"
              name="ssn"
              placeholder="SSN (Numbers Only)"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.ssn}
              maxLength={9}
            />
            {formik.touched.ssn && formik.errors.ssn ? (
              <div className="error">{formik.errors.ssn}</div>
            ) : null}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone_number">Phone Number<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              placeholder="Phone Number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone_number}
              maxLength={10}
            />
            {formik.touched.phone_number && formik.errors.phone_number ? (
              <div className="error">{formik.errors.phone_number}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="address1">Address One<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              id="address1"
              name="address1"
              placeholder="Address One"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address1}
            />
            {formik.touched.address1 && formik.errors.address1 ? (
              <div className="error">{formik.errors.address1}</div>
            ) : null}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="address2">Address Two<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              id="address2"
              name="address2"
              placeholder="Address Two"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address2}
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="City"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.city}
            />
            {formik.touched.city && formik.errors.city ? (
              <div className="error">{formik.errors.city}</div>
            ) : null}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="state">State<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              id="state"
              name="state"
              placeholder="State"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.state}
            />
            {formik.touched.state && formik.errors.state ? (
              <div className="error">{formik.errors.state}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="zip">Home Zip<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              id="zip"
              name="zip"
              placeholder="Zip Code"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.zip}
              maxLength={6}
            />
            {formik.touched.zip && formik.errors.zip ? (
              <div className="error">{formik.errors.zip}</div>
            ) : null}
          </div>
        </div>

        <div className="form-row button-row">
          <button type="submit" id="update-button" style={{ cursor: 'pointer' }}>
            Update
          </button>
        </div>
      </form>
    </>
  );
};

export default BasicDetails;

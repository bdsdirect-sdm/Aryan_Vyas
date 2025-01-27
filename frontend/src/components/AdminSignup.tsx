/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, ToastPosition } from "react-toastify";
import open_eye from "../../public/images/open_eye.png";
import close_eye from "../../public/images/Hide.png";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Local } from "../environment/env";
import "../css/Signup.css";

interface FormValues {
  adminFullName: string;
  adminEmail: string;
  adminPassword: string;
  confirmPassword: string;
}

const dataSchema = Yup.object({
  adminFullName: Yup.string()
    .min(2, "Minimum 2 characters!")
    .max(50, "Maximum 50 characters!")
    .required("Full Name Is Compulsory"),
  adminEmail: Yup.string().email("Invalid email!").required("E-mail Is Compulsory"),
  adminPassword: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long")
    .required("Password is required")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[`~!@#$%^&*()"?<>|:{}(),.]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("adminPassword")], "Password must be the same!")
    .required("Confirm Password Is Compulsory"),
});

const startingValue: FormValues = {
  adminFullName: "",
  adminEmail: "",
  adminPassword: "",
  confirmPassword: "",
};

function AdminSignup() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const postSignupData = async (data: FormValues) => {
    try {
      const signupData = {
        adminFullName: data.adminFullName,
        adminEmail: data.adminEmail,
        adminPassword: data.adminPassword,
      };

      let response = await axios.post(
        `${Local.BASE_URL}${Local.CREATE_ADMIN}`,
        signupData
      );
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate("/adminLogin");
      }, 1500);
    } catch (err: any) {
      console.log(err.response.data.message)
      toast.error("Error During Admin Signup Try Again later", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };
  const formik = useFormik<FormValues>({
    initialValues: startingValue,
    validationSchema: dataSchema,
    onSubmit: (values: FormValues) => {
      postSignupData(values);
    },
  });

  return (
    <div className="signup-page">
      <div className="left-part"></div>
      <div className="right-part">
        <h1 id="signup-header">Admin Sign Up</h1>
        <span id="rectangle-line"></span>
        <form id="signup-form" onSubmit={formik.handleSubmit} autoComplete="off">
          <div id="name">
            <div>
              <label htmlFor="adminFullName">Full Name<span style={{ color: "Red" }}>*</span></label>
              <br />
              <input
                id="adminFullName"
                name="adminFullName"
                type="text"
                placeholder="Full Name"
                autoComplete="off"
                value={formik.values.adminFullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{
                  borderRadius: "5px",
                  border: "1px solid rgba(62, 86, 119, 0.2)",
                  background: "#fff",
                  width: "464px",
                  height: "40px",
                  flexShrink: 0,
                  color: "#535c61",
                  fontSize: "16px",
                  letterSpacing: "0.5px",
                  paddingLeft: "10px",
                }}
              />
              {formik.errors.adminFullName && formik.touched.adminFullName ? (
                <p className="form-errors">{formik.errors.adminFullName}</p>
              ) : null}
            </div>
          </div>
          <div id="other-details">
            <label htmlFor="adminEmail">Email<span style={{ color: "Red" }}>*</span></label>
            <br />
            <input
              id="adminEmail"
              name="adminEmail"
              type="email"
              placeholder="Email"
              autoComplete="off"
              maxLength={50}
              value={formik.values.adminEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <br />
            {formik.errors.adminEmail && formik.touched.adminEmail ? (
              <p className="form-errors">{formik.errors.adminEmail}</p>
            ) : null}
            <label htmlFor="adminPassword">Password<span style={{ color: "Red" }}>*</span></label>
            <br />
            <div className="password-container1">
              <input
                id="adminPassword"
                className="userPassword"
                name="adminPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="off"
                value={formik.values.adminPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <img
                src={showPassword ? open_eye : close_eye}
                alt="Show Me/Hide Me"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-icon"
              />
            </div>
            {formik.errors.adminPassword && formik.touched.adminPassword ? (
              <p className="form-errors">{formik.errors.adminPassword}</p>
            ) : null}
            <label htmlFor="confirmPassword">Confirm Password<span style={{ color: "Red" }}>*</span></label>
            <br />
            <div className="password-container1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                autoComplete="off"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <img
                src={showConfirmPassword ? open_eye : close_eye}
                alt="Show Me/Hide Me"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="eye-icon"
              />
            </div>
            {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
              <p className="form-errors">{formik.errors.confirmPassword}</p>
            ) : null}
          </div>
          <div>
            <Link to="/Adminlogin" id="login-signup-link">
              Login
            </Link>
          </div>
          <button type="submit" id="login-signup-button">
            SIGN UP
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminSignup;

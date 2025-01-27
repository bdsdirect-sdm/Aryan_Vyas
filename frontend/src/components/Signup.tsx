/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useFormik} from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast} from "react-toastify";
import open_eye from "../../public/images/open_eye.png";
import close_eye from "../../public/images/Hide.png";
import "react-toastify/dist/ReactToastify.css";
import { Local } from "../environment/env";
import "../css/Signup.css"

interface FormValues {
  first_name: string;
  lastName: string;
  email: string;
  phoneNumber: string | number;
  password: string;
  confirm_password: string;
}

// Validation schema using Yup
const dataSchema = Yup.object({
  first_name: Yup.string()
    .min(2, "Minimum 2 characters!")
    .max(30, "Maximum 30 characters!")
    .required("First Name Is Compulsory"),
  lastName: Yup.string()
    .min(2, "Minimum 2 characters!")
    .max(30, "Maximum 30 characters!")
    .required("Last Name Is Compulsory"),
  email: Yup.string().email("Invalid email!").required("E-mail Is Compulsory"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Invalid Phone Number!")
    .required("Phone Number Is Compulsory"),
  password: Yup.string()
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
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password")], "Password must be the same!")
    .required("Confirm Password Is Compulsory"),
});

const startingValue: FormValues = {
  first_name: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirm_password: "",
};

function Signup() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const postSignupData = async (data: FormValues) => {
    try {
      const signupData = {
        first_name: data.first_name,
        last_name: data.lastName,
        email: data.email,
        phone_number: `${data.phoneNumber}`,
        password: data.password,
      };
      let response = await axios.post(
        `${Local.BASE_URL}${Local.CREATE_USER}`,
        signupData
      );
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err: any) {
      toast.error("Something Went Wrong During Signup", {
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
    <>
    <div className="signup-page">
      <div className="left-part"></div>
      <div className="right-part">
        <h1 id="signup-header">Sign Up</h1>
        <span id="rectangle-line"></span>
        <form id="signup-form" onSubmit={formik.handleSubmit} autoComplete="off">
          <div id="name">
            <div>
              <label htmlFor="first-name">First Name<span style={{color:"Red"}}>*</span></label>
              <br />
              <input
                id="first-name"
                name="first_name"
                type="text"
                placeholder="First Name"
                autoComplete="off"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.first_name && formik.touched.first_name ? (
                <p className="form-errors">{formik.errors.first_name}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="last-name">Last Name<span style={{color:"Red"}}>*</span></label>
              <br />
              <input
                id="last-name"
                name="lastName"
                type="text"
                placeholder="Last Name"
                autoComplete="off"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.lastName && formik.touched.lastName ? (
                <p className="form-errors">{formik.errors.lastName}</p>
              ) : null}
            </div>
          </div>
          <div id="other-details">
            <label htmlFor="email">Email<span style={{color:"Red"}}>*</span></label>
            <br />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="off"
              maxLength={50}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <br />
            {formik.errors.email && formik.touched.email ? (
              <p className="form-errors">{formik.errors.email}</p>
            ) : null}
            <label htmlFor="phone">Phone Number<span style={{color:"Red"}}>*</span></label>
            <br />
            <input
              id="number"
              name="phoneNumber"
              type="text"
              placeholder="Phone Number"
              autoComplete="off"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              maxLength={10}
            />
            <br />
            {formik.errors.phoneNumber && formik.touched.phoneNumber ? (
              <p className="form-errors">{formik.errors.phoneNumber}</p>
            ) : null}
            <label htmlFor="password">Password<span style={{color:"Red"}}>*</span></label>
            <br />

            <div className="password-container1">
              <input
                id="password"
                className="userPassword"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="off"
                value={formik.values.password}
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
            {formik.errors.password && formik.touched.password ? (
              <p className="form-errors">{formik.errors.password}</p>
            ) : null}

            <label htmlFor="confirm-password">Confirm Password<span style={{color:"Red"}}>*</span></label>
            <br />
            <div className="password-container1">
              <input
                id="confirm-password"
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                autoComplete="off"
                value={formik.values.confirm_password}
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
            {formik.errors.confirm_password &&
            formik.touched.confirm_password ? (
              <p className="form-errors">{formik.errors.confirm_password}</p>
            ) : null}
          </div>
          <div>
            <Link to="/" id="login-signup-link">
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
    {/* <div className="footer">
      <p>2023 DR. Palig.All rights reserved</p>
    </div> */}
    </>
  );
}

export default Signup;

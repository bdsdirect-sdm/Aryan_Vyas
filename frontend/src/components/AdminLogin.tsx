/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Local } from "../environment/env";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../css/Login.css'
import open_eye from '../../public/images/open_eye.png'
import close_eye from '../../public/images/Hide.png'

interface FormValues {
  adminEmail: string;
  adminPassword: string;
}

const dataSchema = Yup.object({
  adminEmail: Yup.string().email("Invalid email!").required("E-mail Is Compulsory"),
  adminPassword: Yup.string().required("Password Is Compulsory"),
});

const startingValue: FormValues = {
  adminEmail: "",
  adminPassword: "",
};

function AdminLogin() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const verifyData = async (data: FormValues) => {
    try {
      let response = await axios.post(`${Local.BASE_URL}${Local.LOGIN_ADMIN}`, data);

      if (response.data && response.data.admin) {
        let id = response.data.admin.id;
        let token = localStorage.setItem("adminToken", response.data.token);
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate(`/adminDashBoard`);
        }, 1500);
      } else {
        toast.error("Invalid Credentials", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (err: any) {
      console.log(err.response?.data?.error)
      toast.error("Something went wrong", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };
  const Formik = useFormik<FormValues>({
    initialValues: startingValue,
    validationSchema: dataSchema,
    onSubmit: (values: FormValues, actions: FormikHelpers<FormValues>) => {
      verifyData(values);
      actions.setSubmitting(false);
    },
  });

  return (
    <div className="signup-page" id="login-page">
      <div className="left-part"></div>
      <div className="right-part">
        <h1 id="signup-header">Admin Login</h1>
        <span id="rectangle-line"></span>
        <form id="signup-form" onSubmit={Formik.handleSubmit} autoComplete="off">
          <div id="login-details">
            <label htmlFor="adminEmail">Email<span style={{ color: "Red" }}>*</span></label>
            <br />
            <input
              id="adminEmail"
              name="adminEmail"
              type="email"
              placeholder="Email"
              autoComplete="off"
              maxLength={50}
              minLength={1}
              value={Formik.values.adminEmail}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
            />
            <br />
            {Formik.errors.adminEmail && Formik.touched.adminEmail ? (
              <p className="form-errors">{Formik.errors.adminEmail}</p>
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
                maxLength={30}
                minLength={1}
                value={Formik.values.adminPassword}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              <img
                src={showPassword ? open_eye : close_eye}
                alt="Show Me/Hide Me"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-icon"
              />
            </div>
            {Formik.errors.adminPassword && Formik.touched.adminPassword ? (
              <p className="form-errors">{Formik.errors.adminPassword}</p>
            ) : null}
          </div>
          <div>
            {/* <Link to="/AdminSignup" id="login-signup-link">
              SignUp
            </Link> */}
          </div>
          <button type="submit" id="login-signup-button">
            LOGIN
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminLogin;

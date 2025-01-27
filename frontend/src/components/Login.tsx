/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Local } from "../environment/env";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import open_eye from '../../public/images/open_eye.png';
import close_eye from '../../public/images/Hide.png';
import "../css/Login.css"

interface FormValues {
  email: string;
  password: string;
}

const dataSchema = Yup.object({
  email: Yup.string().email("Invalid email!").required("E-mail Is Compulsory"),
  password: Yup.string().required("Password Is Compulsory"),
});

const startingValue: FormValues = {
  email: "",
  password: "",
};

function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const verifyData = async (data: FormValues) => {
    try {
      const response = await axios.post(`${Local.BASE_URL}${Local.LOGIN_USER}`, data);
      console.log(response);
      
      if (response.data && response.data.user) {
        const id = response.data.user.id; 
        localStorage.setItem("token", response.data.token);
        
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
          navigate(`/user`);
      } else {
        toast.error("Invalid Credentials Or Your Accout Is Inactive Please Contact To The Admin", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (err: any) {
      toast.error("Invalid Credentials Or Your Accout Is Inactive Please Contact To The Admin", {
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
        <h1 id="signup-header">Login Your Account</h1>
        <span id="rectangle-line"></span>
        <form id="signup-form" onSubmit={Formik.handleSubmit} autoComplete="off">
          <div id="login-details">
            <label htmlFor="email">Email<span style={{color:"Red"}}>*</span></label>
            <br />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="off"
              maxLength={50}
              minLength={1}
              value={Formik.values.email}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
            />
            <br />
            {Formik.errors.email && Formik.touched.email ? (
              <p className="form-errors">{Formik.errors.email}</p>
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
                maxLength={30}
                minLength={1}
                value={Formik.values.password}
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
            {Formik.errors.password && Formik.touched.password ? (
              <p className="form-errors">{Formik.errors.password}</p>
            ) : null}
          </div>
          <div className="login-type">
            <Link to="signup" id="login-signup-link">
              SignUp
            </Link>
            <Link to="adminSignup" id="login-signup-link" className="login-type" style={{marginLeft:50}}>
             Admin Signup
            </Link>
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

export default Login;

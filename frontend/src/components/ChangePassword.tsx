/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import open_eye from "../../public/images/open_eye.png";
import close_eye from "../../public/images/Hide.png";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/ChangePassword.css";
import { Local } from "../environment/env";

const ChangePassword = (values?: any) => {
  const [showPassword, setshowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const validationSchema = Yup.object().shape({
    old_password: Yup.string().required("Old Password is Compulsory"),
    new_password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New Password is Compulsory"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("new_password")], "Passwords must match")
      .required("Confirm Password is Compulsory"),
  });

  const initialValues = {
    old_password: "",
    new_password: "",
    confirm_password: "",
  };

  const changePassword = async (data: any) => {
    try {
      const response = await axios.put(
        `${Local.BASE_URL}${Local.CHANGE_PASSWORD}`,
        {
          password: data.new_password,
          old_password: data.old_password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("response>>>>", response);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
    } catch (error: any) {
      toast.error(
        "Cannot Change Your Password At The Moment Please try Again later",
        {
          position: "top-right",
          autoClose: 1000,
        }
      );
    }
  };

  const handleSubmit = (values: any) => {
    console.log("Form values:", values);
    changePassword(values);
  };

  return (
    <>
      <div className="dashboard-wrapper">
        <div className="user-wrapper">
          <div id="change-password-header">
            <img
              src="../../public/images/left-arrow.png"
              style={{ cursor: "pointer" }}
              alt="Go Back"
              onClick={() => navigate(`/user`)}
            />
            <h2 style={{ marginLeft: 5 }}>Change Passwords</h2>
          </div>
        </div>
        <div id="change-password-container">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors }) => (
              <Form id="change-password-form">
                <div id="password-details">
                  <label htmlFor="password">
                    Old Password<span style={{ color: "Red" }}>*</span>
                  </label>
                  <br />
                  <div className="password-container">
                    <Field
                      type={showPassword ? "text" : "password"}
                      className="userPassword"
                      placeholder="******"
                      maxLength={30}
                      minLength={1}
                      name="old_password"
                    />
                    <img
                      src={showPassword ? open_eye : close_eye}
                      alt="Show Me/Hide Me"
                      width={20}
                      height={20}
                      onClick={() => setshowPassword(!showPassword)}
                      className="eye-icon"
                    />
                  </div>
                  <ErrorMessage
                    name="old_password"
                    component="div"
                    className="error-message"
                  />
                </div>
                <div id="password-details">
                  <label htmlFor="password">
                    New Password<span style={{ color: "Red" }}>*</span>
                  </label>
                  <br />
                  <div className="password-container">
                    <Field
                      type={showNewPassword ? "text" : "password"}
                      className="userPassword"
                      placeholder="******"
                      maxLength={30}
                      minLength={1}
                      name="new_password"
                    />
                    <img
                      src={showNewPassword ? open_eye : close_eye}
                      alt="Show Me/Hide Me"
                      width={20}
                      height={20}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="eye-icon"
                    />
                  </div>
                  <ErrorMessage
                    name="new_password"
                    component="div"
                    className="error-message"
                  />
                </div>
                <div id="password-details">
                  <label htmlFor="password">
                    Confirm Password<span style={{ color: "Red" }}>*</span>
                  </label>
                  <br />
                  <div className="password-container">
                    <Field
                      type={showConfirmPassword ? "text" : "password"}
                      className="userPassword"
                      placeholder="******"
                      maxLength={30}
                      minLength={1}
                      name="confirm_password"
                    />
                    <img
                      src={showConfirmPassword ? open_eye : close_eye}
                      alt="Show Me/Hide Me"
                      width={20}
                      height={20}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="eye-icon"
                    />
                  </div>
                  <ErrorMessage
                    name="confirm_password"
                    component="div"
                    className="error-message"
                  />
                </div>
                <div id="button-container" style={{ marginRight: -75 }}>
                  <button type="submit" id="update-button">
                    Update
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <img
            src="../../public/images/protection.png"
            alt="icon"
            id="locker-img"
          />
        </div>
      </div>
    </>
  );
};

export default ChangePassword;

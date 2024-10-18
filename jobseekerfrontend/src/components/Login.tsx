import React from 'react';
import './Login.css';
import { Link, useNavigate, useParams } from 'react-router-dom'; 
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const Login: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const schema = Yup.object().shape({
    email: Yup.string()
      .required("Email is a required field"),
    password: Yup.string()
      .required("Password is a required field")
      .min(8, "Password must be at least 8 characters"),
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await axios.post('http://localhost:4001/api/login', values);
      const token = response.data.token; 
      localStorage.setItem('token', token); 
      console.log(response.data.user);
      alert("Login Successfully Done");
      navigate(`/dashboard`);
    } catch (error) {
      console.error("Error Fetching Error", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="login">
      <Formik
        validationSchema={schema}
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => {
          return (
            <div className="form-container">
              <h2>Login</h2>
              <form noValidate onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Your Email"
                  className="form-control inp_text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                <p className="error">{errors.email && touched.email && errors.email}</p>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter Your Password"
                  className="form-control"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                <p className="error">{errors.password && touched.password && errors.password}</p>

                <button type="submit" className="form-button">
                  Submit
                </button>
              </form>
              <center>
                <Link to="/">
                  <button className="register-button">
                    Click here to Register
                  </button>
                </Link>
              </center>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default Login;

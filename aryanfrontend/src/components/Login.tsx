import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form, Field } from 'formik';
import { axiosPath } from '../service';
import * as Yup from 'yup';
import axios from 'axios';
import { useEffect } from 'react';
import "../css/Login.css"

interface FormData {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Please Enter Your Email'),
  password: Yup.string().required('Please Enter Your Password'),
});

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(`/profile`);
    }
  }, [navigate]);

  const handleSubmit = async (values: FormData) => {
    try {
      const response = await axios.post(`${axiosPath}login`, values);
      localStorage.setItem('token', response.data.token);
      navigate('/profile');
      alert('Login successful!');
    } catch (error) {
      console.error(error);
      toast.error('Login Failed Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <ToastContainer />
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter Your Email"
                />
                {errors.email && touched.email && (
                  <div className="error">{errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter Your Password"
                />
                {errors.password && touched.password && (
                  <div className="error">{errors.password}</div>
                )}
              </div>

              <button type="submit">
                Login
              </button>
            </Form>
          )}
        </Formik>

        <div className="signup-link">
        <Link to="/">
                <button className="text-center">
                Don't Have Account Sign up First
                </button>
                </Link>
        </div>
      </div>
    </div>
  );
}

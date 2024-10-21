import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form, Field } from 'formik';
import { baseURL } from '../../environments/environment';
import * as Yup from 'yup';
import axios from 'axios';
import { useEffect } from 'react';
// import { useEffect } from 'react';

interface FormData {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Please enter your email'),
  password: Yup.string().required('Please enter your password'),
});

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(`/profile`);
    }
  },[navigate])

  const handleSubmit = async (values: FormData) => {
    
    try {
      const response = await axios.post(`${baseURL}login`, values);
      localStorage.setItem('token', response.data.token);
      // navigate(`/profile/${response.data.userId}`);
      navigate('/profile');
      alert('Login successful!');
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="text-center">Login</h2>
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
                  className="form-control"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                />
                {errors.email && touched.email && (
                  <div className="text-danger">{errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  className="form-control"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                />
                {errors.password && touched.password && (
                  <div className="text-danger">{errors.password}</div>
                )}
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-3">
          <p>
            Don't have an account? <Link to="/">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

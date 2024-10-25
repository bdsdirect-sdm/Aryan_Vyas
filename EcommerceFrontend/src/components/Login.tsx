import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Css/Login.css';
import { Link } from 'react-router-dom';

interface LoginResponse {
  token: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage('');
      try {
        const response = await axios.post<LoginResponse>('http://localhost:3000/api/retailers/login', values);
        localStorage.setItem('token', response.data.token);
        alert('Login successful');
        navigate('/products');
      } catch (error) {
        console.error(error);
        setErrorMessage('Invalid email or password');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h1>Login</h1>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter Your Email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter Your Password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.errors.password ? <div className="error">{formik.errors.password}</div> : null}
      </div>

      {errorMessage && <div className="error">{errorMessage}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <Link to={"/registration-page"}><button className='hello'>Don't Have Account</button></Link>
    </form>
  );
};

export default Login;

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../api';
import { useNavigate } from 'react-router-dom';
import "./login.css"
const Login = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [userType, setUserType] = useState('Job Seeker');

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
            try {
                const response = await loginUser(values);
                localStorage.setItem('token', response.data.token);
                
               
                const type = response.data.userType;
                if (type === 'Job Seeker') {
                    navigate('/job-seekers');
                } else if (type === 'Agency') {
                    navigate('/profile');
                }
            } catch (error) {
                setMessage(`Login failed. Please check your credentials. ${error}`);
            }
        },
    });

    return (
        <div>
            <h2>{userType} Login</h2>
            <button onClick={() => setUserType('Job Seeker')}>Job Seeker</button>
            <button onClick={() => setUserType('Agency')}>Agency</button>

            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" {...formik.getFieldProps('email')} />
                    {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" {...formik.getFieldProps('password')} />
                    {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}
                </div>
                <button type="submit">Login</button>
                {message && <div>{message}</div>}
            </form>
        </div>
    );
};

export default Login;

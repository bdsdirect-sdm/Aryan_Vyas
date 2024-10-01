import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { signup } from '../../api';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // Import the CSS file

const Signup: React.FC = () => {
    const navigate = useNavigate();

    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    };

    const validationSchema = Yup.object({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(16, 'Password cannot exceed 16 characters')
        // .minLowercase(1, 'Password must contain at least 1 lowercase letter')
        // .minUppercase(1, 'Password must contain at least 1 uppercase letter')
        // .minNumbers(1, 'Password must contain at least 1 number')
        // .minSymbols(1, 'Password must contain at least 1 special character')
        .required("Password is required"),
    });

    const handleSubmit = async (values: any) => {
        try {
            await signup(values);
            navigate('/login');
            console.log(values, ">>>>>>>>>>>");
        } catch (error) {
            alert(`Email already exists! ${error}`);
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                <Form>
                    <div>
                        <label>First Name</label>
                        <Field name="firstName" />
                        <ErrorMessage name="firstName" component="div" className="error" />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <Field name="lastName" />
                        <ErrorMessage name="lastName" component="div" className="error" />
                    </div>
                    <div>
                        <label>Email</label>
                        <Field name="email" type="email" />
                        <ErrorMessage name="email" component="div" className="error" />
                    </div>
                    <div>
                        <label>Password</label>
                        <Field name="password" type="password" />
                        <ErrorMessage name="password" component="div" className="error" />
                    </div>
                    <button type="submit">Sign Up</button>
                </Form>
            </Formik>
        </div>
    );
};

export default Signup;

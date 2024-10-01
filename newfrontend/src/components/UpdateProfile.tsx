import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { updateProfile, getProfile } from '../../api';
import { useNavigate } from 'react-router-dom';
import './UpdateProfile.css';


const UpdateProfile: React.FC = () => {
    const [initialValues, setInitialValues] = useState<any>(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await getProfile(token as any);
            setInitialValues(response.data);
        };

        fetchProfile();
    }, [token]);

    const validationSchema = Yup.object({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
    });

    const handleSubmit = async (values: any) => {
        await updateProfile(values, token as any);
        navigate('/Profile');
    };

    if (!initialValues) return <div>Loading...</div>;

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            <Form>
                <div>
                    <label>First Name</label>
                    <Field name="firstName" />
                    <ErrorMessage name="firstName" component="div" />
                </div>
                <div>
                    <label>Last Name</label>
                    <Field name="lastName" />
                    <ErrorMessage name="lastName" component="div" />
                </div>
                <div>
                    <label>Email</label>
                    <Field name="email" type="email" />
                    <ErrorMessage name="email" component="div" />
                </div>
                <button type="submit">Update Profile</button>
            </Form>
        </Formik>
    );
};

export default UpdateProfile;

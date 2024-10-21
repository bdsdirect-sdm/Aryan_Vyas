/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { baseURL } from '../../environments/environment';


interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    contact: string; 
    gender: string;
    role: string;
    hobbies: string[];
    img?: File;
    resume?: File;
    agencyId?: string; 
}

const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
        .matches(/^[A-Za-z]+$/, 'First name must contain only letters')
        .max(20, 'First name must be at most 20 characters')
        .required('First name is required'),
    lastName: Yup.string()
        .matches(/^[A-Za-z]+$/, 'Last name must contain only letters')
        .max(20, 'Last name must be at most 20 characters')
        .required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    contact: Yup.string()
        .matches(/^[0-9]+$/, 'Contact number must be numeric')
        .length(10, 'Contact number must be exactly 10 digits')
        .required('Contact number is required'),
    gender: Yup.string().required('Gender is required'),
    role: Yup.string().required('User type is required'),
    hobbies: Yup.array().of(Yup.string()).min(1, 'At least one hobby is required'),
    img: Yup.mixed()
        .required('An image file is required')
        .test('fileFormat', 'Unsupported Format, only JPG and PNG allowed', (value) => {
            return value && (value instanceof File) && (value.type === 'image/jpeg' || value.type === 'image/png');
        }),
resume: Yup.mixed().when(['role'],(role:any,schema)=>{
    if(role=='1') return Yup.mixed().required('Resume is required')
        .test('fileFormat', 'Unsupported Format, only PDF and .doc allowed', (value) => {
            return value && (value instanceof File) && 
            ( value.type === 'application/pdf' ||
                value.type === 'application/msword' ||
                value.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        })
        return schema;
}),
agencyId: Yup.string().when(['role'],(role:any,schema)=>{
    if(role=='1') return Yup.string().required('Please select an agency')
        return schema;
})
    
});

export default function SignUp() {
    const navigate = useNavigate();
    const [agencies, setAgencies] = useState<{ id: string; firstName: string }[]>([]);

    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const response = await axios.get(`${baseURL}agencies`);
                setAgencies(response.data);
            } catch (error) {
                console.error('Error fetching agencies:', error);
            }
        };

        fetchAgencies();
    }, []);

    const handleSubmit = async (values: FormData) => {
        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined) {
                    if (key === 'img') {
                        formData.append('profileImg', value); 
                    } else if (key === 'resume') {
                        formData.append('resume', value);
                    } else {
                        formData.append(key, value);
                    }
                }
            });

           await axios.post(`${baseURL}signup`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Registration successful!');
            console.log(formData)
            navigate('/login');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMessage);
            console.log(error);
        }
    };

    return (
        <div className="signup-container ">
            <div className="signup-form">
            <h2 className='d-flex justify-content-center '>Signup</h2>
            <ToastContainer />
            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    contact: '',
                    gender: '',
                    role: '',
                    hobbies: [],
                    img: undefined,
                    resume: undefined,
                    agencyId: '',
                }}
                validationSchema={SignupSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        <div className ="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="firstName">First Name</label>
                            <Field maxlength="20" type="text" className="form-control" placeholder="Enter First Name" name="firstName" id="firstName" />
                            <ErrorMessage name="firstName" component="div" className="text-danger" />
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="lastName">Last Name</label>
                            <Field maxlength="20" type="text" className="form-control"  placeholder="Enter Last Name" name="lastName" id="lastName" />
                            <ErrorMessage name="lastName" component="div" className="text-danger" />
                        </div>
                        </div>

                        <div className ="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="email">Email</label>
                            <Field type="email" maxlength="40" className="form-control"  placeholder="Enter Email" name="email" id="email" />
                            <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="contact">Contact</label>
                            <Field maxlength="10" type="text" className="form-control" placeholder="Enter Contact Number" name="contact" id="contact" />
                            <ErrorMessage name="contact" component="div" className="text-danger" />
                        </div>

                        </div>

                        <div className ="form-row">

                        <div className="form-group col-md-6">
                            <label htmlFor="role">User Type</label>
                            <Field as="select" name="role" className="form-control" onChange={(e: any) => {
                                const { value } = e.target;
                                setFieldValue('role', value);
                                if (value !== '1') {
                                    setFieldValue('agencyId', ''); 
                                }
                            }}>
                                <option value="">Select User Type</option>
                                <option value="1">Job Seeker</option>
                                <option value="2">Agency</option>
                            </Field>
                            <ErrorMessage name="role" component="div" className="text-danger" />
                        </div>
                        <div className="form-group col-md-2">
                            <label>Gender</label>
                            <div>
                                <Field type="radio" name="gender" value="Male" /> Male
                                <Field className="ml-1" type="radio" name="gender" value="Female" /> Female
                                <ErrorMessage name="gender" component="div" className="text-danger" />
                            </div>
                        </div>
                        <div className="form-group col-md-4">
                            <label>Hobbies</label>
                            <div className='d-flex'>
                                {['Sports', 'Dance', 'Reading', 'Singing'].map((hobby) => (
                                    <div className="mr-2" key={hobby}>
                                        <Field className="mr-1" type="checkbox" name="hobbies" value={hobby} />
                                        {hobby}
                                    </div>
                                ))}
                            </div>
                            <ErrorMessage name="hobbies" component="div" className="text-danger" />
                        </div>
                    </div>
                        <div className="form-group">
                            <label htmlFor="img">Profile Image (JPG, PNG)</label>
                            <input
                                className="form-control"
                                type="file"
                                id="img"
                                name="img"
                                onChange={(event) => {
                                    const file = event.currentTarget.files![0];
                                    setFieldValue('img', file);
                                }}
                            />
                            <ErrorMessage name="img" component="div" className="text-danger" />
                        </div>

                        {values.role === '1' && (
                            <><div className="form-group">
                                <label htmlFor="resume">Upload Resume (DOCX, PDF)</label>
                                <input
                                    className="form-control"
                                    type="file"
                                    id="resume"
                                    // accept=".doc,.pdf,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    name="resume"

                                    onChange={(event) => {
                                        const file = event.currentTarget.files![0];
                                        setFieldValue('resume', file);
                                    } } />
                                <ErrorMessage name="resume" component="div" className="text-danger" />
                            </div>
                            
                            <div className="form-group">
                                    <label htmlFor="agencyId">Select Agency</label>
                                    <Field as="select" name="agencyId" className="form-control">
                                        <option value="">Select Agency</option>
                                        {agencies.map((agency) => (
                                            <option key={agency.id} value={agency.id}>
                                                {agency.firstName}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="agencyId" component="div" className="text-danger" />
                                </div></>
                        )}

                        {/* {values.role === '1' && (
                            <div className="form-group">
                                <label htmlFor="agencyId">Select Agency</label>
                                <Field as="select" name="agencyId" className="form-control">
                                    <option value="">Select Agency</option>
                                    {agencies.map((agency) => (
                                        <option key={agency.id} value={agency.id}>
                                            {agency.firstName}
                                        </option>
                                    ))}
                                </Field>
                            </div>
                        )} */}

                        <button type="submit" className="btn btn-primary signupbtn">Signup</button>
                    </Form>
                )}
            </Formik>
            <p className="text-center mt-3">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
        </div>
    );
}   

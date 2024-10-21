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
  resume: Yup.mixed().when(['role'], (role: any, schema) => {
    if (role === '1')
      return Yup.mixed()
        .required('Resume is required')
        .test('fileFormat', 'Unsupported Format, only PDF and DOC allowed', (value) => {
          return (
            value &&
            (value instanceof File) &&
            (value.type === 'application/pdf' ||
              value.type === 'application/msword' ||
              value.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
          );
        });
    return schema;
  }),
  agencyId: Yup.string().when(['role'], (role: any, schema) => {
    if (role === '1') return Yup.string().required('Please select an agency');
    return schema;
  }),
});

export default function LoginReg() {
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
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2 className="text-center">Sign Up</h2>
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
                <div className="form-row">
              <div className="">
                <label htmlFor="firstName">First Name</label>
                <Field type="text" className="form-control" name="firstName" id="firstName" />
                <ErrorMessage name="firstName" component="div" className="text-danger" />
              </div>

              <div className="">
                <label htmlFor="lastName">Last Name</label>
                <Field type="text" className="form-control" name="lastName" id="lastName" />
                <ErrorMessage name="lastName" component="div" className="text-danger" />
              </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field type="email" className="form-control" name="email" id="email" />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>

              <div className="form-group">
                <label htmlFor="contact">Contact</label>
                <Field type="text" className="form-control" name="contact" id="contact" />
                <ErrorMessage name="contact" component="div" className="text-danger" />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <div>
                  <Field type="radio" name="gender" value="Male" /> Male
                  <Field type="radio" name="gender" value="Female" /> Female
                  <ErrorMessage name="gender" component="div" className="text-danger" />
                </div>
              </div>

              <div className="form-group">
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

              <div className="form-group">
                <label>Hobbies</label>
                <div>
                  {['Sports', 'Dance', 'Reading', 'Singing'].map((hobby) => (
                    <div key={hobby}>
                      <Field type="checkbox" name="hobbies" value={hobby} />
                      {hobby}
                    </div>
                  ))}
                </div>
                <ErrorMessage name="hobbies" component="div" className="text-danger" />
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
                <>
                  <div className="form-group">
                    <label htmlFor="resume">Upload Resume (DOCX, PDF)</label>
                    <input
                      className="form-control"
                      type="file"
                      id="resume"
                      name="resume"
                      onChange={(event) => {
                        const file = event.currentTarget.files![0];
                        setFieldValue('resume', file);
                      }}
                    />
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
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-primary btn-block">Signup</button>
            </Form>
          )}
        </Formik>
        <div className="text-center mt-3">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

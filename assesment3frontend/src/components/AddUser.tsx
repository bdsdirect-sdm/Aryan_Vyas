import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addUser } from '../services/userServices';
import './AddUser.css';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    profilePhoto: null,
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyZip: '',
    homeAddress: '',
    homeCity: '',
    homeState: '',
    homeZip: '',
    appointmentLetter: null,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    profilePhoto: Yup.mixed().required('Required'),
    companyAddress: Yup.string().required('Required'),
    companyCity: Yup.string().required('Required'),
    companyState: Yup.string().required('Required'),
    companyZip: Yup.string().length(6, 'Must be exactly 6 numbers').required('Required'),
    homeAddress: Yup.string().required('Required'),
    homeCity: Yup.string().required('Required'),
    homeState: Yup.string().required('Required'),
    homeZip: Yup.string().length(6, 'Must be exactly 6 numbers').required('Required'),
    appointmentLetter: Yup.mixed().required('Required'),
  });
  const navigate = useNavigate();

  const onSubmit = async (values: any) => {
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }

    const response = await addUser(formData);
    if(response) {
      navigate("/view-users")
    }
  };

  const handleCancel = (resetForm: () => void) => {
    resetForm();
    alert('Form has been reset.');
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ setFieldValue, resetForm }) => (
        <Form>
          <h1>Add Your Data</h1>
          <Field name="firstName" placeholder="First Name" />
          <ErrorMessage name="firstName" component="div" />
          
          <Field name="lastName" placeholder="Last Name" />
          <ErrorMessage name="lastName" component="div" />

          <Field name="email" type="email" placeholder="Email" />
          <ErrorMessage name="email" component="div" />

          <input type="file" name="profilePhoto" accept="image/png, image/jpeg" onChange={(event: any) => {
            setFieldValue("profilePhoto", event.currentTarget.files[0]);
          }} />
          <ErrorMessage name="profilePhoto" component="div" />

          <Field name="companyAddress" placeholder="Company Address" />
          <ErrorMessage name="companyAddress" component="div" />

          <Field name="companyCity" placeholder="Company City" />
          <ErrorMessage name="companyCity" component="div" />

          <Field name="companyState" placeholder="Company State" />
          <ErrorMessage name="companyState" component="div" />

          <Field name="companyZip" placeholder="Company Zip" />
          <ErrorMessage name="companyZip" component="div" />

          <Field name="homeAddress" placeholder="Home Address" />
          <ErrorMessage name="homeAddress" component="div" />

          <Field name="homeCity" placeholder="Home City" />
          <ErrorMessage name="homeCity" component="div" />

          <Field name="homeState" placeholder="Home State" />
          <ErrorMessage name="homeState" component="div" />

          <Field name="homeZip" placeholder="Home Zip" />
          <ErrorMessage name="homeZip" component="div" />

          <input type="file" name="appointmentLetter" accept="application/pdf" onChange={(event: any) => {
            setFieldValue("appointmentLetter", event.currentTarget.files[0]);
          }} />
          <ErrorMessage name="appointmentLetter" component="div" />

          <button type="submit" className='btnadd'>Submit</button>
          <button type="button" className='btnadd' onClick={() => handleCancel(resetForm)}>Cancel</button>
        </Form>
      )}
    </Formik>
  );
};

export default AddUser;

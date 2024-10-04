import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUser } from '../services/userServices';
import './EditUser.css';


const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
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
  });

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    profilePhoto: Yup.mixed().required('Required'),
    companyAddress: Yup.string().required('Required'),
    companyCity: Yup.string().required('Required'),
    companyState: Yup.string().required('Required'),
    companyZip: Yup.string().length(6, 'Must be exactly 6 characters').required('Required'),
    homeAddress: Yup.string().required('Required'),
    homeCity: Yup.string().required('Required'),
    homeState: Yup.string().required('Required'),
    homeZip: Yup.string().length(6, 'Must be exactly 6 characters').required('Required'),
    appointmentLetter: Yup.mixed().required('Required'),
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userData:any = await getUserById(Number(id));
      if (userData) {
        console.log(userData);
        
        const temp: any = {}
        temp.firstName = userData.firstName;
        temp.lastName = userData.lastName;
        temp.email = userData.email;
        temp.companyAddress = userData.addresses?.companyAddress;
        temp.companyCity = userData.addresses?.companyCity;
        temp.companyState = userData.addresses?.companyState;
        temp.companyZip = userData.addresses?.companyZip;
        temp.homeAddress = userData.addresses?.homeAddress;
        temp.homeCity = userData.addresses?.homeCity;
        temp.homeState = userData.addresses?.homeState;
        temp.homeZip = userData.addresses?.homeZip;
        setInitialValues(temp)
      }
    };

    fetchUser();
  }, [id]);

  const onSubmit = async (values: any) => {
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }

    await updateUser(Number(id), formData);
    navigate('/view-users');
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
      {({ setFieldValue }) => (
        <Form>
          <h1>Edit Your Data</h1>
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

          <button type="submit" className='btnadd2'>Update</button>
          <button type="button" className='btnadd2' onClick={() => navigate('/view-users')}>Cancel</button>
        </Form>
      )}
    </Formik>
  );
};

export default EditUser;
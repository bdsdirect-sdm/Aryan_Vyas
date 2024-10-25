import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      companyName: '',
      email: '',
      phone: '',
      address: '',
      companyLogo: null as File | null,
      profileImage: null as File | null,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      companyName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      phone: Yup.string().required('Required'),
      address: Yup.string().required('Required'),
      companyLogo: Yup.mixed().required('Required'),
      profileImage: Yup.mixed().required('Required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('companyName', values.companyName);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('address', values.address);

      if (values.companyLogo) {
        formData.append('companyLogo', values.companyLogo);
      }

      if (values.profileImage) {
        formData.append('profileImage', values.profileImage);
      }

      setLoading(true);
      try {
        await axios.post('http://localhost:3000/api/retailers/register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Retailer registered successfully');
        formik.resetForm();
      } catch (error) {
        console.error(error);
        alert('Error registering retailer please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label>First Name</label>
        <input type="text" name="firstName" onChange={formik.handleChange} value={formik.values.firstName} />
        {formik.errors.firstName ? <div>{formik.errors.firstName}</div> : null}
      </div>

      <div>
        <label>Last Name</label>
        <input type="text" name="lastName" onChange={formik.handleChange} value={formik.values.lastName} />
        {formik.errors.lastName ? <div>{formik.errors.lastName}</div> : null}
      </div>

      <div>
        <label>Company Name</label>
        <input type="text" name="companyName" onChange={formik.handleChange} value={formik.values.companyName} />
        {formik.errors.companyName ? <div>{formik.errors.companyName}</div> : null}
      </div>

      <div>
        <label>Email</label>
        <input type="email" name="email" onChange={formik.handleChange} value={formik.values.email} />
        {formik.errors.email ? <div>{formik.errors.email}</div> : null}
      </div>

      <div>
        <label>Phone</label>
        <input type="text" name="phone" onChange={formik.handleChange} value={formik.values.phone} />
        {formik.errors.phone ? <div>{formik.errors.phone}</div> : null}
      </div>

      <div>
        <label>Address</label>
        <input type="text" name="address" onChange={formik.handleChange} value={formik.values.address} />
        {formik.errors.address ? <div>{formik.errors.address}</div> : null}
      </div>

      <div>
        <label>Company Logo</label>
        <input type="file" name="companyLogo" onChange={(event) => formik.setFieldValue('companyLogo', event.currentTarget.files?.[0])} />
        {formik.errors.companyLogo ? <div>{formik.errors.companyLogo}</div> : null}
      </div>

      <div>
        <label>Profile Image</label>
        <input type="file" name="profileImage" onChange={(event) => formik.setFieldValue('profileImage', event.currentTarget.files?.[0])} />
        {formik.errors.profileImage ? <div>{formik.errors.profileImage}</div> : null}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default Register;

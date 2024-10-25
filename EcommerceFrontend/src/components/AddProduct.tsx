import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/Addproduct.css';

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const formik = useFormik({
    initialValues: {
      name: '',
      category: '',
      image: null,
      quantity: 0,
      price: 0,
      status: 'Draft',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      category: Yup.string().required('Required'),
      quantity: Yup.number().required('Required').integer('Must be an integer').positive('Must be positive'),
      price: Yup.number().required('Required').positive('Must be positive'),
      status: Yup.string().required('Required'),
      image: Yup.mixed()
        .required('Required')
        .test('fileSize', 'File too large', (value) => {
          return value && (value as File).size <= 2000000;
        })
        .test('fileType', 'Unsupported File Format', (value) => {
          return value && ['image/jpeg', 'image/png'].includes((value as File).type);
        }),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('category', values.category);
      formData.append('quantity', values.quantity.toString());
      formData.append('price', values.price.toString());
      formData.append('status', values.status);
      if (values.image) {
        formData.append('image', values.image);
      }

      setLoading(true);
      try {
        await axios.post('http://localhost:3000/api/products/add', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        alert('Product added successfully');
        formik.resetForm();
        navigate('/products'); // Navigate to product list after successful addition
      } catch (error) {
        console.error(error);
        alert('Error adding product, please try again');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="container">
      <h2>Add Product</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" name="name" onChange={formik.handleChange} value={formik.values.name} />
          {formik.errors.name ? <div className="error">{formik.errors.name}</div> : null}
        </div>

        <div>
          <label>Category</label>
          <input type="text" name="category" onChange={formik.handleChange} value={formik.values.category} />
          {formik.errors.category ? <div className="error">{formik.errors.category}</div> : null}
        </div>

        <div>
          <label>Image</label>
          <input
            type="file"
            name="image"
            accept="image/png, image/jpeg"
            onChange={(event) => {
              if (event.currentTarget.files) {
                formik.setFieldValue('image', event.currentTarget.files[0]);
              }
            }}
          />
          {formik.errors.image ? <div className="error">{formik.errors.image}</div> : null}
        </div>

        <div>
          <label>Quantity</label>
          <input type="number" name="quantity" onChange={formik.handleChange} value={formik.values.quantity} />
          {formik.errors.quantity ? <div className="error">{formik.errors.quantity}</div> : null}
        </div>

        <div>
          <label>Price</label>
          <input type="number" name="price" onChange={formik.handleChange} value={formik.values.price} />
          {formik.errors.price ? <div className="error">{formik.errors.price}</div> : null}
        </div>

        <div>
          <label>Status</label>
          <select name="status" onChange={formik.handleChange} value={formik.values.status}>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
          {formik.errors.status ? <div className="error">{formik.errors.status}</div> : null}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>

      <button onClick={() => navigate('/products')}>
        Go to Product List
      </button>
    </div>
  );
};

export default AddProduct;

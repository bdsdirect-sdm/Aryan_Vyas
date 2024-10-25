import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: product?.name || '',
      category: product?.category || '',
      quantity: product?.quantity || 0,
      price: product?.price || 0,
      status: product?.status || 'Draft',
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      category: Yup.string().required('Required'),
      quantity: Yup.number().required('Required').integer(),
      price: Yup.number().required('Required').positive(),
      status: Yup.string().required('Required'),
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

      try {
        await axios.put(`http://localhost:3000/api/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        alert('Product updated successfully');
        navigate('/products');
      } catch (error) {
        console.error(error);
        alert('Error updating product');
      }
    },
  });

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={formik.handleChange}
        value={formik.values.name}
      />
      {formik.errors.name && typeof formik.errors.name === 'string' ? (
        <div>{formik.errors.name}</div>
      ) : null}

      <input
        type="text"
        name="category"
        placeholder="Category"
        onChange={formik.handleChange}
        value={formik.values.category}
      />
      {formik.errors.category && typeof formik.errors.category === 'string' ? (
        <div>{formik.errors.category}</div>
      ) : null}

      <input
        type="file"
        name="image"
        onChange={(event) => formik.setFieldValue('image', event.target.files?.[0])}
      />

      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        onChange={formik.handleChange}
        value={formik.values.quantity}
      />
      {formik.errors.quantity && typeof formik.errors.quantity === 'string' ? (
        <div>{formik.errors.quantity}</div>
      ) : null}

      <input
        type="number"
        name="price"
        placeholder="Price"
        onChange={formik.handleChange}
        value={formik.values.price}
      />
      {formik.errors.price && typeof formik.errors.price === 'string' ? (
        <div>{formik.errors.price}</div>
      ) : null}

      <select name="status" onChange={formik.handleChange} value={formik.values.status}>
        <option value="Draft">Draft</option>
        <option value="Published">Published</option>
      </select>
      {formik.errors.status && typeof formik.errors.status === 'string' ? (
        <div>{formik.errors.status}</div>
      ) : null}

      <button type="submit">Update Product</button>
    </form>
  );
};

export default EditProduct;

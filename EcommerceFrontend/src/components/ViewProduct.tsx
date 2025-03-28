import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Css/ViewProduct.css';

interface Product {
  name: string;
  category: string;
  quantity: number;
  price: number;
  status: string;
  image: string;
}

const ViewProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      console.log("Fetching product with ID:", id);

      try {
        const response = await axios.get<Product>(`http://localhost:3000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error)
        setError('Failed to fetch product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="view-product">
      <h1>{product?.name}</h1>
      <p>Category: {product?.category}</p>
      <p>Quantity: {product?.quantity}</p>
      <p>Price: ${product?.price.toFixed(2)}</p>
      <p>Status: {product?.status}</p>
      {product?.image && (
        <img 
          src={`http://localhost:3000/uploads/${product.image}`} 
          alt={product.name} 
          className="product-image" 
        />
      )}
    </div>
  );
};

export default ViewProduct;

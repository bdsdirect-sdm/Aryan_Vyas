import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Css/ProductList.css'

interface Product {
  id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
  status: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchProducts = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.get('http://localhost:3000/api/products', {
        params: { search, page },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = response.data as { data: Product[]; total: number };
      setProducts(data.data);
      setTotalPages(Math.ceil(data.total / 5));
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:3000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      {errorMessage && <div className="error">{errorMessage}</div>}
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by product name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/products/add">
          <button>Add Product</button>
        </Link>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            {/* <th>Image</th> */}
            <th>Quantity</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              {/* <td>
                <img src={product.image} alt={product.name} />
              </td> */}
              <td>{product.quantity}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.status}</td>
              <td className="actions">
                <Link to={`/products/${product.id}`}><button>View</button></Link>
                <Link to={`/products/edit/${product.id}`}><button>Edit</button></Link>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => {setPage(i + 1)}}
            disabled={page === i + 1}
          >
            {i + 1}
          </button>
        ))}
        
      </div>
      <Link to={"/login"}><button>logOut</button></Link>
    </div>
    
  );
};

export default ProductList;

import { Link } from 'react-router-dom';

const FrontPage = () => {
  return (
    <div>
      <h1>Welcome to Our Service</h1>
      <div>
        <Link to="/registration-page">
          <button>Retailer Registration</button>
        </Link>
        <Link to="*">
          <button>Customer</button>
        </Link>
      </div>
    </div>
  );
};

export default FrontPage;

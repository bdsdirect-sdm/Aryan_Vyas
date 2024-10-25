import { Link } from 'react-router-dom';
import "./Css/Frontpage.css"

const FrontPage = () => {
  return (
    <div className="container">
      <h1>Welcome to Our Service</h1>
      <div className="button-container">
        <Link to="/registration-page">
          <button className="button">Retailer Registration</button>
        </Link>
        <Link to="*">
          <button className="button">Customer</button>
        </Link>
      </div>
    </div>
  );
};

export default FrontPage;

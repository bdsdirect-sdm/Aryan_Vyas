import "./Css/NotFound.css";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleFrontpage = () => {
    navigate("/");
  };

  return (
    <div className="not-found">
      <h1>404 - Not Found</h1>
      <p>We Are Coming Soon</p>
      <p>We're sorry, but the page you are looking for is not available.</p>
      <button onClick={handleFrontpage}>Go Back</button>
    </div>
  );
};

export default NotFound;

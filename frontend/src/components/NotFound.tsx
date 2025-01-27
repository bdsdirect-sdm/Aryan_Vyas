// import React, { useEffect } from "react";
// import "../css/NotFound.css";
// import { useNavigate } from "react-router-dom";

// const NotFound: React.FC = () => {
//     const token = localStorage.getItem("Token");
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (token) {
//             navigate("/dashboard");
//         } else {
//             navigate("/");
//         }
//     }, [token, navigate]);

//     return (
//         <div id="not-found">
//             <h1 className="text-center">Oops! Page Not Found</h1>
//             <div className="wrong-route-buttons">
//                 {token ? (
//                     <div className="logged-in-section">
//                         <p>You are already logged in</p>
//                         <button onClick={() => navigate("/dashboard")}>
//                             Go To Dashboard
//                         </button>
//                     </div>
//                 ) : (
//                     <div className="logged-out-section">
//                         <p>No active session found</p>
//                         <button onClick={() => navigate("/")}>
//                             Go To Login
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default NotFound;


import React from "react";
import "../css/NotFound.css";

const NotFound: React.FC = () => {
    return (
        <div id="not-found">
            <h1 className="text-center">Oops! Page Not Found.</h1>
        </div>
    );
};

export default NotFound;

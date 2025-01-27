import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Dashboard.css";

const SideBarForAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-wrapper">
      <div id="parent-user">
        <div className="user-options">

          <div id="logo-container">
            <img id="logo" src="/images/Logo.png" alt="Logo" />
          </div>


          <div
            id="dashboard"
            className="options"
            onClick={() => navigate(`/adminDashBoard`)}
          >
            <div id="circle">
              <div id="upper-circle">
                <span></span>
                <span></span>
              </div>
              <div id="lower-circle">
                <span id="light-circle"></span>
                <span></span>
              </div>
            </div>
            <p className="options-text">Dashboard</p>
          </div>

          <div
            className="options"
            onClick={() => navigate(`/admin-user-list`)}
          >
            <div id="option-image">
              <img src="/images/menu.png" alt="icon" />
            </div>
            <p className="options-text">Total Users</p>
          </div>
          <div
            className="options"
            onClick={() => navigate(`/active-users-list`)}
          >
            <div id="option-image">
              <img src="/images/menu.png" alt="icon" />
            </div>
            <p className="options-text">Active Users</p>
          </div>
          <div
  className="options"
  onClick={() => navigate(`/inActive-Users-list`)}
>
  <div id="option-image">
    <img src="/images/menu.png" alt="icon" />
  </div>
  <p className="options-text">Inactive Users</p>
</div>

<div
  className="options"
  onClick={() => navigate(`/admin-wave-list`)}
>
  <div id="option-image">
    <img src="/images/menu.png" alt="icon" />
  </div>
  <p className="options-text">All Waves</p>
</div>          
          </div>
          <div
            // className="options"
            // onClick={() => navigate(`/admin-wave-list`)}
          ></div>
        </div>
      </div>
  );
};

export default SideBarForAdmin;

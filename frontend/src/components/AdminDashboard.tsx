/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Local } from "../environment/env";
import { useNavigate } from "react-router-dom";
import SideBarForAdmin from "./SideBarForAdmin";
import Graph from "../components/AdminGraph";

const AdminDashboard = () => {
  const [userList, setUserList] = useState<any[]>([]);
  const [waveList, setWaveList] = useState<any[]>([]);
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const navigate = useNavigate();

  const fetchUserList = async () => {
    try {
      const response = await axios.get(
        `${Local.BASE_URL}${Local.GET_ALL_USERS}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("All User List", response.data);
      if (response.status === 200) {
        const users = response.data.users.map((user: any) => ({
          ...user,
          status: Number(user.status),
        }));
        setUserList(users);
      }
    } catch (error: any) {
      toast.error("Failed to fetch user list");
    }
  };

  const getAllWaveList = async () => {
    try {
      const response = await axios.get(
        `${Local.BASE_URL}${Local.GET_ALL_WAVES_ADMIN}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("All Waves List", response.data);
      if (response.status === 200) {
        setWaveList(response.data.data);
      } else {
        console.error("Something went wrong", response.status);
      }
    } catch (error: any) {
      toast.error("Wave List Cannot Be Shown At The Moment", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }
      const response = await axios.get(
        `${Local.BASE_URL}${Local.GET_ADMIN_PROFILE}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Admin Profile",response.data)
      if (response.status === 200) {
        setAdminProfile(response.data.admin);
      }

    } catch (error: any) {
      toast.error("Failed to fetch admin profile");
    }
  };

  useEffect(() => {
    fetchAdminProfile();
    fetchUserList();
    getAllWaveList();
  }, []);



  const handleUserList = () => {
    navigate("/admin-user-list");
  };

  const handleActiveUsersList = () => {
    navigate("/active-users-list");
  };

  const handleInactiveUsersList = () => {
    navigate("/inactive-users-list");
  };

  const handleWaveList = () => {
    navigate("/admin-wave-list");
  };

  return (
    <>
      <div className="admin-sidebar-button">
        <SideBarForAdmin />
        <div className="admin-logout-button">
          <button
            className="admin-logout-button-css"
            onClick={() => {
              localStorage.clear();
              navigate("/adminLogin");
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <div
        className="user-list-container"
        style={{
          padding: 25,
          backgroundColor: "whitesmoke",
          width: "989px",
          marginLeft: "23%",
          marginTop: "30px",
        }}
      >
        <div
          className="user-list-header"
          style={{ backgroundColor: "whitesmoke" ,marginRight:30}}
        >
          <div className="admin-heading">
            <p
              style={{
                fontSize: "17px",
                fontWeight: "bold",
                color: "#1976D2",
                marginLeft: "8px",
              }}
            >
              Admin Dashboard
            </p>
          </div>
          {adminProfile && (
            <div className="admin-profile">
              <h3>Welcome, {adminProfile.adminFullName}</h3>
              <p>
                <strong>Email:</strong> {adminProfile.adminEmail}
              </p>
            </div>
          )}
          <div className="dashboard-cards">
            <div className="card" onClick={handleUserList}>
              <h3 style={{ fontSize: "12px" }}>Total Users</h3>
              <p style={{ fontSize: "15px" }}>{userList.length}</p>
            </div>
            <div className="card" onClick={handleActiveUsersList}>
              <h3 style={{ fontSize: "12px" }}>Active Users</h3>
              <p style={{ fontSize: "15px" }}>
                {userList.filter((user) => user.status === 1).length}
              </p>
            </div>
            <div className="card" onClick={handleInactiveUsersList}>
              <h3 style={{ fontSize: "12px" }}>Inactive Users</h3>
              <p style={{ fontSize: "15px" }}>
                {userList.filter((user) => user.status === 0).length}
              </p>
            </div>
            <div className="card" onClick={handleWaveList}>
              <h3 style={{ fontSize: "12px" }}>Total Waves</h3>
              <p style={{ fontSize: "15px" }}>{waveList.length}</p>
            </div>
          </div>

          <div className="admin-graphs" style={{marginRight:8,marginLeft:5 , marginTop:35}}>
            <h3
              style={{
                fontSize: "17px",
                fontWeight: "bold",
                color: "#1976D2",
                marginLeft: "8px",
              }}
            >
              Graph
            </h3>
            <Graph users={userList} waves={waveList} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

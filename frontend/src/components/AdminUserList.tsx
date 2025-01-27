/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Local } from "../environment/env";
import { FaRegEye } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FormControlLabel, Switch } from "@mui/material";
import UserDetails from "./UserDetails";
import "../css/AdminDashboard.css";
import { toggleUserStatusAction } from "../actions/userAction";
import SideBarForAdmin from "./SideBarForAdmin";

const AdminUserList = () => {
  const [userList, setUserList] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserList();
  }, []);

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
      console.log("user details", response.data);
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

  const deleteUser = async (userId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${Local.BASE_URL}${Local.DELETE_ADMIN_USER}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(response.data.message);
      fetchUserList();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "An error occurred");
    }
  };

  const handleStatusToggle = async (userId: number, currentStatus: number) => {
    try {
      const payload = { userId };
      const result = await toggleUserStatusAction(payload);
      console.log(result);
      fetchUserList();
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  const openModal = (user: any) => {
    console.log("Opening modal for user:", user);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
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
          width: "950px",
          marginLeft: "23%",
          marginTop: "30px",
        }}
      >
        <div
          className="user-list-header"
          style={{ backgroundColor: "whitesmoke" }}
        >
          <p style={{ fontSize: "17px", color: "#1976d2", fontWeight: "bold" }}>
            Manage User List
          </p>
          {userList.length === 0 ? (
            <h3 style={{ color: "#3c3d3e" }}>No User List Found</h3>
          ) : (
            <table className="user-table" style={{ backgroundColor: "white", color: "#3c3d3e" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="center" style={{ textAlign: "center", color: "#3c3d3e" }}>
                {userList.map((user, index) => (
                  <tr key={index}>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone_number}</td>
                    <td>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={user?.status === 1}
                            onChange={() =>
                              handleStatusToggle(user.id, user.status)
                            }
                          />
                        }
                        label={user.status === 1 ? "Active" : "Inactive"}
                      />
                    </td>
                    <td>
                      <div className="status-icon">
                        <span className="admin-user-view-eye">
                          <FaRegEye
                            style={{ cursor: "pointer", color: "#1976d2" }}
                            onClick={() => openModal(user)}
                          />
                        </span>
                        <span className="admin-user-edit-pencil">
                          <FaRegEdit
                            style={{ cursor: "pointer", color: "#1976d2" }}
                          />
                        </span>
                        <span className="admin-user-delete-dustbin">
                          <MdDelete
                            style={{ cursor: "pointer", color: "red" }}
                            onClick={() => deleteUser(user.id)}
                          />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <UserDetails user={selectedUser} onClose={closeModal} />
      )}
    </>
  );
};

export default AdminUserList;

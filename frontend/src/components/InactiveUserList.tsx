/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import SideBarForAdmin from "./SideBarForAdmin";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserDetails from "./UserDetails";
import { Local } from "../environment/env";
import { toast } from "react-toastify";
import { FaRegEye } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

interface User {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  status: boolean;
}

const InactiveUserList = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
      console.log("User details", response.data);
      if (response.status === 200) {
        const users = response.data.users.map((user: User) => ({
          ...user,
          status: Boolean(user.status), // Ensure the status is a boolean
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

  const openModal = (user: User) => {
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
        <div className="user-list-header" style={{ backgroundColor: "whitesmoke" }}>
          <p style={{ fontSize: "17px", color: " #1976d2", fontWeight: "bold" }}>
            Inactive User List
          </p>
          {userList.filter((user) => !user.status).length === 0 ? (
            <>
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
                <tbody className="center" style={{ textAlign: "center" }}>
                  <tr>
                    <td style={{ color: "#3c3d3e" }} colSpan={12}>No Inactive Users. All Users Are Active.</td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <table className="user-table" style={{ backgroundColor: "white" }}>
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
                {userList
                  .filter((user) => !user.status)
                  .map((user: User, index: number) => (
                    <tr key={index}>
                      <td>{user.full_name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone_number}</td>
                      <td>{user.status ? "Active" : "Inactive"}</td>
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
      {isModalOpen && selectedUser && (
        <UserDetails user={selectedUser} onClose={closeModal} />
      )}
    </>
  );
};

export default InactiveUserList;

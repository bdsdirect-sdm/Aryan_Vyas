/* eslint-disable @typescript-eslint/no-unused-vars */
// Import the necessary components
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Local } from "../environment/env";
import { FaRegEye } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import WaveDetails from "./WaveDetails";
import "../css/AdminDashboard.css";
import SideBarForAdmin from "./SideBarForAdmin";

interface Wave {
  id: number;
  message: string;
  first_name: string;
  last_name: string;
  createdAt: string;
  image?: string;
  profileIcon?: string;
}

const AdminWaveList = () => {
  const [waveList, setWaveList] = useState<any[]>([]);
  const [selectedWave, setSelectedWave] = useState<Wave | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllWaveList();
  }, []);

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
      console.log("all waves", response.data);
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

  const deleteWave = async (userId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${Local.BASE_URL}${Local.ADMIN_DELETE_WAVE}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(response.data.message);
      getAllWaveList();

    } catch (error: any) {
      toast.error(error.response?.data?.error || "An error occurred");
    }
  };

  const openModal = (wave: Wave) => {
    console.log("Opening modal for wave:", wave);
    setSelectedWave(wave);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWave(null);
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
          <p style={{ fontSize: "17px", color: "#1976d2", fontWeight: "bold"}}>
            Manage Wave List
          </p>
          {waveList.length === 0 ? (
  <table className="user-table" style={{ backgroundColor: "white", color: "#3c3d3e" }}>
    <thead>
      <tr>
        <th>Full Name</th>
        <th>Message</th>
        <th>Created On</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td colSpan={4} style={{ textAlign: "center", color: "#3c3d3e", padding: "10px" }}>
          No Wave List Found
        </td>
      </tr>
    </tbody>
  </table>
) : (
  <table className="user-table" style={{ backgroundColor: "white", color: "#3c3d3e" }}>
    <thead>
      <tr>
        <th>Full Name</th>
        <th>Message</th>
        <th>Created On</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody className="center" style={{ textAlign: "center" }}>
      {waveList.map((wave, index) => (
        <tr key={index}>
          <td>{`${wave.first_name} ${wave.last_name}`}</td>
          <td>{wave.message}</td>
          <td>{moment(wave.createdAt).format("DD-MM-YYYY")}</td>
          <td>
            <div className="status-icon">
              <span className="admin-user-view-eye" onClick={() => openModal(wave)}>
                <FaRegEye style={{ cursor: "pointer", color: "#1976d2" }} />
              </span>
              <span className="admin-user-edit-pencil">
                <FaRegEdit style={{ cursor: "pointer", color: "#1976d2" }} />
              </span>
              <span className="admin-user-wave-delete-dustbin">
              <MdDelete
                style={{ cursor: "pointer", color: "red" }}
                onClick={() => deleteWave(wave.id)}
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

      {isModalOpen && selectedWave && (
        <WaveDetails wave={selectedWave} onClose={closeModal} />
      )}
    </>
  );
};

export default AdminWaveList;

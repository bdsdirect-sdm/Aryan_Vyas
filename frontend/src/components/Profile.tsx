import React, { useEffect, useRef, useState } from "react";
import BasicDetails from "./BasicDetails";
import PersonalDetails from "./PersonalDetails";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Local } from "../environment/env";
import userIcon from "../../public/images/user.jpeg";
import { toast } from "react-toastify";
import { useProfile } from "../context/ProfileContext";
import "../css/Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("BasicDetails");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { setProfileIcon, profileIcon } = useProfile();

  const handleTab = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate(`/`);
    }
    try {
      const response = await axios.get(
        `${Local.BASE_URL}${Local.GET_USER_NAME}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data.profileIcon;
      if (data) {
        setProfileIcon(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleChangePicture = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (!file) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return navigate(`/`);
    }

    const formData = new FormData();
    formData.append("profileIcon", file);

    try {
      const response = await axios.put(
        `${Local.BASE_URL}${Local.UPDATE_PROFILE}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.status) {
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 1000,
        });
        const updateProfileIcon = response.data.data.profileIcon;
        setProfileIcon(updateProfileIcon);
      }
    } catch (error: any) {
      console.error(error.message);
      toast.error("Profile Cannot We Updated", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <div className="dashboard-wrapper">
        <div className="user-wrapper" style={{marginLeft:-10}}>
          <div id="profile-header">
            <img
              src="../../public/images/left-arrow.png"
              alt=""
              onClick={() => navigate(`/user`)}
              style={{ cursor: "pointer" }}
            />
            <h2>Profile</h2>
          </div>
          <div id="img-container">
            <span className="profile-background-text">MY PROFILE</span>
            <img
              id="profile-user-icon"
              src={profileIcon ? profileIcon : userIcon}
              alt="icon"
            />
            <div id="upload-photo" style={{ marginTop: 45 }}>
              <h3>Upload a New Photo</h3>

              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleChangePicture}
              />
            </div>
            <button
              id="change-pic"
              onClick={handleFileInputClick}
              style={{ cursor: "pointer" }}
            >
              Change Picture
            </button>
          </div>
          <div>
            <p id="change-info">Change Information</p>
          </div>
        </div>

        <div id="basic-details-container">
          <div style={{ display: "flex" }}>
            <div
              id="form-header"
              onClick={() => handleTab("BasicDetails")}
              style={{ cursor: "pointer" }}
            >
              <h2 style={{ textAlign: "left", fontSize: "16px" }}>
                Basic Details
              </h2>

              {activeTab === "BasicDetails" ? (
                <span id="form-header-line"></span>
              ) : (
                <span id="form-header-line1"></span>
              )}
            </div>
            <div
              id="form-header"
              onClick={() => handleTab("PersonalDetails")}
              style={{ cursor: "pointer" }}
            >
              <h2
                style={{
                  textAlign: "left",
                  fontSize: "16px",
                  marginLeft: "70%",
                  width: "100%",
                }}
              >
                Personal Details
              </h2>
            </div>
          </div>
          {activeTab === "BasicDetails" && <BasicDetails />}
          {activeTab === "PersonalDetails" && <PersonalDetails id={id} />}

          {/* <BasicDetails/> */}
          {/* <PersonalDetails/> */}
        </div>
      </div>
    </>
  );
};

export default Profile;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import userIcon from "../../public/images/user.jpeg";
import { Local } from "../environment/env";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "../css/CreateWaves.css";

interface Wave {
  message: any;
  image: string;
  status: string | number;
  createdAt: string;
}

const CreateWave = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const { profileIcon, setProfileIcon } = useProfile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [waveList, setWaveList] = useState<Wave[]>([]);
  const [changeStatus, setChangeStatus] = useState(null);

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    validationSchema: Yup.object({
      message: Yup.string()
        .min(5, "Message must be at least 5 words")
        .max(150, "Message must be at most 150 words")
        .required("Text Is Compulsory To Create Wave"),
    }),
    onSubmit: (values, action) => {
      postWave(values, action);
    },
  });

  useEffect(() => {
    getUserProfile();
    getWaveList();
  }, []);

  const handleShowImageInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setSelectedImageName(event.target.files[0].name);
  };

  const getUserProfile = async () => {
    try {
      const response = await axios.get(
        `${Local.BASE_URL}${Local.GET_USER_NAME}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setProfileIcon(response.data.data.profileIcon);
        setUserName(response.data.data.fullName);
      }
    } catch (error: any) {
      console.error("Error fetching profile data:", error);
      toast.error("User Profile Cannot We Fetched At The Moment", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const postWave = async ({ message }: any, action: any) => {
    const formData = new FormData();

    if (selectedImage) {
      formData.append("image", selectedImage);
    } else {
      setSelectedImage(null);
    }
    formData.append("message", message);

    try {
      const response = await axios.post(
        `${Local.BASE_URL}${Local.CREATE_WAVE}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1000,
        });
        getWaveList();
        action.resetForm();
        setSelectedImageName(null);
        setSelectedImage(null);
      }
    } catch (error: any) {
      console.error("Error posting wave:", error);
      toast.error(
        "You Are Selecting Different Image Type Only (PNG,JPEG And JPG) Image Type Allowed Or The Photo Is More Than 5 MB",
        {
          position: "top-right",
          autoClose: 1000,
        }
      );
    }
  };

  const getWaveList = async () => {
    try {
      const response = await axios.get(
        `${Local.BASE_URL}${Local.GET_WAVE_LIST}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        let data = response.data.data;
        setWaveList(data);
      }
    } catch (error: any) {
      console.error("Something went wrong feth Errror ", error);
      toast.error("Something Went Wave Is Not Created", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const updateStatus = async (waveId: number, currentStatus: number) => {
    try {
      console.log("Create Wave");
      const newCurrentStatus = currentStatus === 0 ? 1 : 0;
      const response = await axios.put(
        `http://localhost:4000/updatewavestatus`,
        { status: newCurrentStatus, id: waveId },
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        getWaveList();
      }
    } catch (error: any) {
      console.error("Error Updated Status", error);
      toast.error("Error During Wave Status Update", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };
  const handleStatusChange = async (waveId: number, currentStatus: number) => {
    updateStatus(waveId, currentStatus);
  };
  return (
    <div className="dashboard-wrapper">
      <div className="user-wrapper">
        <div className="waves-header">
          <img
            src="../../public/images/left-arrow.png"
            id="left-arrow"
            alt="Go Back"
            onClick={() => navigate(`/user`)}
          />
          <h2>Create Waves</h2>
        </div>
        <div id="wave-container">
          <div id="wave-img-container">
            <span className="create-wave-background-text">Create Wave</span>
            <img
              src={profileIcon ? profileIcon : userIcon}
              alt="icon"
              id="profile-user-icon"
            />
            <div id="upload-photo">
              <h3 id="wave-username">{userName}</h3>
            </div>
          </div>
          <div id="wave-input">
            <p id="wave-label">What do you want to share?</p>
            <form onSubmit={formik.handleSubmit}>
              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <input
                type="text"
                id="wave-image-input"
                placeholder={
                  selectedImageName ? selectedImageName : "Upload photos"
                }
                onClick={handleShowImageInput}
                readOnly
              />
              <textarea
                name="message"
                id="wave-message-input"
                placeholder="Write something..."
                value={formik.values.message}
                onChange={formik.handleChange}
              />
              {formik.errors.message && formik.touched.message && (
                <div style={{ color: "red", marginTop: 10 }}>
                  {formik.errors.message}
                </div>
              )}
              <button type="submit" id="create-wave-button">
                Create Wave
              </button>
            </form>
          </div>
          <div id="search-wave">
            <img src="../../public/images/search.png" alt="" />
            <input id="input-search-wave" type="text" placeholder="Search" />
          </div>

          <div
            id="parent-user"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {waveList.map((newWaveList: any, index) => (
              <div id="wave-history-container" key={index}>
                <img src={profileIcon ? profileIcon : userIcon} alt="Icon" />
                <div id="invited-user-detail">
                  <p id="user-name">{userName}</p>
                  <p id="wave-message">{newWaveList?.message}</p>
                </div>
                <div
                  id="status"
                  onClick={() =>
                    handleStatusChange(newWaveList.id, newWaveList.status)
                  }
                >
                  <p
                    style={{
                      background:
                        newWaveList.status === 1 ? "#02480d" : "#B50E03",
                      height: "30px",
                      width: "82px",
                      textAlign: "center",
                      alignItems: "center",
                      alignContent: "center",
                      color: "white",
                      borderRadius: "50px",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    {newWaveList.status === 1 ? "Active" : "In Active"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWave;

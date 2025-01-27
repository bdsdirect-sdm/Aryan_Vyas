/* eslint-disable prefer-const */
import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import OpenModel from "./OpenModel";
import axios from "axios";
import { Local } from "../environment/env";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import userIcon from "../../public/images/user.jpeg";
import { useProfile } from "../context/ProfileContext"; 
import "../css/Dashboard.css"

const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openModel, setOpenModel] = useState<boolean>(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  const { setProfileIcon, profileIcon, userName, setUserName } = useProfile();
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    getuserDetails();
    updateGreeting();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setOpenModel(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const updateGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours >= 12 && hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  };

  const getuserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      let response = await axios.get(
        `${Local.BASE_URL}${Local.GET_USER_NAME}`,
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
          
        }
        
      );
      console.log("name",response.data)
      setUserName(response.data.data.fullName);
      setProfileIcon(response.data.data.profileIcon);
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        toast.error("Your session has expired. Please log in again.", {
          position: "top-right",
          autoClose: 1000,
        });
        localStorage.removeItem("token");
        navigate(`/`);
      } else {
        toast.error("An error occurred. Please try again later.", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    }
  };

  return (
    <>
      <div className="dashboard-wrapper">
        <div id="parent-user">
          <div className="user-options">
            <div id="logo-container">
              <img id="logo" src="../../public/images/Logo.png" alt="Logo" />
            </div>
            <div
              id="dashboard"
              className="options"
              onClick={() => navigate(`/user`)}
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
              onClick={() => navigate(`/user/profile`)}
            >
              <div id="option-image">
                <img src="../../public/images/menu.png" alt="icon"></img>
              </div>
              <p className="options-text">My Profile</p>
            </div>
            <div
              className="options"
              onClick={() => navigate(`/user/preferences`)}
            >
              <div id="option-image">
                <img src="../../public/images/menu.png" alt="icon"></img>
              </div>
              <p className="options-text">Preferences</p>
            </div>
            <div
              className="options"
              onClick={() => navigate(`/user/friends`)}
            >
              <div id="option-image">
                <img src="../../public/images/menu.png" alt="icon"></img>
              </div>
              <p className="options-text">Friends</p>
            </div>
            <div
              className="options"
              onClick={() => navigate(`/user/waves`)}
            >
              <div id="option-image">
                <img src="../../public/images/menu.png" alt="icon"></img>
              </div>
              <p className="options-text">Create Waves</p>
            </div>
            <div
              className="options"
              onClick={() => navigate(`/user/change-password`)}
            >
              <div id="option-image">
                <img src="../../public/images/menu.png" alt="icon"></img>
              </div>
              <p className="options-text">Change Password</p>
            </div>
            {/* <div
              className="options"
              id="logout"
              onClick={() => {
                localStorage.removeItem("token");
                navigate(`/`);
              }}
            > */}
              {/* <div id="option-image">
                <img src="../../public/images/logout1.png" alt="icon"></img>
              </div>
              <p className="options-text">Log Out</p> */}
            {/* </div> */}
          </div>

          <div id="navbar" ref={navbarRef}>
            <img
              src={profileIcon ? profileIcon : userIcon}
              alt="profileicon"
              id="user-icon"
              onClick={() => setOpenModel(!openModel)}
            />
            <div id="user-name">
              <p id="greeting">{greeting}</p>
              <p id="name" onClick={() => setOpenModel(!openModel)}>
                {userName}
              </p>
            </div>
            {openModel && (
              <OpenModel closeModel={() => setOpenModel(false)} id={id || ""} />
            )}
          </div>

          <div id="content">
            <Outlet />
          </div>
          <ToastContainer />
        </div>
      </div>
      
    </>
  );
};

export default Dashboard;

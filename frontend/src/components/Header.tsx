/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { PiHouseLight } from "react-icons/pi";
import { MdOutlinePersonalInjury, MdOutlineMarkChatRead, MdOutlinePersonPin } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import { BiBookReader } from "react-icons/bi";
import { LuLogOut } from "react-icons/lu";
import logoImg from "../photos/logo1.png";
import './Header.css';
import api from '../api/axiosInstance';
import { Local } from '../environment/env';
import { useQuery } from '@tanstack/react-query';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const firstname = localStorage.getItem('firstname');
  const lastname = localStorage.getItem('lastname');
  const doctype: any = localStorage.getItem('doctype');

  const [activeLink, setActiveLink] = useState('/dashboard');
  const [dropdownOpen, setDropdownOpen] = useState(false);  // Toggle state for dropdown visibility

  const handleLogoClick = () => {
    console.log('Logo clicked, navigating to dashboard');
    setActiveLink('/dashboard');
    navigate('/dashboard');
  };

  const getProfilePhoto = async () => {
    try {
      const apiUrl = `${Local.BASE_URL}${Local.GET_PROFILE_PHOTO}`;
      const response = await api.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Profile Photo:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile photo", error);
      return null;
    }
  };

  const { data: profilePhoto, isError, error, isLoading } = useQuery({
    queryKey: ['profilePhoto'],
    queryFn: getProfilePhoto,
  });

  return (
    <>
      <header className="header-container">
        <div className="header-left">
          <div onClick={handleLogoClick} className="logo-class">
            <img src={logoImg} alt="EyeRefer" className="logo-img-class" />
            <span className='logo-text'>EYE REFER</span>
            <hr />
          </div>
        </div>

        <div className="header-right">
          <div className='header-photo-div'>
            {/* {console.log(Local.BASE_URL,profilePhoto)} */}
            <img
              src={profilePhoto ? `${Local.BASE_URL}${profilePhoto.profilePhoto}` : "avatar.avif"}
              alt="Profile photo"
              className='header-photo'
            />
          </div>
          <div className="user-actions">
            {token ? (
              <div className="dropdown">
                <h6
                  className="dropdown-toggle"
                  aria-expanded={dropdownOpen ? "true" : "false"} 
                  onClick={() => setDropdownOpen(prevState => !prevState)} 
                >
                  Hi, {firstname} {lastname}
                  <br className='welcome'></br>Welcome back
                </h6>
                {dropdownOpen && (  
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/profile" className="dropdown-item">Profile</Link>
                    </li>
                    <li>
                      <Link to="/update-password" className="dropdown-item">Change Password</Link>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          localStorage.clear();
                          navigate('/login');
                        }}
                      >
                        Logout <LuLogOut />
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn login-btn">Login</Link>
                <Link to="/" className="btn signup-btn">Sign-up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {token && (
        <div className="sidebar bg-white">
          <nav className="nav-links">
            <div className='nav-link'>
              <Link 
                to="/dashboard" 
                className={`nav-link ${activeLink === '/dashboard' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/dashboard')}
              >
                <PiHouseLight className='house' />
                Dashboard
              </Link>
            </div>

            <div className='nav-link'>
              <Link 
                to="/patient" 
                className={`nav-link ${activeLink === '/patient' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/patient')}
              >
                <MdOutlinePersonalInjury className='house' />
                Patient
              </Link>
            </div>

            {doctype === '1' && (
              <div className='nav-link'>
                <Link 
                  to="/appointment-list" 
                  className={`nav-link ${activeLink === '/appointment-list' ? 'active' : ''}`} 
                  onClick={() => setActiveLink('/appointment-list')}
                >
                  <BiBookReader className='house'/>
                  Appointment
                </Link>
              </div>
            )}

            <div className='nav-link'>
              <Link 
                to="/doctor" 
                className={`nav-link ${activeLink === '/doctor' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/doctor')}
              >
                <MdOutlinePersonPin className='house'/>
                Doctors
              </Link>
            </div>

            <div className='nav-link'>
              <Link 
                to="/chat" 
                className={`nav-link ${activeLink === '/chat' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/chat')}
              >
                <MdOutlineMarkChatRead className='house' />
                Chat
              </Link>
            </div>

            <div className='nav-link'>
              <Link 
                to="/add-staff" 
                className={`nav-link ${activeLink === '/add-staff' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/add-staff')}
              >
                <GrGroup className='house' />
                Staff
              </Link>
            </div>
          </nav>
        </div>
      )}

      <Outlet />
    </>
  );
};

export default Header;

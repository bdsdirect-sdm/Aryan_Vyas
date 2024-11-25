import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { PiHouseLight } from "react-icons/pi";
import { MdOutlinePersonalInjury } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import { MdOutlineMarkChatRead } from "react-icons/md";
import { TfiPrinter } from "react-icons/tfi";
import { MdOutlinePersonPin } from "react-icons/md";
import { BiBookReader } from "react-icons/bi";
// import logo from '../Assets/title_logo.webp';
import './Header.css';




const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const firstname = localStorage.getItem('firstname')
  const lastname = localStorage.getItem('lastname')


  console.log(firstname, "dkfjsdklfjsdklfj")

  const doctype: any = localStorage.getItem('doctype');

  const handleLogoClick = () => {
    console.log('Logo clicked, navigating to dashboard');
    navigate('/dashboard');
  };

  return (
    <>

      <header className="header-container">

        <div className="header-left">


          {/* <img src='logo1.png' alt="loginbg" /> */}

        </div>


        <div className="header-right">
          <div className="user-actions">
            {token ? (
              <div className="dropdown">
                <h6 className="dropdown-toggle" aria-expanded="false">
                 {/* <img src="avatar.avif"
              alt="Profile photo"
              className='header-profile-img'></img> */}
               Hi, {firstname} {lastname}
                  <br className='welcome'></br>Welcome back
                </h6>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/profile" className="dropdown-item">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/update-password" className="dropdown-item">
                      Change Password
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        localStorage.clear();
                        navigate('/login');
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn login-btn">
                  Login
                </Link>
                <Link to="/" className="btn signup-btn">
                  Sign-up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>




      {token && (
        <div className="sidebar bg-white">
          <div className="sidebar-logo">
            <div onClick={handleLogoClick} className="logo">
              <img src="logo1.png" alt="EyeRefer" className="logo1-img" />
              <span className='logo-text'>EYE REFER</span>
              <hr />
            </div>
          </div>

          <nav className="nav-links ">

            <div className='nav-link'>

              <PiHouseLight className='house' />

              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
            </div>

            <div className='nav-link'>
              <MdOutlinePersonalInjury className='house' />

              <Link to="/patient" className="nav-link">
                Patient
              </Link>
            </div>

            {doctype === '1' && (
              <div className='nav-link'>
                <BiBookReader className='house'/>
                <Link to="/appointment-list" className="nav-link">
                  Appointment
                </Link>
              </div>
            )}


            {doctype === '2' && (
              <div className='nav-link'>
          <TfiPrinter className='house' />
                <Link to="/add-patient" className="nav-link">
                  Referral Patient
                </Link>
              </div>
            )}
            
            <div className='nav-link'>
            <MdOutlinePersonPin className='house'/>
            <Link to="/doctor" className="nav-link">
              Doctors
            </Link>
            </div>

            <div className='nav-link'>
              <MdOutlineMarkChatRead className='house' />
              <Link to="/chat" className="nav-link">
                Chat
              </Link>
            </div>

            <div className='nav-link'>
              <GrGroup className='house' />
              <Link to="/add-staff" className="nav-link">
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

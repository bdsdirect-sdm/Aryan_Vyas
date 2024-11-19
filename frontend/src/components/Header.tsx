import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
// import logo from '../Assets/title_logo.webp';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const firstname = localStorage.getItem('firstname')
  const lastname = localStorage.getItem('lastname')


  console.log(firstname,"dkfjsdklfjsdklfj")

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
            <div className='google-icon'>
            <img src="house.png" alt="EyeRefer" className='googleIcon-2'/>
            <Link to="/dashboard" className="nav-link active">
              Dashboard
            </Link>
            </div>
             <div className='google-icon'>
            <img src="patient.png" alt="EyeRefer" className='googleIcon-2'/>
            <Link to="/patient" className="nav-link">
              Patient
            </Link>
            </div>
           
      
            
            {doctype === '1' && (
              <div className='google-icon'>
            <img src="refer.png" alt="EyeRefer" className='googleIcon-2'/>
              <Link to="/appointmentList" className="nav-link">
                Appointments
              </Link>
              </div>
            )}
           

              {doctype === '2' && (
                 <div className='google-icon'>
            <img src="appointment.png" alt="EyeRefer" className='googleIcon-2'/>
              <Link to="/add-patient" className="nav-link">
                Referral Patient
              </Link>
              </div>
            )}
            

            <div className='google-icon'>
            <img src="doctor.png" alt="EyeRefer" className='googleIcon-2'/>
            <Link to="/doctor" className="nav-link">
              Doctors
            </Link>
            </div>

            <div className='google-icon'>
            <img src="chat.png" alt="EyeRefer" className='googleIcon-2'/>
            <Link to="/chat" className="nav-link">
              Chat
            </Link>
            </div>

            <div className='google-icon'>
            <img src="staff.png" alt="EyeRefer" className='googleIcon-2'/>
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

import React from "react";
import moment from "moment";
import "../css/UserDetails.css";
import userIcon from "../../public/images/user.jpeg";

const UserDetails = ({ user, onClose }: { user: any; onClose: () => void }) => {
  if (!user) return null;

  const profileImageUrl = user.profileIcon || userIcon;
  const status = user.status === 1 ? "Active" : "Inactive";

  return (
    <div className="user-details-modal">
      <div className="modal-overlay">
        <div className="modal-content" style={{ width: 560 }}>
          <button
            className="close-button"
            style={{ marginTop: 3, marginRight: 3 }}
            onClick={onClose}
          >
            &times;
          </button>
          <div className="modal_img_container">
            <span className="modal_img_text" style={{ fontSize: 110 }}>DETAILS</span>
            <img className="modal_img" src={profileImageUrl} alt="User Icon" />
            <span className="modal_image_friend_name">{user.full_name}</span>
            <span
              className="modal_image_friend_name"
              style={{
                textTransform: "lowercase",
                color: "white",
                marginTop: "63px",
                zIndex: 1,
                marginLeft: "-105px",
              }}
            >
              @{user.first_name}
            </span>
          </div>

          <div className="basic_info_heading">
            <p style={{ fontSize: "16px", color: "#3C3D3E", fontWeight: 900 }}>
              User Details
            </p>
          </div>

          <div className="user-details-info">
            <div className="left-side" style={{ color: "#3C3D3E" }}>
              <p>Name: {user.full_name}</p>
              <p>Email: {user.email}</p>
              <p>Mobile No.: {user.phone_number}</p>
              <p>Gender: {user.gender}</p>
              <p>State: {user.state}</p>
              <p>Status: {status}</p>
            </div>

            <div className="mid-vertical-line"></div>

            <div className="right-side" style={{ color: "#3C3D3E" }}>
              <p>DOB: {moment(user.dob).format("DD-MM-YYYY")}</p>
              <p>Social Security: {user.ssn}</p>
              <p>Address: {user.address1}</p>
              <p>City: {user.city}</p>
              <p>Zip Code: {user.zip}</p>
            </div>
          </div>

          <div className="user-details-button">
            <button onClick={onClose} className="back-button-user-details">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

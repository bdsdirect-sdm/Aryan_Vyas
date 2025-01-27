import React from "react";
import "../css/UserprofileModal.css";

interface UserProfileModalProps {
  user: any;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>User Profile</h2>
        <div className="profile-section">
          <p>
            <strong>Full Name:</strong> {user.full_name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone_number}
          </p>
          <p>
            <strong>Date of Birth:</strong> {user.dob}
          </p>
          <p>
            <strong>Gender:</strong> {user.gender}
          </p>
          <p>
            <strong>Address 1:</strong> {user.address1}
          </p>
          <p>
            <strong>Address 2:</strong> {user.address2}
          </p>
          <p>
            <strong>City:</strong> {user.city}
          </p>
          <p>
            <strong>State:</strong> {user.state}
          </p>
          <p>
            <strong>Zip Code:</strong> {user.zip}
          </p>
          <p>
            <strong>Marital Status:</strong> {user.marital_status}
          </p>
          <p>
            <strong>Social:</strong> {user.social}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;

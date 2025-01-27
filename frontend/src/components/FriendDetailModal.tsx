import React from "react";
import moment from "moment";
import userIcon from '../../public/images/user.jpeg'
import "../css/FriendDetailModal.css"
interface FriendDetailModalProps {
    friend: any;
    onClose: () => void;
}

const FriendDetailModal: React.FC<FriendDetailModalProps> = ({ friend, onClose }) => {
    if (!friend) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <div className="modal_img_container">
                    <span className="modal_img_text" style={{ fontSize: 100 }}>DETAILS</span>
                    <img className="modal_img" src={friend.icon || userIcon} />
                    <span className="modal_image_friend_name">{friend.name}</span>
                    <span className="" style={{ textTransform: "lowercase", color: "white", marginTop: "63px", zIndex: 1, marginLeft: "-105px" }}>@{friend.userDetails?.first_name}</span>
                </div>
                <div className="basic_info_heading">
                    <p style={{ fontSize: "16px", color: "#3C3D3E", fontWeight: 900 }}>Basic Details</p>
                </div>


                <div className="friends_details_info">

                    <div className="left_side" style={{ color: "#3C3D3E" }}>
                        <div className="">Name: {friend.name}</div>
                        <div className="">Email:{friend.email}</div>
                        <div className="">Mobile No.: {friend.userDetails?.phoneNumber}</div>
                        <div className="">Gender: {friend.userDetails?.gender}</div>
                        <div className="">State: {friend.userDetails?.state}</div>
                    </div>

                    <div className="mid_vertical_line"></div>

                    <div className="right_side" style={{ color: "#3C3D3E" }}>
                        <div className="">DOB: {moment(friend.userDetails?.dob).format("DD-MM-YYYY")}</div>
                        <div className="">Social Security: {friend.userDetails?.ssn}</div>
                        <div className="">Address: {friend.userDetails?.address1}</div>
                        <div className="">City: {friend.userDetails?.city}</div>
                        <div className="">Zip Code: {friend.userDetails?.zip}</div>
                    </div>
                </div>

                {/* <div>Address 2:{friend.userDetails?.address2}</div>  */}
                {/* <div>Marital Status:{friend.userDetails?.maritalStatus}</div> */}

            </div>
        </div>

    );
};

export default FriendDetailModal;

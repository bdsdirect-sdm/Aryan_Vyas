import React from "react";
import moment from "moment";
import "../css/WaveDetails.css";
import defaultWaveImage from "../../public/images/user.jpeg";

const WaveDetails = ({ wave, onClose }: { wave: any; onClose: () => void }) => {
  if (!wave) return null;

  const waveImageUrl = wave.image && wave.image.trim() !== "" ? wave.image : defaultWaveImage;
  const profileIconUrl = wave.profileIcon || defaultWaveImage;
  const createdAt = moment(wave.createdAt).format("DD-MM-YYYY");

  return (
    <div className="wave-details-modal">
      <div className="modal-overlay">
        <div className="modal-content" style={{ width: 560 }}>
          <button
            className="close-button"
            style={{ marginTop: 3, marginRight: 3, padding: 1 }}
            onClick={onClose}
          >
            &times;
          </button>

          <div className="modal_img_container">
            <span className="modal_img_text">WAVE DETAILS</span>

            <div className="wave-image-container">
              <img className="modal_img" src={waveImageUrl} alt="Wave Image" />
            </div>

            <span className="modal_wave_name">
              {wave.first_name} {wave.last_name}
            </span>

            <span
              className="modal_wave_message"
              style={{
                textTransform: "lowercase",
                color: "white",
                marginTop: "63px",
                zIndex: 1,
                marginLeft: "-105px",
              }}
            >
              @{wave.first_name}
            </span>
          </div>

          <div className="basic_info_heading">
            <p style={{ fontSize: "16px", color: "#3C3D3E", fontWeight: 900 }}>
              Wave Details
            </p>
          </div>

          <div className="wave-details-info">
            <div className="left-side" style={{ color: "#3C3D3E" }}>
              <p>Full Name: {wave.first_name} {wave.last_name}</p>
              <p>Message: {wave.message}</p>
              <p>Created At: {createdAt}</p>

              <div className="comments-section">
                <h4 style={{ marginBottom: "10px" }}>Comments</h4>
                <div className="comments-container">
                  {wave.comments && wave.comments.length > 0 ? (
                    wave.comments.map((comment: any) => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-starting">
                           
                        <img
                          src={comment.commenter?.profileIcon || defaultWaveImage}
                          alt="Commenter"
                          className="commenter-icon"
                        />
                        <strong style={{marginTop:10}}>
                            {comment.commenter?.first_name} {comment.commenter?.last_name}
                          </strong>
                     </div>
                        <div className="comment-details" style={{display:"flex",gap:20}}>
                          {/* <strong>
                            {comment.commenter?.first_name} {comment.commenter?.last_name}
                          </strong> */}
                          <p>{comment.comment}</p>
                          <span className="comment-date" style={{marginTop:17}}>
                            {moment(comment.createdAt).format("DD-MM-YYYY HH:mm A")}
                          </span>
                        </div>
                        <hr className="line"></hr>
                      </div>
                    ))
                  ) : (
                    <p className="no-comments">No comments yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mid-vertical-line"></div>

            <div className="right-side" style={{ color: "#3C3D3E" }}>
              <img className="wave-picture" src={profileIconUrl} alt="Wave Icon" />
            </div>
          </div>

          <div className="wave-details-button">
            <button onClick={onClose} className="back-button-wave-details">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveDetails;

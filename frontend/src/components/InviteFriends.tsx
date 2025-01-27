/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { Local } from "../environment/env";
import "../css/InviteFriends.css";

const validationSchema = Yup.object({
  inviteName: Yup.string().required("Full Name is Compulsory"),
  inviteEmail: Yup.string()
    .email("Invalid email address")
    .required("Email Is Compulsory"),
  inviteMessage: Yup.string().required("Message Is Compulsory"),
});

const InviteFriends = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const formik = useFormik({
    initialValues: {
      inviteName: "",
      inviteEmail: "",
      inviteMessage: "",
    },
    validationSchema,
    onSubmit: (values) => {
      InviteFriend(values);
    },
  });

  const InviteFriend = async (values: any) => {
    console.log(values);
    try {
      const response = await axios.post(
        `${Local.BASE_URL}${Local.INVITE_FRIEND}`,
        values,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Invite Sent Successfully", {
          position: "top-right",
          autoClose: 1000,
        });
        formik.resetForm();
      }
    } catch (error: any) {
      toast.error("Error Occur During Invite Sending", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div id="friend-dashboard">
        <div className="user-wrapper">
          <div id="friends-header1">
            <img
              id="left-arrow"
              src="../../public/images/left-arrow.png"
              onClick={() => navigate(`/user`)}
            />
            <h2>Friends</h2>
          </div>
          <p id="friends-header-paragraph">
            Invite some friends, show them your Waves and let's see what they
            can do!
          </p>
          <div id="friends-container">
            <div id="friend-count">
              <h4>Friend</h4>
            </div>
            <div id="friend">
              <form id="invite-friends-form" onSubmit={formik.handleSubmit}>
                <div id="name-email-wrapper">
                  <div id="friend-details">
                    <label htmlFor="name">Full Name</label>
                    <br />
                    <div className="friend-details-container">
                      <input
                        name="inviteName"
                        type="text"
                        placeholder="Full Name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inviteName}
                      />
                      {formik.touched.inviteName && formik.errors.inviteName ? (
                        <div className="error">{formik.errors.inviteName}</div>
                      ) : null}
                    </div>
                  </div>
                  <div id="friend-details">
                    <label htmlFor="email">Email Address</label>
                    <br />
                    <div className="friend-details-container">
                      <input
                        name="inviteEmail"
                        type="email"
                        placeholder="Email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inviteEmail}
                      />
                      {formik.touched.inviteEmail &&
                        formik.errors.inviteEmail ? (
                        <div className="error">{formik.errors.inviteEmail}</div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div id="message-container">
                  <label htmlFor="message">Message</label>
                  <br />
                  <div className="friend-details-container">
                    <input
                      id="message"
                      name="inviteMessage"
                      type="text"
                      placeholder="Message"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.inviteMessage}
                    />
                    {formik.touched.inviteMessage &&
                      formik.errors.inviteMessage ? (
                      <div className="error">{formik.errors.inviteMessage}</div>
                    ) : null}
                  </div>
                </div>

                <div id="friends-button-container">
                  <button type="submit" id="update-button">
                    Friends
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteFriends;

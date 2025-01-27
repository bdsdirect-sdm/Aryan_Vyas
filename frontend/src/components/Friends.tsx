/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import userIcon from "../../public/images/user.jpeg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Local } from "../environment/env";
import "../css/Friends.css";

const Friends = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inviteList, setInviteList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Added state for search query
  const [isPolling] = useState(true);

  useEffect(() => {
    getInviteFriendList();
    const interval = setInterval(() => {
      if (isPolling) {
        getInviteFriendList();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isPolling]);

  const getInviteFriendList = async () => {
    try {
      const response = await axios.get(
        `${Local.BASE_URL}${Local.INVITE_FRIEND}`,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setInviteList(response.data.data);
      }
    } catch (error: any) {
      /* empty */
    }
  };

  const filteredInviteList = inviteList.filter((friend) => {
    const nameMatch = friend.name.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = friend.email.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch;
  });

  return (
    <>
      <div className="dashboard-wrapper">
        <div className="user-wrapper">
          <div id="friends-header">
            <img
              src="../../public/images/left-arrow.png"
              alt="Go Back"
              style={{ height: "24px", cursor: "pointer" }}
              onClick={() => navigate(`/user`)}
            />
            <h2>Friends</h2>
          </div>
          <div id="friends-container-main">
            <div id="search-friend-container">
              <div id="search-friend">
                <img src="../../public/images/search.png" alt="Search" />
                <input
                  type="text"
                  id="input-search"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <img
                src="../../public/images/sort.png"
                id="sort-icon"
                alt="Sort"
              />
              <button
                type="submit"
                id="update-button"
                onClick={() => navigate(`/user/invitefriends`)}
              >
                Invite Friends
              </button>
            </div>
            {filteredInviteList.length === 0 ? (
              <div id="no-invite-message">
                <p style={{ fontSize: 26 }}>No Invite Friend List</p>
              </div>
            ) : (
              filteredInviteList.length > 0 &&
              filteredInviteList.map((friend, index) => {
                if (index % 2 === 0) {
                  return (
                    <div id="parent-user" key={index}>
                      {filteredInviteList.slice(index, index + 2).map((invitee) => (
                        <div
                          id="invited-user-container"
                          style={{ cursor: "default" }}
                          key={invitee.id}
                        >
                          <img src={invitee.icon || userIcon} alt="pic" />
                          <div id="invited-user-detail">
                            <p id="user-name">{invitee.name}</p>
                            <p id="user-email">{invitee.email}</p>
                          </div>
                          <div
                            id="status"
                            style={{
                              background: invitee.isAccepted
                                ? "#49A15C"
                                : "#B18D4B",
                              color: "white",
                              fontSize: "13px",
                            }}
                          >
                            {invitee.isAccepted ? "Accepted" : "Pending"}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Friends;

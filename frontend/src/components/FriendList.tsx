import React from "react";
import { useEffect, useState } from "react";
import userIcon from "../../public/images/user.jpeg";
import FriendInfo from "./FriendInfo";
import axios from "axios";
import { Local } from "../environment/env";
import { useParams } from "react-router-dom";
function FriendList() {
  const [openModel, setOpenModel] = useState(false);
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const closeModel = () => {
    setOpenModel(false);
    setSelectedFriendId(null);
  };
  const { id } = useParams();

  useEffect(() => {
    getAcceptedFriendList();

    const interval = setInterval(() => {
      getAcceptedFriendList();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getAcceptedFriendList = async () => {
    try {
      const response = await axios.get(
        `${Local.BASE_URL}${Local.ACCEPTED_FRIEND}`,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAcceptedFriends(response.data.data);
    } catch (error: any) {
      console.error("Something went wrong", error.message);
    }
  };

  const handleOpenModel = (friendId: number) => {
    setSelectedFriendId(friendId);
    setOpenModel(true);
  };

  return (
    <div id="friends-container-main">
      <p id="friend-label" style={{ fontSize: 18 }}>
        Friends
      </p>
      <div id="parent-user">
        {acceptedFriends.length === 0 ? (
          <p id="no-friends">No Friends!</p>
        ) : (
          acceptedFriends.map((friend: any) => (
            <div
              id="invited-user-container"
              key={friend.id}
              onClick={() => handleOpenModel(friend.id)}
              style={{ cursor: "pointer" }}
            >
              <img src={friend.icon || userIcon} alt={friend.name} />
              <div id="invited-user-detail">
                <p id="user-name">{friend.name}</p>
                <p id="user-email">{friend.email}</p>
              </div>
              <div
                id="status"
                style={{
                  background: "#49A15C",
                  color: "white",
                }}
              >
                <p>Accepted</p>
              </div>
            </div>
          ))
        )}
      </div>
      {openModel && (
        <FriendInfo closeModel={closeModel} friendId={selectedFriendId} />
      )}
    </div>
  );
}

export default FriendList;

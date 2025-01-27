/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useEffect, useState } from "react";
import userIcon from "../../public/images/user.jpeg";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Local } from "../environment/env";
import FriendDetailModal from "./FriendDetailModal";

const AcceptedFriendList = () => {
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        getAcceptedFriendList();
    }, []);
    const getAcceptedFriendList = async () => {
        try {
            const response = await axios.get(`${Local.BASE_URL}${Local.ACCEPTED_FRIEND_LIST}`, {
                headers: {
                    Authorization: `bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log(response.data)
            const accepted = response.data.data.filter((friend: any) => friend.status === 1);
            setAcceptedFriends(accepted);
            if (accepted.length === 0) {
                toast.info("You have no accepted friends yet.", { autoClose: 3000 });
            }
        } catch (error: any) {
            console.error("Something went wrong", error.message);
            // toast.error("Failed to fetch accepted friends.", { autoClose: 3000 });
        }
    };

    return (
        <div id="friends-container-main">
            <p id="friend-label" style={{ fontSize: 20 }}>Friends</p>
            <div id="parent-user">
                {acceptedFriends.length === 0 ? (
                    <p id="no-friends">No Accepted Friends!</p>
                ) : (
                    acceptedFriends.map((friend: any) => (
                        <div
                            id="invited-user-container"
                            key={friend.id}
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedFriend(friend)}
                        >
                            <img
                                src={friend.icon || userIcon}
                                alt={friend.name}
                            />
                            <div id="invited-user-detail">
                                <p id="user-name">{friend.name}</p>
                                <p id="user-email">{friend.email}</p>
                            </div>
                            <div
                                id="status"
                                style={{
                                    background: "#49A15C",
                                }}
                            >
                                <p>Accepted</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {selectedFriend && (
                <FriendDetailModal
                    friend={selectedFriend}
                    onClose={() => setSelectedFriend(null)}
                />
            )}
        </div>
    );
};

export default AcceptedFriendList;

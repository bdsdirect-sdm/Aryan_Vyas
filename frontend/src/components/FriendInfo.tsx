import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Local } from "../environment/env";
import "../css/FriendInfo.css";

interface FriendInfoProps {
  closeModel: () => void;
  friendId: number | null;
}

const FriendInfo: React.FC<FriendInfoProps> = ({ closeModel, friendId }) => {
  const [friendInfo, setFriendInfo] = useState<any>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (friendId) {
      getAcceptedUserDetails();
      intervalId = setInterval(() => {
        getAcceptedUserDetails();
      }, 4000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [friendId]);

  const getAcceptedUserDetails = async () => {
    try {
      const response = await axios.get(
        `${Local.BASE_URL}${friendId}/${Local.GET_USER_DETAILS}`,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data.data.userDetails);
      setFriendInfo(response.data.data.userDetails);
    } catch (error: any) {
      console.error("Error fetching friend details:", error.message);
      toast.error("Failed to fetch friend details");
    }
  };

  return (
    <>
      <div id="model-wrapper"></div>
      <div id="wave-model">
        <div id="friend-cover-color">
          <h1>Details</h1>
          <div id="user-profile">
            <img
              id="friend-user-icon"
              src={friendInfo?.profileIcon || "../../public/images/user.png"}
              alt="user"
            />
            <div id="creator-details">
              <p id="friend-name">
                {friendInfo
                  ? `${friendInfo.firstName} ${friendInfo.lastName}`
                  : "Loading..."}
              </p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="25"
              viewBox="0 0 23 25"
              fill="none"
              onClick={closeModel}
            >
              <ellipse
                cx="11.4194"
                cy="12.6786"
                rx="10.7319"
                ry="11.7643"
                fill="#DECAA5"
              />
              <line
                y1="-0.5"
                x2="15.924"
                y2="-0.5"
                transform="matrix(0.673947 0.738779 -0.673947 0.738779 6.64966 7.44995)"
                stroke="#B18D4B"
              />
              <line
                y1="-0.5"
                x2="15.924"
                y2="-0.5"
                transform="matrix(-0.673947 0.738779 0.673947 0.738779 17.3816 7.44995)"
                stroke="#B18D4B"
              />
            </svg>
          </div>
        </div>
        <div id="friend-detail-container">
          <h3 id="friend-detail-heading">Basic Details</h3>
          <div id="friend-details-main">
            <div className="grid-container">
              <div className="item1">Name: </div>
              <div className="item2">
                {friendInfo
                  ? `${friendInfo.firstName} ${friendInfo.lastName}`
                  : "Loading..."}
              </div>
              <div className="item3">DOB: </div>
              <div className="item4">{friendInfo?.dob || "N/A"}</div>
              <div className="item5">Email ID: </div>
              <div className="item6">{friendInfo?.email || "N/A"}</div>
              <div className="item7">Social Security: </div>
              <div className="item8">{friendInfo?.social || "N/A"}</div>
              <div className="item9">Mobile No.: </div>
              <div className="item10">{friendInfo?.phoneNumber || "N/A"}</div>
              <div className="item11">Address: </div>
              <div className="item12">
                {friendInfo?.address
                  ? `${friendInfo.address.address1 || ""} ${
                      friendInfo.address.address2 || ""
                    }, ${friendInfo.address.city || ""}, ${
                      friendInfo.address.state || ""
                    }, ${friendInfo.address.zip || ""}`
                  : "N/A"}
              </div>
              <div className="item13">Gender: </div>
              <div className="item14">{friendInfo?.gender || "N/A"}</div>
              <div className="item15">City: </div>
              <div className="item16">{friendInfo?.address?.city || "N/A"}</div>
              <div className="item17">State: </div>
              <div className="item18">
                {friendInfo?.address?.state || "N/A"}
              </div>
              <div className="item19">Zip Code: </div>
              <div className="item20">{friendInfo?.address?.zip || "N/A"}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendInfo;

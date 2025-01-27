/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Local } from "../environment/env";
import WavesInfo from "./WavesInfo";
import AcceptedFriendList from "../components/AcceptedFriendList";
import "../css/WaveList.css"

const WaveList = () => {
  const { id } = useParams();
  const [wavelist, setWaveList] = useState<any[]>([]);
  const [openModel, setOpenModel] = useState(false);
  const [waveId, setWaveId] = useState<number | null>(null);
  const [posterName, setPosterName] = useState<string | null>(null);
  const [posterIcon, setPosterIcon] = useState<string | null>(null);
  const [waveImage, setWaveImage] = useState<string | null>(null);
  const [waveMessage, setWaveMessage] = useState<string | null>(null);

  useEffect(() => {
    getAllWaveList();
  }, []);

  const getAllWaveList = async () => {
    try {
      const response = await axios.get(`${Local.BASE_URL}${Local.GET_ALL_WAVE_LIST}`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("all waves",response.data)
      if (response.status === 200) {
        setWaveList(response.data.data);
      } else {
        console.error("Something went wrong", response.status);
      }
    } catch (error: any) {
      toast.error("Wave List Cannot Be Shown At The Moment", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };


  const chunkArray = (array: any[], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const waveChunks = chunkArray(wavelist, 3);

  return (
    <>
      <div className="wave-list-container">
        <p>Making Waves</p>
        {waveChunks.length === 0 ? (
          <h1 id="no-friends">No active waves!</h1>
        ) : (
          waveChunks.map((chunk, rowIndex) => (
            <div
              className="wave-row"
              key={rowIndex}
              style={{ display: "flex", alignItems: "center", marginLeft: 38, marginBottom: 48 }}
            >
              {chunk.map((wave, colIndex) => (
                <div
                  id="user-wave-container"
                  key={colIndex}
                  onClick={() => {
                    setOpenModel(!openModel);
                    setWaveId(wave.id);
                    setWaveImage(wave.image);
                    setWaveMessage(wave.message);
                    setPosterName(`${wave.first_name} ${wave.last_name}`);
                    setPosterIcon(wave.profileIcon);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div id="user-waves">
                    <img src={wave.profileIcon || "../../public/images/user.jpeg"} alt="Wave" id="user-img" />
                  </div>
                  <div id="user-wave-details">
                    <p id="user-id">
                      {wave.first_name} {wave.last_name}
                    </p>
                    <p id="user-message">{wave.message}</p>
                    <p id="follow-button">Follow</p>
                    <span id="line"></span>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      {openModel && (
        <WavesInfo
          setOpenModel={setOpenModel}
          waveId={waveId}
          waveImage={waveImage}
          waveMessage={waveMessage}
          posterName={posterName}
          posterIcon={posterIcon}
        />
      )}

      <div className="friends-list-container" style={{marginLeft:"-13px",width:"998px"}}>
        <div className="friends-list">  
          <AcceptedFriendList />
        </div>
      </div>
    </>
  );
};

export default WaveList;

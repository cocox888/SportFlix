import React from "react";
import "./chatPortal.css";
import { useDataLayerValue } from "../../Datalayer/DataLayer";

function UserMessage({ message }) {
  const [{ userData }] = useDataLayerValue();
  return (
    <div className="cp-mid-you">
      <div className="cp-mid-left">
        <div className="cp-mid-info">
          <span className="cp-mid-info-date">
            {message?.date} - {message?.time}
          </span>
          <span className="cp-mid-info-name">You</span>
        </div>
        <div className="cp-mid-message cp-mid-message-you">
          {message?.message} Helo
        </div>
      </div>
      <div className="cp-mid-right">
        <div className="cp-mid-img">
          <img
            src={userData?.picture}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
}

export default UserMessage;

import React from "react";
import "./chatPortal.css";

function OthersMessage({ message }) {
  return (
    <div className="cp-mid-others">
      <div className="cp-mid-left">
        <div className="cp-mid-img"></div>
      </div>
      <div className="cp-mid-right">
        <div className="cp-mid-info">
          <span className="cp-mid-info-name">{message?.sender_name}</span>
          <span className="cp-mid-info-date">
            {message?.date} - {message?.time}
          </span>
        </div>
        <div className="cp-mid-message cp-mid-message-other">
          {message?.message}
        </div>
      </div>
    </div>
  );
}

export default OthersMessage;

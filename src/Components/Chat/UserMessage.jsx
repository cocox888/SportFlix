import React from "react";
import "./chatPortal.css";

function UserMessage({ message }) {
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
          {message?.message}
        </div>
      </div>
      <div className="cp-mid-right">
        <div className="cp-mid-img"></div>
      </div>
    </div>
  );
}

export default UserMessage;

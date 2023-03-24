import React from "react";
import "./chatPortal.css";

function UserMessage() {
  return (
    <div className="cp-mid-you">
      <div className="cp-mid-left">
        <div className="cp-mid-info">
          <span className="cp-mid-info-date">24th Jan - 05:00 PM</span>
          <span className="cp-mid-info-name">Ayanabha Misra</span>
        </div>
        <div className="cp-mid-message cp-mid-message-you">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis non
          obcaecati excepturi ad dolores! Facere perferendis harum aperiam
          voluptates! Porro et asperiores deleniti eligendi.
        </div>
      </div>
      <div className="cp-mid-right">
        <div className="cp-mid-img"></div>
      </div>
    </div>
  );
}

export default UserMessage;

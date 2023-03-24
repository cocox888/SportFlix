import React from "react";
import "./chatPortal.css";

function OthersMessage() {
  return (
    <div className="cp-mid-others">
      <div className="cp-mid-left">
        <div className="cp-mid-img"></div>
      </div>
      <div className="cp-mid-right">
        <div className="cp-mid-info">
          <span className="cp-mid-info-name">Ayanabha Misra</span>
          <span className="cp-mid-info-date">24th Jan - 05:00 PM</span>
        </div>
        <div className="cp-mid-message cp-mid-message-other">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis non
          obcaecati excepturi ad dolores! Facere perferendis harum aperiam
          voluptates! Porro et asperiores deleniti eligendi.
        </div>
      </div>
    </div>
  );
}

export default OthersMessage;

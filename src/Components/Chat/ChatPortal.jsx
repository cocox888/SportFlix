import React from "react";
import "./chatPortal.css";

function ChatPortal() {
  return (
    <div className="chatPortal">
      <div className="cp-top"></div>
      <div className="cp-mid">
        <div className="cp-mid-others">
          <div className="cp-mid-left">
            <div className="cp-mid-img"></div>
          </div>
          <div className="cp-mid-right">
            <div className="cp-mid-info">
              <span>Ayanabha Misra</span>
              <span>24th Jan - 05:00 PM</span>
            </div>
            <div className="cp-mid-message cp-mid-message-other">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
              non obcaecati excepturi ad dolores! Facere perferendis harum
              aperiam voluptates! Porro et asperiores deleniti eligendi.
            </div>
          </div>
        </div>
        <div className="cp-mid-you">
          <div className="cp-mid-left">
            <div className="cp-mid-img"></div>
          </div>
          <div className="cp-mid-right">
            <div className="cp-mid-info">
              <span>Ayanabha Misra</span>
              <span>24th Jan - 05:00 PM</span>
            </div>
            <div className="cp-mid-message cp-mid-message-other">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
              non obcaecati excepturi ad dolores! Facere perferendis harum
              aperiam voluptates! Porro et asperiores deleniti eligendi.
            </div>
          </div>
        </div>
      </div>
      <div className="cp-btm"></div>
    </div>
  );
}

export default ChatPortal;

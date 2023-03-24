import { KeyboardArrowLeftOutlined } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./chat.css";
import ChatPortal from "./ChatPortal";

function Chat() {
  const history = useNavigate();
  return (
    <div className="chat">
      <div className="chat-container">
        <div className="chat-left" onClick={history(-1)}>
          <div className="chat-header-container">
            <div className="chat-back-container" onClick={() => history(-1)}>
              <KeyboardArrowLeftOutlined />
            </div>
            <span>Messages</span>
          </div>
          <div className="chat-selector">
            <div className="chat-op-img"></div>
            <span className="chat-op-name">24th Jan - Golf Club</span>
          </div>
          <div className="chat-selector">
            <div className="chat-op-img"></div>
            <span className="chat-op-name">24th Jan - Golf Club</span>
          </div>
        </div>
        <div className="chat-right">
          <ChatPortal />
        </div>
      </div>
    </div>
  );
}

export default Chat;

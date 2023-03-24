import { Send, SendRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import "./chatPortal.css";
import OthersMessage from "./OthersMessage";
import UserMessage from "./UserMessage";

function ChatPortal() {
  return (
    <div className="chatPortal">
      <div className="cp-top">
        <div className="cp-top-logo"></div>
        <div className="cp-top-info">
          <span className="cp-top-name">24th Jan - Golf Club </span>
        </div>
      </div>
      <div className="cp-mid">
        <OthersMessage />
        <UserMessage />
      </div>
      <div className="cp-btm">
        <div className="cp-btm-inp-container">
          <input
            type="text"
            className="cp-btm-inp"
            placeholder="Type a message"
          />
          <Button
            variant="contained"
            className="cp-btm-inp-btn"
            sx={{
              background: "rgb(69, 106, 242)",
              borderRadius: "0px",
              borderTopRightRadius: "8px !important",
              borderBottomRightRadius: "8px !important",
              padding: "3.5px 10px",
              boxShadow: "unset",
            }}
            endIcon={<SendRounded />}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatPortal;

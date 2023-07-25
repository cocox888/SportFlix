import {
  KeyboardArrowLeftOutlined,
  Send,
  SendRounded,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useEffect, useRef } from "react";
import "./chatPortal.css";
import OthersMessage from "./OthersMessage";
import UserMessage from "./UserMessage";
import socketIOClient from "socket.io-client";
import { useState } from "react";
import { useDataLayerValue } from "../../Datalayer/DataLayer";

function ChatPortal({ room, showMobileChat, removeChatRoom }) {
  const socketRef = useRef();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ userData }] = useDataLayerValue();
  const changeMessage = (e) => {
    setMessage(e.target.value);
  };
  const [{ loading }, dispatch] = useDataLayerValue();
  const baseURL = process.env.REACT_APP_SOCKET_BASEURL;

  const changeDateFormat = () => {
    const d = new Date();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[d.getMonth()];
    const date = d.getDate();
    return `${month} ${date}`;
  };

  const getTime = () => {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  const joinRoom = () => {
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    socketRef.current.emit("join-room", room?.room_id, (res) => {
      setMessages(res.roomInfo.messages);
    });
    socketRef.current.on("receive-message", (data) =>
      setMessages((prevState) => [...prevState, data])
    );
    dispatch({
      type: "SET_LOADING",
      loading: false,
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    let trimmedMessage = message.replace(/\s+/g, " ").trim();
    setMessage("");
    const messageData = {
      sender: {
        name: userData?.name,
        userId: userData?._id,
      },
      date: changeDateFormat(),
      time: getTime(),
      message: trimmedMessage,
      room: room?.room_id,
    };
    socketRef.current?.emit("send-message", messageData);
    setMessages((prevState) => [
      ...prevState,
      {
        sender_name: userData?.name,
        sender_id: userData?._id,
        date: changeDateFormat(),
        time: getTime(),
        message: trimmedMessage,
      },
    ]);
  };

  // setup socket
  useEffect(() => {
    const ENDPOINT = baseURL;
    socketRef.current = socketIOClient(ENDPOINT);
    joinRoom();
    setMessages([]);
    setMessage("");
  }, [room]);

  return (
    <div className="chatPortal">
      <div className="cp-top">
        {showMobileChat && <span onClick={() => removeChatRoom()}>Back</span>}
        <div className="cp-top-info">
          <span className="cp-top-name">{room?.name} Chatroom</span>
        </div>
      </div>
      <div className="cp-mid">
        {messages?.map((message) =>
          message.sender_id === userData?._id ? (
            <UserMessage message={message} />
          ) : (
            <OthersMessage message={message} />
          )
        )}
      </div>
      <div className="cp-btm">
        <form className="cp-btm-inp-container" onSubmit={(e) => sendMessage(e)}>
          <input
            type="text"
            className="cp-btm-inp"
            placeholder="Type a message"
            value={message}
            onChange={(e) => changeMessage(e)}
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
            type="submit"
            endIcon={<SendRounded />}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ChatPortal;

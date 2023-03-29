import { KeyboardArrowLeftOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./chat.css";
import ChatPortal from "./ChatPortal";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import { Api } from "../../Api/Axios";

function Chat() {
  const history = useNavigate();
  // initialising socket
  const [selectedRoom, setSelectedRoom] = useState();
  const [{ userData, loading }, dispatch] = useDataLayerValue();
  const [chatRooms, setChatRooms] = useState([]);

  const changeDateFormat = (rawDate) => {
    const d = new Date(rawDate);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[d.getMonth()];
    const date = d.getDate();
    const year = d.getFullYear();
    return `${month} ${date} , ${year}`;
  };

  const getChatRooms = async () => {
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });

    let upcoming, past, hosted;
    const today = new Date();

    await Api.get("/events/get-user-rooms")
      .then((res) => {
        upcoming = res.data.rooms?.filter(
          (room) => new Date(room.date) >= today
        );
        past = res.data.rooms?.filter((room) => new Date(room.date) < today);
        hosted = res.data.rooms?.filter(
          (room) => room?.host_id === userData?._id
        );
        setChatRooms({ upcoming: upcoming, past: past, hosted: hosted });
      })
      .catch((err) => {
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: {
            message:
              err?.response?.data?.message ||
              "Something went wrong ... please try again",
            type: "error",
          },
        });
      });
    dispatch({
      type: "SET_LOADING",
      loading: false,
    });
  };

  useEffect(() => {
    getChatRooms();
  }, []);

  return (
    <div className="chat">
      <div className="chat-container">
        <div className="chat-left">
          <div className="chat-header-container">
            <div className="chat-back-container" onClick={() => history(-1)}>
              <KeyboardArrowLeftOutlined />
            </div>
            <span>Messages</span>
          </div>
          {chatRooms?.hosted?.length !== 0 && (
            <span className="chat-event-timeline">Hosted events</span>
          )}
          {chatRooms?.hosted?.map((room) => (
            <div
              className="chat-selector"
              key={room?._id}
              onClick={() => setSelectedRoom(room)}
            >
              <div className="chat-op-img"></div>
              <div className="chat-op-info">
                <span className="chat-op-name">{room?.name}</span>
                <div className="chat-op-info-btm">
                  <span>{changeDateFormat(room?.date)}</span>
                  <span>{room?.type}</span>
                </div>
              </div>
            </div>
          ))}
          {chatRooms?.upcoming?.length !== 0 && (
            <span className="chat-event-timeline">Upcoming events</span>
          )}
          {chatRooms?.upcoming?.map((room) => (
            <div
              className="chat-selector"
              key={room?._id}
              onClick={() => setSelectedRoom(room)}
            >
              <div className="chat-op-img"></div>
              <div className="chat-op-info">
                <span className="chat-op-name">{room?.name}</span>
                <div className="chat-op-info-btm">
                  <span>{changeDateFormat(room?.date)}</span>
                  <span>{room?.type}</span>
                </div>
              </div>
            </div>
          ))}
          {chatRooms?.past?.length !== 0 && (
            <span className="chat-event-timeline">Past events</span>
          )}
          {chatRooms?.past?.map((room) => (
            <div
              className="chat-selector"
              key={room?._id}
              onClick={() => setSelectedRoom(room)}
            >
              <div className="chat-op-img"></div>
              <div className="chat-op-info">
                <span className="chat-op-name">{room?.name}</span>
                <div className="chat-op-info-btm">
                  <span>{changeDateFormat(room?.date)}</span>
                  <span>{room?.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-right">
          {selectedRoom && <ChatPortal room={selectedRoom} />}
        </div>
      </div>
    </div>
  );
}

export default Chat;

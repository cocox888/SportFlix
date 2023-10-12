import { KeyboardArrowLeftOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [allChatRooms, setAllChatRooms] = useState([]);
  const [screenWidth, setScreenWidth] = useState(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const urlParams = useParams();
  const navigate = useNavigate();
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
        setAllChatRooms(res.data.rooms);
        upcoming = res.data.rooms?.filter(
          (room) =>
            new Date(room.date) >= today && room?.host_id !== userData?._id
        );
        past = res.data.rooms?.filter(
          (room) =>
            new Date(room.date) < today && room?.host_id !== userData?._id
        );
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

  const selectChatRoom = (room) => {
    window.history.pushState(null, null, `/chat/${room?.room_id}`);
    setSelectedRoom(room);
  };

  const removeChatRoom = () => {
    setSelectedRoom(null);
  };

  const handleWindowResize = () => {
    if (window.innerWidth <= 1000) {
      setShowMobileChat(true);
    } else {
      setShowMobileChat(false);
    }
  };

  useEffect(() => {
    getChatRooms();
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 1000) {
      setShowMobileChat(true);
    } else {
      setShowMobileChat(false);
    }
    window.addEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    const roomId = urlParams?.roomId;
    console.log(roomId);
    if (roomId && roomId !== "") {
      const targetRoom = allChatRooms?.filter(
        (room) => room?.room_id === roomId
      )[0];
      console.log(targetRoom);
      setSelectedRoom(targetRoom);
    }
  }, [allChatRooms]);

  return (
    <div className="chat">
      <div className="chat-container">
        <div className="chat-left">
          {showMobileChat && selectedRoom ? (
            <ChatPortal
              room={selectedRoom}
              showMobileChat={showMobileChat}
              removeChatRoom={removeChatRoom}
            />
          ) : (
            <>
              <div className="chat-header-container">
                <div
                  className="chat-back-container"
                  onClick={() => history(-1)}
                >
                  <KeyboardArrowLeftOutlined />
                </div>
                <span>Messages</span>
              </div>
              <div className="chat-left-container">
                <div className="chat-left-main-container">
                  {" "}
                  {chatRooms?.hosted?.length !== 0 && (
                    <span className="chat-event-timeline">Hosted events</span>
                  )}
                  {chatRooms?.hosted?.map((room) => (
                    <div
                      className="chat-selector"
                      key={room?._id}
                      onClick={() => selectChatRoom(room)}
                    >
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
                      onClick={() => selectChatRoom(room)}
                    >
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
                      onClick={() => selectChatRoom(room)}
                    >
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
              </div>
            </>
          )}
        </div>
        {!showMobileChat && (
          <div className="chat-right">
            {selectedRoom && <ChatPortal room={selectedRoom} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;

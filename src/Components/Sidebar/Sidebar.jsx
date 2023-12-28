import {
  ChatRounded,
  Close,
  ContrastRounded,
  DarkModeRounded,
  HomeRounded,
  Menu,
  NightsStay,
  NightsStayRounded,
  PersonRounded,
  SportsTennis,
  SportsVolleyballRounded,
} from "@mui/icons-material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import "./sidebar.css";
// import { BsChat, BsChatDots, BsHouse } from "react-icons/bs";
// import { BiUser } from "react-icons/bi";
// import { MdOutlineDarkMode, MdSportsTennis } from "react-icons/md";
// import logoImg from "../../../public/logo.jpeg";

function Sidebar() {
  const [selectedOption, setSelectedOption] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarOptions = [
    {
      name: "Home",
      logo: <HomeRounded sx={{ fontSize: "30px" }} />,
      path: "/",
    },
    {
      name: "Registered Events",
      logo: <SportsTennis sx={{ fontSize: "30px" }} />,
      path: "/registered-events",
    },
    {
      name: "Chat",
      logo: <ChatRounded sx={{ fontSize: "30px" }} />,
      path: "/chat",
    },
    {
      name: "Profile",
      logo: <PersonRounded sx={{ fontSize: "30px" }} />,
      path: "/profile",
    },
  ];
  const navigate = useNavigate();
  const [{ homeHidden }, dispatch] = useDataLayerValue();
  const location = useLocation();

  const handleLinkClick = (path) => {
    navigate(path);
    setSidebarOpen(false);
    dispatch({
      type: "SET_HOME_HIDDEN",
      homeHidden: false,
    });
  };

  useEffect(() => {
    const path = location?.pathname;
    if (path?.includes("/chat")) {
      setSelectedOption(2);
    } else if (path?.includes("/profile")) {
      setSelectedOption(3);
    } else if (path?.includes("/registered-events")) {
      setSelectedOption(1);
    } else {
      setSelectedOption(0);
    }
  }, [location]);

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-container">
          <div className="logo" onClick={() => navigate("/")}>
            {/* <SportsVolleyballRounded id="logo-pic" sx={{ fontSize: "30px" }} /> */}
            <img src="/logo.png" id="logo-pic" />
          </div>
          <div className="sidebar-options">
            {sidebarOptions?.map((op, i) => (
              <div
                key={i}
                className={`sidebar-op ${
                  selectedOption === i && "sidebar-selected"
                }`}
                onClick={() => {
                  handleLinkClick(op?.path);
                }}
              >
                {op?.logo}
              </div>
            ))}
          </div>
          <div className="sidebar-dark">
            <ContrastRounded size={26} />
          </div>
        </div>
      </div>

      <div className={`sidebar-mobile ${sidebarOpen && "sidebar-mobile-open"}`}>
        <div className="sidebar-mobile-container">
          <img
            className="sidebar-mobile-icon"
            src="/logo.png"
            onClick={() => navigate("/")}
          />

          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            style={{ display: "flex" }}
            className="sidebar-menu-opener-button"
          >
            {sidebarOpen ? (
              <Close sx={{ fontSize: "28px" }} />
            ) : (
              <Menu sx={{ fontSize: "28px" }} />
            )}
          </button>
        </div>
      </div>
      <div
        className={`sidebar-menu-container ${
          sidebarOpen && "sidebar-menu-container-open"
        }`}
      >
        <div className="sidemar-menu-container-options">
          {sidebarOptions?.map((op, i) => (
            <div
              className="sidemar-menu-container-option"
              key={i}
              onClick={() => {
                handleLinkClick(op?.path);
              }}
            >
              {op?.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Sidebar;

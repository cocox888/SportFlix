import {
  ChatRounded,
  ContrastRounded,
  DarkModeRounded,
  HomeRounded,
  NightsStay,
  NightsStayRounded,
  PersonRounded,
  SportsTennis,
  SportsVolleyballRounded,
} from "@mui/icons-material";
import React from "react";
import "./sidebar.css";
// import { BsChat, BsChatDots, BsHouse } from "react-icons/bs";
// import { BiUser } from "react-icons/bi";
// import { MdOutlineDarkMode, MdSportsTennis } from "react-icons/md";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <div className="logo">
          <SportsVolleyballRounded id="logo-pic" sx={{ fontSize: "30px" }} />
        </div>
        <div className="sidebar-options">
          <div className="sidebar-op sidebar-selected">
            <HomeRounded sx={{ fontSize: "30px" }} />
          </div>
          <div className="sidebar-op">
            <SportsTennis sx={{ fontSize: "30px" }} />
          </div>
          <div className="sidebar-op">
            <ChatRounded sx={{ fontSize: "30px" }} />
          </div>
          <div className="sidebar-op">
            <PersonRounded sx={{ fontSize: "30px" }} />
          </div>
        </div>
        <div className="sidebar-dark">
          <ContrastRounded size={26} />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

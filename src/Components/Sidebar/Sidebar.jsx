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
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import "./sidebar.css";
// import { BsChat, BsChatDots, BsHouse } from "react-icons/bs";
// import { BiUser } from "react-icons/bi";
// import { MdOutlineDarkMode, MdSportsTennis } from "react-icons/md";

function Sidebar() {
  const [selectedOption, setSelectedOption] = useState(0);
  const sidebarOptions = [
    {
      name: "Home",
      logo: <HomeRounded sx={{ fontSize: "30px" }} />,
      path: "/",
    },
    {
      name: "Registered sports",
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
  const [dispatch] = useDataLayerValue();
  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <div className="logo" onClick={() => navigate("/")}>
          <SportsVolleyballRounded id="logo-pic" sx={{ fontSize: "30px" }} />
        </div>
        <div className="sidebar-options">
          {sidebarOptions?.map((op, i) => (
            <div
              key={i}
              className={`sidebar-op ${
                selectedOption === i && "sidebar-selected"
              }`}
              onClick={() => {
                setSelectedOption(i);
                navigate(op.path);
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
  );
}

export default Sidebar;

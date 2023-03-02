import {
  ArrowForwardRounded,
  KeyboardArrowLeftOutlined,
  ModeEditRounded,
} from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { resetApiHeaders } from "../../Api/Axios";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import "./Profile.css";

function Profile() {
  const [{ loading, loggedIn, userData }, dispatch] = useDataLayerValue();
  const navigate = useNavigate();

  const changeDateFormat = (__date) => {
    const d = new Date(__date);
    let date = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    if (date < 10) {
      date = `0${date}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }
    return `${date}-${month}-${year}`;
  };

  const logoutFunc = () => {
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    localStorage.removeItem("AUTH_TOKEN");
    resetApiHeaders("");
    dispatch({
      type: "SET_LOGIN_STATUS",
      loggedIn: false,
    });
    dispatch({
      type: "SET_USER_DATA",
      loggedIn: {},
    });
    dispatch({
      type: "SET_LOADING",
      loading: false,
    });
    navigate("/");
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-header-container">
          <div className="profile-back-container" onClick={() => navigate("/")}>
            <KeyboardArrowLeftOutlined />
          </div>
          <span>My Profile</span>
        </div>
        <div className="profile-main-container">
          <div className="profile-top">
            <div className="profile-picture-container">
              <ModeEditRounded
                sx={{
                  fontSize: "15px",
                  background: "rgba(0,0,0,0.5)",
                  padding: "3px",
                  borderRadius: "50%",
                }}
                className="profile-picture-edit-btn"
              />
            </div>
            <div className="profile-top-info">
              <span>{userData?.name}</span>
              <span>{userData?.age}</span>
            </div>
          </div>

          <div className="profile-box profile-mid">
            <div className="profile-mid-container">
              <div className="profile-info-container">
                <div className="profile-mid-info">
                  <div className="profile-field-name">Display Name</div>
                  <div className="profile-field-value">
                    <span>{userData?.name}</span>
                    <button>Edit</button>
                  </div>
                </div>
                <div className="profile-mid-info">
                  <div className="profile-field-name">Date of birth</div>
                  <div className="profile-field-value">
                    <span>{changeDateFormat(userData?.dob)}</span>
                    <button>Edit</button>
                  </div>
                </div>
                <div className="profile-mid-info">
                  <div className="profile-field-name">Email</div>
                  <div className="profile-field-value">
                    <span>{userData?.email}</span>
                    <button>Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-bottom">
            <div className="profile-bottom-main-container">
              <div className="profile-field-name">Registered events</div>
              <div className="profile-field-value">
                {userData?.events ? userData?.events?.length : 0}
              </div>
            </div>
            <div
              className="profile-bottom-more"
              onClick={() => navigate("/registered-events")}
            >
              <span>See All Participated Events</span>
              <ArrowForwardRounded sx={{ fontSize: "17px" }} />
            </div>
          </div>

          <div
            className="profile-logout"
            onClick={() => {
              logoutFunc();
            }}
          >
            <span>Sign out</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

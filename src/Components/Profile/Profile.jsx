import {
  ArrowForwardRounded,
  KeyboardArrowLeftOutlined,
  ModeEditRounded,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api, resetApiHeaders } from "../../Api/Axios";
import { useDataLayerValue } from "../../Datalayer/DataLayer";
import "./Profile.css";

function Profile() {
  const [{ loading, loggedIn, userData }, dispatch] = useDataLayerValue();
  const navigate = useNavigate();
  const history = useNavigate();
  const [editing, setEditing] = useState(false);
  const [previousInfo, setPreviousInfo] = useState({});
  const [infoToShow, setInfoToShow] = useState({});

  const calculateAge = (dob) => {
    // birthday is a date
    var ageDifMs = Date.now() - new Date(dob);
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

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
    return `${year}-${month}-${date}`;
  };

  const changeUserData = (e) => {
    const { id, value } = e.target;
    setInfoToShow((prevState) => ({ ...prevState, [id]: value }));
  };

  const cancelEditing = () => {
    setEditing(false);
    setInfoToShow(previousInfo);
  };
  const saveEditing = async () => {
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    setEditing(false);
    await Api.post("/auth/changeDetails", infoToShow)
      .then((res) => {
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: { message: res.data?.message, type: "success" },
        });
        userData.name = infoToShow.name;
        userData.dob = infoToShow.dob;
        dispatch({
          type: "SET_USER_DATA",
          userData: userData,
        });
        setPreviousInfo(infoToShow);
      })
      .catch((err) => {
        setInfoToShow(previousInfo);
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: {
            message: err?.response?.data?.message,
            type: "error",
          },
        });
      });
    dispatch({
      type: "SET_LOADING",
      loading: false,
    });
  };

  const logoutFunc = () => {
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    localStorage.removeItem("AUTH_TOKEN");
    dispatch({
      type: "SET_LOGIN_STATUS",
      loggedIn: false,
    });
    dispatch({
      type: "SET_USER_DATA",
      userData: {},
    });
    dispatch({
      type: "SET_LOADING",
      loading: false,
    });
    resetApiHeaders("");
    navigate("/");
  };

  const loadUserData = async () => {
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    const token = localStorage.getItem("AUTH_TOKEN");
    // console.log(token);
    if (token) {
      await Api.get("/auth/getUser")
        .then((res) => {
          dispatch({
            type: "SET_USER_DATA",
            userData: res?.data?.user,
          });
          dispatch({
            type: "SET_LOGIN_STATUS",
            loggedIn: true,
          });
        })
        .catch((err) => {
          localStorage.removeItem("AUTH_TOKEN");
          dispatch({
            type: "SET_LOGIN_STATUS",
            loggedIn: false,
          });
          dispatch({
            type: "SET_USER_DATA",
            userData: {},
          });
        });
    } else {
      dispatch({
        type: "SET_LOGIN_STATUS",
        loggedIn: false,
      });
    }
    dispatch({
      type: "SET_LOADING",
      loading: false,
    });
  };

  useEffect(() => {
    if (loggedIn) {
      loadUserData();
    } else {
      navigate("/");
    }
  }, [loggedIn]);

  useEffect(() => {
    setPreviousInfo({
      name: userData?.name,
      dob: userData?.dob,
      email: userData?.email,
    });
    setInfoToShow({
      name: userData?.name,
      dob: userData?.dob,
      email: userData?.email,
    });
  }, [userData]);

  useEffect(() => {
    document.title = "Profile - SportFlix";
  }, []);
  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-header-container">
          <div className="profile-back-container" onClick={() => history(-1)}>
            <KeyboardArrowLeftOutlined />
          </div>
          <span>My Profile</span>
        </div>
        <div className="profile-main-container">
          <div className="profile-top">
            <div className="profile-picture-container">
              <img src={userData?.picture} alt="" />
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
              <span>{infoToShow?.name}</span>
              <span>
                {infoToShow?.dob && `Age ${calculateAge(infoToShow?.dob)}`}
              </span>
            </div>
          </div>

          <div className="profile-box profile-mid">
            <div className="profile-mid-container">
              {!editing ? (
                <div className="profile-edit-wrapper">
                  <button
                    className="profile-edit-btn"
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <>
                  <div className="profile-edit-wrapper">
                    <button
                      className="profile-edit-btn"
                      onClick={() => cancelEditing()}
                    >
                      Cancel
                    </button>
                    <button
                      className="profile-edit-btn"
                      onClick={() => saveEditing()}
                    >
                      Save
                    </button>
                  </div>
                </>
              )}

              <div className="profile-info-container">
                <div className="profile-mid-info">
                  <div className="profile-field-name">Display Name</div>
                  <div className="profile-field-value">
                    <input
                      type="text"
                      id="name"
                      value={infoToShow?.name}
                      disabled={!editing}
                      onChange={(e) => changeUserData(e)}
                    />
                  </div>
                </div>
                <div className="profile-mid-info">
                  <div className="profile-field-name">Date of birth</div>
                  <div className="profile-field-value">
                    <input
                      type="date"
                      id="dob"
                      value={
                        infoToShow?.dob
                          ? changeDateFormat(infoToShow?.dob)
                          : undefined
                      }
                      disabled={!editing}
                      onChange={(e) => changeUserData(e)}
                    />
                  </div>
                </div>
                <div className="profile-mid-info">
                  <div className="profile-field-name">Email</div>
                  <div className="profile-field-value">
                    <input
                      type="text"
                      defaultValue={userData?.email}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-bottom">
            <div className="profile-bottom-main-container">
              <div className="profile-field">
                <div className="profile-field-name">Events registered</div>
                <div className="profile-field-value">
                  {userData?.events ? userData?.events?.length : 0}
                </div>
              </div>
              <div className="profile-field">
                <div className="profile-field-name">Events hosted</div>
                <div className="profile-field-value">
                  {userData?.events_hosted
                    ? userData?.events_hosted?.length
                    : 0}
                </div>
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

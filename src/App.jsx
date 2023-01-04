import logo from "./logo.svg";
import "./App.css";
import Home from "./Components/Home/Home";
import Sidebar from "./Components/Sidebar/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventListing from "./Components/EventListing/EventListing";
import HomeDock from "./Components/Home/HomeDock";
import Event from "./Components/Event/Event";
import img1 from "./Common resources/img1.jpg"
import img2 from "./Common resources/img2.png"
import Profile from "./Components/Profile/Profile";

function App() {

  const eventList =
    [
      {
        id: "event1",
        host: "Ayanabha Misra",
        type: "cricket",
        location: "DSA Stadium, South Baluchar, Malda, West Bengal",
        coordinates: [24.997936889216756, 88.14851917039425],
        date: "24th Dec",
        peopleJoined: 10
      },
      {
        id: "event2",
        host: "Ayanabha Misra",
        type: "football",
        location: "Brindabani Maidan",
        coordinates: [24.99761222867918, 88.14528246392283],
        date: "24th Dec",
        peopleJoined: 10
      },
      {
        id: "event3",
        host: "Ayanabha Misra",
        type: "badminton",
        location: "Malda College Ground",
        coordinates: [25.00175881167985, 88.13757176967077],
        date: "24th Dec",
        peopleJoined: 10
      },
    ]
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home eventList={eventList} />} >
            <Route index element={<EventListing eventList={eventList} />} />
            <Route path="event/:id" element={<Event eventList={eventList} />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<EventListing eventList={eventList} />} />
          </Route>
        </Routes>
      </Router>
    </div >
  );
}

export default App;

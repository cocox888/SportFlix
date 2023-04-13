const router = require("express").Router();
const bcrypt = require("bcrypt");
const ChatModel = require("../Model/ChatModel");
const EventModel = require("../Model/EventModel");
const UserModel = require("../Model/UserModel");
const validateUser = require("./validateUser");

const changeDateFormat = (rawDate) => {
  const d = new Date(rawDate);
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

// Route for adding event
router.post("/add-event", validateUser, async (req, res) => {
  let incomingData = req.body;
  const userId = req.body.userId;
  const eventDate = new Date(incomingData?.date);
  const currDate = new Date();
  if (currDate > eventDate) {
    res.status(400).send({ message: "Cannot add event in the past" });
    return;
  }
  incomingData.host_id = userId;
  incomingData.loc = {
    type: "Point",
    coordinates: [incomingData.latitude, incomingData.longitude],
  };

  const eventData = new EventModel(req.body);
  try {
    const newEvent = await eventData.save();
    await UserModel.updateOne(
      { _id: userId },
      { $push: { events: newEvent?._id, events_hosted: newEvent?._id } }
    );
    const newChatRoom = await ChatModel({
      room_id: newEvent?._id,
      name: newEvent?.location,
      date: newEvent?.date,
      type: newEvent?.type,
      host_id: newEvent?.host_id,
      participants: [userId],
      messages: [],
    });
    await newChatRoom.save();
    res.send({ event: newEvent, message: "New event added" });
  } catch (err) {
    res.send(err);
  }
});

// Route for getting nearest events using coordinates
router.get("/get-nearest-events", async (req, res) => {
  try {
    const lat = req.query.lat;
    const lng = req.query.lng;
    const allEvents = await EventModel.find();
    const nearestEvents = await EventModel.find({
      loc: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lat, lng],
          },
          $maxDistance: 50000, //Radius - 5KM
          $minDistance: 0,
        },
      },
    });
    res.send({
      allEvents: allEvents,
      nearestEvents: nearestEvents,
      message: "success",
    });
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

// route to get all hosted events

router.get("/get-hosted-events", validateUser, async (req, res) => {
  try {
    const userId = req.body?.userId;
    const hostedEvents = await EventModel.find({ host_id: userId });
    res.send({ hostedEvents: hostedEvents, message: "success" });
  } catch (err) {
    res.status(400).send({ message: "Event not found" });
  }
});

// route to get event by id

router.get("/get-event-by-id", async (req, res) => {
  try {
    const eventId = req.query.eventId;
    const event = await EventModel.findOne({ _id: eventId });
    res.send({ event: event, message: "success" });
  } catch (err) {
    res.status(400).send({ message: "Event not found" });
  }
});

// route to get user's registered events

router.get("/get-registered-events", validateUser, async (req, res) => {
  try {
    const userId = req.query.userId;
    const regEvents = await EventModel.find({
      participants: { $in: [userId] },
    });
    res.send({ events: regEvents, message: "success" });
  } catch (err) {
    res.status(400).send({ message: "No registered event found" });
  }
});

// route to join event

router.post("/join-event", validateUser, async (req, res) => {
  try {
    const eventId = req.body?.eventId;
    const userId = req.body?.userId;
    const targetEvent = await EventModel.findOne({ _id: eventId });
    const date_of_reg = new Date();
    const eventDate = new Date(targetEvent?.date);
    const user = await UserModel.findOne({ _id: userId });
    if (targetEvent?.min_age && user.age < targetEvent?.min_age) {
      res.status(400).send({
        message: `You need to be older than ${targetEvent?.min_age} years to register to this event`,
      });
      return;
    }
    if (date_of_reg < eventDate) {
      if (targetEvent?.participants?.length < targetEvent?.max_players) {
        // check if user is already registered
        const userExists = await EventModel.count({
          _id: eventId,
          participants: { $in: [userId] },
        });
        if (userExists === 0) {
          await EventModel.updateOne(
            { _id: eventId },
            { $push: { participants: userId } }
          );
          await UserModel.updateOne(
            { _id: userId },
            {
              $push: { events: eventId },
            }
          );
          await ChatModel.updateOne(
            { room_id: eventId },
            {
              $push: { participants: userId },
            }
          );

          res.send({ message: "Registered to event successfully" });
        } else {
          res.status(400).send({ message: "You are already registered" });
        }
      } else {
        res
          .status(400)
          .send({ message: "Cannot register ... no slot remaining" });
      }
    } else {
      res
        .status(400)
        .send({ message: "Cannot register ... registration over" });
    }
  } catch (err) {
    res
      .status(400)
      .send({ message: "Something went wrong ... please try again" });
  }
});

// route to get rooms user joined in

router.get("/get-user-rooms", validateUser, async (req, res) => {
  try {
    const userId = req.query.userId;
    const rooms = await ChatModel.find({
      participants: { $in: [userId] },
    });
    res.send({ rooms: rooms, message: "success" });
  } catch (err) {
    res.status(400).send({ message: "No registered event found" });
  }
});

let currentRoom;

io.on("connection", (socket) => {
  socket.on("join-room", async (room, cb) => {
    if (currentRoom) {
      socket.leave(room);
    }
    const roomInfo = await ChatModel.findOne({ room_id: room });
    cb({
      roomInfo: roomInfo,
    });
    socket.join(room);
    currentRoom = room;
  });

  socket.on("send-message", async (data) => {
    const room = data.room;
    const newChat = {
      sender_name: data.sender.name,
      sender_id: data.sender.userId,
      date: data.date,
      time: data.time,
      message: data.message,
    };
    socket.broadcast.to(room).emit("receive-message", newChat);
    try {
      await ChatModel.updateOne(
        { room_id: room },
        { $push: { messages: newChat } }
      );
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = router;

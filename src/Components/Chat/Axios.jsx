import axios from "axios";

const Api = axios.create({
  baseURL: "http://13.127.162.51:3001/api/v1",
  headers: { Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}` },
});

const resetApiHeaders = (token) => {
  if (token === "") {
    delete Api.defaults.headers.common["Authorization"];
  }
  localStorage.setItem("AUTH_TOKEN", token);
  Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export { Api, resetApiHeaders };

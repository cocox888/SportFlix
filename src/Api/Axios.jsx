import axios from "axios";

export const Api = axios.create({
  baseURL: "http://172.31.13.95:3001/api/v1",
  headers: { Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}` },
});

export const resetApiHeaders = (token) => {
  if (token === "") {
    delete Api.defaults.headers.common["Authorization"];
  }
  Api.defaults.headers.common["Authorization"] = localStorage.getItem(token);
};

import axios from "axios";

let Api = axios.create({
  baseURL: "http://localhost:3001/api/v1",
  headers: { Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}` },
});

let resetApiHeaders = (token) => {
  if (token === "") {
    axios.defaults.headers.common["Authorization"] = null;
  }
  Api = axios.create({
    baseURL: "http://localhost:3001/api/v1",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export { Api, resetApiHeaders };

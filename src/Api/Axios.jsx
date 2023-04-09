import axios from "axios";
const baseURL = process.env.REACT_APP_BASEURL;

let Api = axios.create({
  baseURL: baseURL,
  headers: { Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}` },
});

let resetApiHeaders = (token) => {
  if (token === "") {
    axios.defaults.headers.common["Authorization"] = null;
  }
  Api = axios.create({
    baseURL: baseURL,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export { Api, resetApiHeaders };

import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:9999/server",
  headers: {
    "Content-Type": "application/json",
  },
});

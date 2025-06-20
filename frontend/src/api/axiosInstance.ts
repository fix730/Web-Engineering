import axios from "axios";
import qs from "qs";

// Create an Axios instance with default options
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  //angepasst das post/search funktioniert
  paramsSerializer: {
    serialize: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
  },
});
export default axiosInstance;

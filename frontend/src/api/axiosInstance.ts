import axios, { AxiosError } from "axios";
import qs from "qs";
import store from "../store";
import EventEmitter from 'events';
import { isRejectedWithValue } from "@reduxjs/toolkit";
// import { setAuthError } from "../slices/authSlice";
export const authEventEmitter = new EventEmitter();

// const dispatch = useAppDispatch();
// const navigate = useNavigate();


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


//Antworten Abfangen
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    // Prüfen, ob der Fehler ein 401 (Unauthorized) ist
    //Wenn ja dann Ausolggen
    if (error.response && error.response.status === 401) {
      console.warn("401 Unauthorized – Sitzung abgelaufen. Melde an globales System.");

      // Ausslloggen
      try {
        await axiosInstance.post("api/auth/logout", {});
        localStorage.removeItem("userInfo");
        alert("Ihre Sitzung ist abgelaufen, sie werden Ausgeloggt");
        // Weiterleitung zur Login-Seite
        window.location.href = "/login"; // oder deine Login-Route

        return;
      } catch (err) {
        const error = err as AxiosError;
        if (error.response) {
          return console.log(error.response);
        }
        return  console.log({ message: error.message || "Ein unbekannter Logout-Fehler ist aufgetreten." });

      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

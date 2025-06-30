import axios from "axios";
import qs from "qs";
import store from "../store";
import EventEmitter from 'events';
// import { setAuthError } from "../slices/authSlice";
export const authEventEmitter = new EventEmitter();

// const dispatch = useAppDispatch();
// const navigate = useNavigate();


// Create an Axios instance with default options
const  axiosInstance = axios.create({
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
    if (error.response && error.response.status === 401) {
      console.warn("401 Unauthorized – Sitzung abgelaufen. Melde an globales System.");
      // store.dispatch(setAuthError("Sitzung abgelaufen. Bitte erneut anmelden."));

      // Fehler speichern
      return Promise.reject({ ...error, message: "Sitzung abgelaufen. Bitte erneut anmelden." });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

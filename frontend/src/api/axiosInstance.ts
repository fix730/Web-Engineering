import axios from "axios";
import qs from "qs";
import store from "../store";
import { logout } from "../slices/authSlice";
import { useAppDispatch } from "../hooks/redux-hooks";
import { useNavigate } from "react-router-dom";



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
// axiosInstance.interceptors.response.use(function (response) {
//   return response;
// }, async function (error) {
//   alert("Me: " + error.message);
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   //Wenn Benutzer nicht Authentiert ist
  
//   if (error.response && error.response.status === 401) {
//     const errorMessage = error.response.data?.message;
    
//     if (errorMessage == "Not authenticated: No token provided") {
//       console.warn("Token abgelaufen oder ungültig. Automatische Abmeldung...");
//       try {
//         await dispatch(logout()).unwrap();
//         navigate("/logout");
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   }
// });

export default axiosInstance;

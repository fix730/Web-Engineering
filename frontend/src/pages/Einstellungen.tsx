import { useNavigate } from "react-router-dom";
import { useAppDispatch} from "../hooks/redux-hooks";
import { useEffect } from "react";
import { getUser, logout } from "../slices/authSlice";
import axiosInstance from "../api/axiosInstance";
import Header from "./components/Header/Header";


function Einstellungen() {

    const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-center text-3xl font-bold text-gray-700">Einstellungen</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default Einstellungen;

import { useNavigate } from "react-router-dom";
import { useAppDispatch} from "../hooks/redux-hooks";
import { useEffect } from "react";
import { getUser, logout } from "../slices/authSlice";
import axiosInstance from "../api/axiosInstance";

function Home() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const callProtectedRoute = async () => {
        try {
            const response = await axiosInstance.get("/api/protected");
            console.log("Protected content:", response.data);
        } catch (error: any) {
            console.error("Zugriff verweigert:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        callProtectedRoute();
    }, []);

    const goToLogin = () => {
        navigate("/login");
    };
    const goToRegister = () => {
        navigate("/register");
    };
    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            navigate("/logout");
        } catch (e) {
            console.error(e);
        }
    };
      return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4">
      <h1 className="text-5xl font-bold text-indigo-600 mb-6 text-center">
        Willkommen zu unserer Webseite!
      </h1>

      <p className="text-gray-600 text-lg text-center max-w-md mb-10">
        Bottext
      </p>

      <div className="flex gap-4">
        <button
          onClick={goToLogin}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Login
        </button>
        <button
          onClick={goToRegister}
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition"
        >
          Registrieren
        </button>
      </div>
    </div>
  );
}
export default Home;
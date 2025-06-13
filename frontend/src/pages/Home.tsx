import { useNavigate } from "react-router-dom";
import { useAppDispatch} from "../hooks/redux-hooks";
import { useEffect } from "react";
import { getUser, logout } from "../slices/authSlice";
import axiosInstance from "../api/axiosInstance";
import Header from "./components/Header/Header";

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

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            navigate("/logout");
        } catch (e) {
            console.error(e);
        }
    };
    return (
        <>
            <Header />	
            <h1 className="text-4xl text-blue-600 font-bold">Tailwind funktioniert 🎉</h1>
            <h1>Home</h1>
            <h4>Name: {localStorage.getItem("userInfo") + " "}</h4>
            <button onClick={handleLogout}>
                Logout
            </button>
        </>
    )
}
export default Home;
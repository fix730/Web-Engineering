import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { useEffect } from "react";
import { getUser, logout } from "../slices/authSlice";

function Home() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);
    const userProfileInfo = useAppSelector((state) => state.auth.userProfileData);

    useEffect(() => {
        if (basicUserInfo) {
            dispatch(getUser(basicUserInfo.id));
        }
    }, [basicUserInfo]);

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            navigate("api/auth/logout");
        } catch (e) {
            console.error(e);
        }
    };
    return (
        <>
            <h1>Home</h1>
            <h4>Name: {userProfileInfo?.name}</h4>
            <h4>Email: {userProfileInfo?.email}</h4>
            <button onClick={handleLogout}>
                Logout
            </button>
        </>
    )
}
export default Home;
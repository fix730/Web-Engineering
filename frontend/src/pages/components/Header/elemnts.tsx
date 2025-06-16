<<<<<<< HEAD
import { useEffect, useState } from "react";
=======
import { useState } from "react";
>>>>>>> 8a770448267c5098bb9741b8e948a58465c2ccf4
import { NavigationLink } from "./compnents";
import { logout } from "../../../slices/authSlice";
import profile from "../../../icons/user.png";
import settingIcon from "../../../icons/setting.png";
import logoutIcon from "../../../icons/logout.png";
<<<<<<< HEAD
import axiosInstance from "../../../api/axiosInstance";
import { useAppDispatch } from "../../../hooks/redux-hooks";
import { useNavigate } from "react-router-dom";
import Settings from "../../../Pop-Up-Window/Settings";
=======
>>>>>>> 8a770448267c5098bb9741b8e948a58465c2ccf4

type AllNavigationLinksProps = {
    className?: string;
};

export const AllNavigationLinks = ({ className }: AllNavigationLinksProps) => {
    return (
        <>
            <NavigationLink href="/" className={className}>Start</NavigationLink>
            <NavigationLink href="/posts" className={className}>meine Posts</NavigationLink>
            <NavigationLink href="/posts/new" className={className}>neuen Post hinzufügen</NavigationLink>
        </>
    );
};

export const ProfileMenu = () => {
    const [open, setOpen] = useState(false);
<<<<<<< HEAD
    const [isOpenSettings, setIsOpenSettings] = useState(false);
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
=======

    return (
>>>>>>> 8a770448267c5098bb9741b8e948a58465c2ccf4
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
                <img
                    src={profile} alt="Profil" className="w-full h-full object-cover" />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
<<<<<<< HEAD
                    <button onClick={()=>setIsOpenSettings(true)} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
=======
                    <a href="/einstellungen" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
>>>>>>> 8a770448267c5098bb9741b8e948a58465c2ccf4
                        <div className="flex items-center space-x-2"> {/* flex-Container für horizontale Anordnung */}
                            <img src={settingIcon} className="w-5 h-5" />
                            <span>Einstellungen</span>
                        </div>
<<<<<<< HEAD
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
=======
                    </a>
                    <button onClick={() => logout()} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
>>>>>>> 8a770448267c5098bb9741b8e948a58465c2ccf4
                        <div className="flex items-center space-x-2">
                            <img src={logoutIcon} className="w-5 h-5" />
                            <span>Logout</span>
                        </div>
                    </button>
                </div>
            )}
        </div>
<<<<<<< HEAD
        <Settings open={isOpenSettings} isOpen={() => setIsOpenSettings(false)} />
    </>
    );
};

=======
    );
};
>>>>>>> 8a770448267c5098bb9741b8e948a58465c2ccf4

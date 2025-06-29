import { useEffect, useState } from "react";
import { NavigationLink } from "./compnents";
import { logout } from "../../../slices/authSlice";
import profilePlaceholder from "../../../icons/user.png";
import settingIcon from "../../../icons/setting.png";
import logoutIcon from "../../../icons/logout.png";
import axiosInstance from "../../../api/axiosInstance";
import { useAppDispatch } from "../../../hooks/redux-hooks";
import { useNavigate } from "react-router-dom";
import Settings from "../../../Pop-Up-Window/Settings";
import { fetchProfileImage } from "../../../utils/image";

type AllNavigationLinksProps = {
    className?: string;
};

export const AllNavigationLinks = ({ className }: AllNavigationLinksProps) => {
    return (
        <>
            <NavigationLink href="/" className={className}>Start</NavigationLink>
            <NavigationLink href="/posts" className={className}>Meine Posts</NavigationLink>
            <NavigationLink href="/posts/new" className={className}>Neuen Post hinzufügen</NavigationLink>
            <NavigationLink href="/calendar"  className={className}>Kalender</NavigationLink>
     

        </>
    );
};

interface UserInfo {
    iduser: number;
    name: string;
    firstName: string;
    birthday: string;
    passwort: string;
    email: string;
    image_idimage: number;
}



export const ProfileMenu = () => {
    const [open, setOpen] = useState(false);
    // Hier speichern wir die ID des Bildes, die aus localStorage gelesen wird
    const [userImageId, setUserImageId] = useState<number | null>(null);
    // Hier speichern wir die URL des Profilbilds, die wir anzeigen werden
    const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(profilePlaceholder);
    const [isOpenSettings, setIsOpenSettings] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    

    // useEffect zum Laden der Benutzerinformationen und des Profilbilds
    useEffect(() => {
        const loadUserInfoAndImage = () => {
            const userInfoString = localStorage.getItem("userInfo");
            if (userInfoString) {
                try {
                    const userInfo: UserInfo = JSON.parse(userInfoString);
                    if (userInfo.image_idimage) {
                        setUserImageId(userInfo.image_idimage); // Setzt die Bild-ID im State
                        fetchProfileImage({onSetImageUrl: setProfileImageUrl , imageId:userInfo.image_idimage, profilePlaceholder: profilePlaceholder}); // Lädt das Bild vom Backend
                    } else {
                        setProfileImageUrl(profilePlaceholder);
                        setUserImageId(null);
                    }
                } catch (error) {
                    console.error("Fehler beim Parsen von userInfo aus localStorage:", error);
                    setProfileImageUrl(profilePlaceholder);
                    setUserImageId(null);
                }
            } else {
                setProfileImageUrl(profilePlaceholder);
                setUserImageId(null);
            }
        };

        loadUserInfoAndImage();

        window.addEventListener('localStorageChange', loadUserInfoAndImage); // Ein Custom Event, falls Sie es senden

        return () => {

            if (profileImageUrl && profileImageUrl !== profilePlaceholder) {
                URL.revokeObjectURL(profileImageUrl);
            }
            window.removeEventListener('localStorageChange', loadUserInfoAndImage);
        };
    }, []);

    // Callback-Funktion für das Settings-Modal, um die imageId zu aktualisieren
    const handleImageUploadSuccess = (newImageId: number) => {
        setUserImageId(newImageId); // Aktualisiert die Bild-ID im State
        fetchProfileImage({onSetImageUrl: setProfileImageUrl , imageId:newImageId, profilePlaceholder: profilePlaceholder}); // Lädt das neue Bild sofort 
        const userInfoString = localStorage.getItem("userInfo");
        if (userInfoString) {
            try {
                const userInfo: UserInfo = JSON.parse(userInfoString);
                userInfo.image_idimage = newImageId;
                localStorage.setItem("userInfo", JSON.stringify(userInfo));
            } catch (error) {
                console.error("Fehler beim Aktualisieren von userInfo im localStorage nach Bild-Upload:", error);
            }
        }
    };


    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            navigate("/login");
            axiosInstance.post("/api/auth/logout")
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <div className="relative">
                <button
                    onClick={() => setOpen(!open)}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
                    <img
                        src={profileImageUrl}
                        alt="Profilbild"
                        className="w-full h-full object-cover"
                    />
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                        <button onClick={() => setIsOpenSettings(true)} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                            <div className="flex items-center space-x-2">
                                <img src={settingIcon} className="w-5 h-5" alt="Einstellungen" />
                                <span>Einstellungen</span>
                            </div>
                        </button>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                            <div className="flex items-center space-x-2">
                                <img src={logoutIcon} className="w-5 h-5" alt="Logout" />
                                <span>Logout</span>
                            </div>
                        </button>
                    </div>
                )}
            </div>
            <Settings
                open={isOpenSettings}
                isOpen={() => setIsOpenSettings(false)}
                currentImageId={userImageId}
                onImageUploadSuccess={handleImageUploadSuccess}
            />
        </>
    );
};

"use client";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux-hooks";
import React from "react";
import { useEffect, useState } from "react";
import { getUser, logout } from "../slices/authSlice";
import axiosInstance from "../api/axiosInstance";
import Header from "./components/Header/Header";
import { SearchBar } from "./components/SearchBar/SearchBar";
import DialogAlert from "../Pop-Up-Window/alert";
import Post from "./components/Post/Post";


function Home() {
    const [isOpenAlertDialog, setIsOpenAlertDialog] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();


    // Erstmal wirklich nur dummy posts ohne wirklichen Inhalt oder Backend nur zum Fühlen
    const dummyPosts = [
        {
            id: 1,
            title: "Sonnenuntergang am Seweewew",
            description: "Wunderschöner Sonnenuntergang am nächsten Seweewe",
            location: "München",
            imageUrl: "https://ih1.redbubble.net/image.4665578724.8271/raf,360x360,075,t,fafafa:ca443f4786.jpg",
        },
        {
            id: 2,
            title: "Städtetrip nach Berlin",
            description: "Cooler Trip mit vielen Sehenswürdigkeiten",
    location: "Berlin",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1XrdeEkDoqLOfAoDB5ZqEeVxZ4PS6D1qV_g&s",
  },
  {
    id: 3,
    title: "Wanderung in den Alpen",
    description: "Natur pur und frische Luft",
    location: "Alpen",
    imageUrl: "https://www.comingsoon.net/wp-content/uploads/sites/3/2025/05/Johnny-Dang-Net-Worth-2025How-Much-Money-Does-He-Make.jpg",
    },


    ];
    const [currentPost, setCurrentPost] = useState<any>(null);
    
    
    ;
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
        <>
            <Header />
            <SearchBar />

            <h1 className="text-4xl text-blue-600 font-bold">Tailwind funktioniert 🎉</h1>
            <h1>Home</h1>
            <h4>Name: {localStorage.getItem("userInfo") + " "}</h4>
            <button onClick={handleLogout}>
                Logout
            </button>
            <button onClick={() => setIsOpenAlertDialog(true)}>
                Test Pop-Up
            </button>
            <DialogAlert
                open={isOpenAlertDialog}
                isOpen={() => setIsOpenAlertDialog(false)}
                header="Info"
                content="Dies ist ein einfaches Pop-up-Fenster."
                buttonText="Schließen"
            />
    <Header />

    {dummyPosts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onClick={() => setCurrentPost(post)} // Klick auf Post öffnet Modal
            />
    ))}
    {/* Für das Anschauen von den Posts / draufclicken */}
    {currentPost && (
      <div

        className="fixed inset-0 pady-5 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={() => setCurrentPost(null)} // Klick auf Overlay schließt Modal
      >
        <div
          className="bg-white p-4 rounded-lg max-w-md mx-auto"
          onClick={(e) => e.stopPropagation()} // Klick im Modal nicht schließen
        >
          <h2 className="text-xl font-bold">{currentPost.title}</h2>
          <p>{currentPost.description}</p>
          <p className="text-gray-500">Location: {currentPost.location}</p>
          <img
            src={currentPost.imageUrl}
            alt={currentPost.title}
            className="w-2/3 object-cover mt-4"
          />
          <button
            onClick={() => setCurrentPost(null)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    )}
  </>
    )
}
export default Home;
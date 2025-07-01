"use client";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux-hooks";
import React from "react";
import { useEffect, useState } from "react";
import { logout } from "../slices/authSlice";
import axiosInstance from "../api/axiosInstance";
import Header from "./components/Header/Header";
import { SearchBar } from "./components/SearchBar/SearchBar";
import DialogAlert from "../Pop-Up-Window/alert";
import Post, { PostType } from "./components/Post/Post";
import Comment from "./components/Comment/CommentSocial";
import Footer from "./components/Footer/Footer";
import PostClicked from "./components/Post/PostClicked";
import PostLikes from "./components/Post/PostLikes"

function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostType[]>([]);

  console.log("Posts:", posts);

  

  // const dummyUSer = [
  //   {
  //     iduser: 123,
  //     name: "Klaus Schwab",
  //     firstName: "Klaus",
  //     image_idimage: 123,
  //     profileImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7s3fqLo-RhkovR9huKwI9-QXsPCi2LcTbnQ&s", // Falls Bild-URL kommt, sonst musst du es separat holen
  //   }

  // ];
  // const dummyComment = [
  //   {
  //     idcomment: 123,
  //     text: "Colles Bild",
  //     date: "string", // Oder Date, wenn du willst kannst du in Date umwandeln
  //     commentcol: null,
  //     user_iduser: 23,
  //     post_idpost: 123,
  //     user: dummyUSer[0],

  //   },


  // ];

  // // Erstmal wirklich nur dummy posts ohne wirklichen Inhalt oder Backend nur zum Fühlen
  // const dummyPosts = [
  //   {
  //     id: 1,
  //     title: "Sonnenuntergang am Seweewew",
  //     description: "Wunderschöner Sonnenuntergang am nächsten Seweewe",
  //     location: "München",
  //     imageUrl: "https://ih1.redbubble.net/image.4665578724.8271/raf,360x360,075,t,fafafa:ca443f4786.jpg",
  //   },
  //   {
  //     id: 2,
  //     title: "Städtetrip nach Berlin",
  //     description: "Cooler Trip mit vielen Sehenswürdigkeiten",
  //     location: "Berlin",
  //     imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1XrdeEkDoqLOfAoDB5ZqEeVxZ4PS6D1qV_g&s",
  //   },
  //   {
  //     id: 3,
  //     title: "Wanderung in den Alpen",
  //     description: "Natur pur und frische Luft",
  //     location: "Alpen",
  //     imageUrl: "https://www.comingsoon.net/wp-content/uploads/sites/3/2025/05/Johnny-Dang-Net-Worth-2025How-Much-Money-Does-He-Make.jpg",
  //   },


  // ];
  const [currentPost, setCurrentPost] = useState<any>(null);


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
      <SearchBar setPosts={setPosts} />

      {posts.map((post) => (
        <>
          <Post
            post={post}

          />
          
        </>
      ))}
      


      {/* <Comment comment={dummyComment[0]} /> */}
      <Footer />
    </>

  )
}
export default Home;
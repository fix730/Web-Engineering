import { useNavigate } from "react-router-dom";
import { useAppDispatch} from "../hooks/redux-hooks";
import { useEffect } from "react";
import { getUser, logout } from "../slices/authSlice";
import axiosInstance from "../api/axiosInstance";
import Header from "./components/Header/Header";
import { useState } from "react";
function Home() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();


    // Erstmal wirklich nur dummy posts ohne wirklichen Inhalt oder Backend nur zum Fühlen
    const dummyPosts = [
        {
            id: 1,
            title: "Sonnenuntergang am Sewee",
            description: "Wunderschöner Sonnenuntergang am nächsten Sewee",
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

    {dummyPosts.map((post) => (
              <div
            key={post.id}
            className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-6 cursor-pointer flex flex-col md:flex-row border border-gray-200"
            onClick={() => setCurrentPost(post)}
          >
            {/* Image on the left */}
            <div className="md:w-1/3 w-full">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text content on the right */}
            <div className="md:w-2/3 w-full p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
              <p className="text-gray-700 mb-2">{post.description}</p>
              <p className="text-gray-500">Location: {post.location}</p>
            </div>
          </div>
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
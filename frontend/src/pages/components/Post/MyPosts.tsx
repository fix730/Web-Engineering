mport { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Post, { PostType } from "./components/Post/Post";
import axiosInstance from "../api/axiosInstance";

const MyPosts = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const navigate = useNavigate();

  // Beim Mount: alle eigenen Posts laden
  useEffect(() => {
    axiosInstance.get<PostType[]>("/api/posts/user")
      .then(res => setPosts(res.data))
      .catch(err => console.error("Fehler beim Laden deiner Posts:", err));
  }, []);

  // Edit-Handler: z.B. auf eine Edit-Seite weiterleiten
  const handleEdit = (postId: number) => {
    navigate(`/posts/edit/${postId}`);
  };

  // Delete-Handler: nach Bestätigung löschen und State aktualisieren
  const handleDelete = async (postId: number) => {
    if (!window.confirm("Möchtest du diesen Post wirklich löschen?")) return;
    try {
      await axiosInstance.delete(`/api/post/${postId}`);
      setPosts(prev => prev.filter(p => p.idpost !== postId));
    } catch (err) {
      console.error("Fehler beim Löschen des Posts:", err);
    }
  };

  return (
    <>
      <Header />

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Meine Posts</h1>

        {posts.length === 0 && (
          <p className="text-gray-600">Du hast noch keine Posts.</p>
        )}

        <div className="space-y-8">
          {posts.map(post => (
            <div key={post.idpost} className="relative">
              {/* Original-Post-Card */}
              <Post post={post} />

              {/* Action-Buttons oben rechts */}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(post.idpost)}
                  className="px-2 py-1 text-sm font-medium text-blue-600 hover:underline"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => handleDelete(post.idpost)}
                  className="px-2 py-1 text-sm font-medium text-red-600 hover:underline"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MyPosts;
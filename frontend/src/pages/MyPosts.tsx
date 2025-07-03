import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Post, { PostType } from "./components/Post/Post";
import axiosInstance from "../api/axiosInstance";
import { DialogQuestion } from "../Pop-Up-Window/alert";
import PostClicked from "./components/Post/PostClicked";
import PostLikes from "./components/Post/PostLikes";

const MyPosts = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const navigate = useNavigate();

  // Dialog für Post löschen
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [dialogHeader, setDialogHeader] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [dialogConfirmText, setDialogConfirmText] = useState("");
  const [dialogConfirmColor, setDialogConfirmColor] = useState("");
  const [dialogHoverColor, setDialogHoverColor] = useState("");
  const [postToDeleteId, setPostToDeleteId] = useState<number | null>(null);
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  // Post-Details Modal
  const [postClicked, setPostClicked] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostType | null>(null);

  // Likes Modal
  const [isLikesOpen, setIsLikesOpen] = useState(false);
  const [likesPostId, setLikesPostId] = useState<number | null>(null);

  useEffect(() => {
    getUserPosts();
  }, []);

  const getUserPosts = async () => {
    try {
      const response = await axiosInstance.get<{ posts: PostType[] }>("/api/post/user");
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Fehler beim Abrufen der Posts:", error);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/posts/edit/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setDialogHeader("Post löschen?");
    setDialogContent("Bist du sicher, dass du diesen Post löschen möchtest?");
    setDialogConfirmText("Löschen");
    setDialogConfirmColor("red");
    setDialogHoverColor("red");
    setPostToDeleteId(id);
    setIsOpenDialog(true);
  };

  const deletePost = async () => {
    setIsOpenDialog(false);
    if (postToDeleteId == null) return;
    try {
      // Post löschen
      await axiosInstance.delete(`/api/post/`, {
        params: { postId: postToDeleteId }
      });

      // Warten, damit Backend sicher löschen kann
      await delay(500);

      // Posts neu laden, um UI zu aktualisieren
      await getUserPosts();

      // Modal schließen, falls aktueller Post gelöscht wurde
      setPostClicked(false);
    } catch (error) {
      console.error("Fehler beim Löschen des Posts:", error);
    }
  };



  useEffect(() => {
	document.title = "Meine Posts - FindDHBW";
}, []);

  return (
    <div
    className="min-h-screen bg-cover bg-center"
    style={{ backgroundImage: "url('/bg-postnew1.jpg')" }}
  >
    <Header />
    <div className="mt-16"></div>
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center underline mb-16">Meine Posts</h1>
        {posts.length === 0 && (
          <p className="text-gray-600 text-center">Du hast noch keine Posts.</p>
        )}
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.idpost} className="relative">
              <Post post={post} />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(post.idpost)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Pencil size={16} />
                  <span className="text-sm">Bearbeiten</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(post.idpost)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 size={16} />
                  <span className="text-sm">Löschen</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <DialogQuestion
        open={isOpenDialog}
        header={dialogHeader}
        content={dialogContent}
        buttonConfirm={dialogConfirmText}
        onConfirm={deletePost}
        onCancel={() => setIsOpenDialog(false)}
        colorHeader={dialogConfirmColor}
        colorOnHover={dialogHoverColor}
        colorConfirm={dialogConfirmColor}
      />

      
      <Footer />
    </div>
  );
}

export default MyPosts;

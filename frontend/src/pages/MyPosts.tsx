import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Post, { PostType } from "./components/Post/Post";
import axiosInstance from "../api/axiosInstance";
import { DialogQuestion } from "../Pop-Up-Window/alert";
import { get } from "http";

const MyPosts = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const navigate = useNavigate();
  const [isOpenDialogQuestion, setIsOpenDialogQuestion] = useState(false);
  const [qustionDialogHeader, setQuestionDialogHeader] = useState("");
  const [questionDialogContent, setQuestionDialogContent] = useState("");
  const [questionDialogConfirm, setQuestionDialogConfirm] = useState("");
  const [questionDialogConfirmColorHeader, setQuestionDialogConfirmColorHeader] = useState("");
  const [questionDialogColorOnHover, setQuestionDialogColorOnHover] = useState("");
  const [questionDialogColorConfirm, setQuestionDialogColorConfirm] = useState("");
  const [postToDeleteId, setPostToDeleteId] = useState<number | null>(null);
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  async function getUserPosts() {
    try {
      const response = await axiosInstance.get('/api/post/user');
      setPosts(response.data.posts); // Setze die Posts im Zustand
    } catch (error) {
      console.error("Fehler beim Abrufen der Posts:", error);
      // alert("Fehler beim Abrufen der Posts. Bitte versuche es später erneut.");
    }
  }

  async function deletePost() {
    setIsOpenDialogQuestion(false);
    try {
      // alert("Post mit der ID " + postToDeleteId + " wird gelöscht");
      await axiosInstance.delete(`/api/post/`, {
        params: {
          postId: postToDeleteId
        }
      });
      // --- Hier den Zeitversatz einbauen --- um sicherzustellen, dass der Post gelöscht wurde, bevor die Liste aktualisiert wird
      await delay(500); // Wartet 500 Millisekunden (0.5 Sekunden)
      getUserPosts(); // Aktualisiere die Liste der Posts nach dem Löschen
    } catch (error) {
      console.error("Fehler beim Löschen des Posts:", error);
      // alert("Fehler beim Löschen des Posts. Bitte versuche es später erneut.");
    }
  }


  useEffect(() => {
    getUserPosts();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/posts/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    setIsOpenDialogQuestion(true);
    setQuestionDialogHeader("Post löschen?");
    setQuestionDialogContent("Bist du sicher, dass du diesen Post löschen möchtest?");
    setQuestionDialogConfirm("Löschen");
    setQuestionDialogConfirmColorHeader("text-red-600"); // This affects the header text color
    setQuestionDialogColorOnHover("red"); // Pass just the color name for hover
    setQuestionDialogColorConfirm("red"); // Pass just the color name for confirm
    setPostToDeleteId(id);
  };

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-center">Meine Posts</h1>
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
                  className="px-2 py-1 text-sm text-blue-600 hover:underline"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => handleDelete(post.idpost)}
                  className="px-2 py-1 text-sm text-red-600 hover:underline"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
      <DialogQuestion open={isOpenDialogQuestion}
        header={qustionDialogHeader}
        content={questionDialogContent}
        buttonConfirm={questionDialogConfirm}
        onConfirm={deletePost}
        onCancel={() => setIsOpenDialogQuestion(false)}
        colorHeader={questionDialogConfirmColorHeader}
        colorOnHover={questionDialogColorOnHover}
        colorConfirm={questionDialogColorConfirm}
      />
    </>
  );
};

export default MyPosts;
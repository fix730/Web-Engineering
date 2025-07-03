import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { PostType } from "./Post";
import { usePostDetails } from "./usePostDetails";

// Interface für den Benutzer-Typ
interface UserType {
  iduser: number;
  firstName: string;
  name: string;
  image_idimage: string;
}

// Props-Definition für die PostLikes-Komponente
interface PostLikesProps {
  post: PostType;
  onClose: () => void; // Funktion zum Schließen des Modals
}

const PostLikes = ({ post, onClose }: PostLikesProps) => {
  // Destrukturierung von Werten aus dem usePostDetails Hook
  const { liked, postImage, countLikes, toggleLike } = usePostDetails(post);

  // Zustandsvariablen für die Komponente
  const [likedUsers, setLikedUsers] = useState<UserType[]>([]); // Liste der Benutzer, denen der Post gefällt
  const [loading, setLoading] = useState<boolean>(true); // Ladezustand
  const [error, setError] = useState<string | null>(null); // Fehlerzustand

  // Funktion zum Abrufen der Likes vom Backend
  const fetchLikes = async () => {
    setLoading(true); // Ladezustand setzen
    try {
      const response = await axiosInstance.get(`/api/post/like/users?postId=${post.idpost}`);
      setLikedUsers(response.data.users || []); // Gefallene Benutzer setzen
      setError(null); // Fehler zurücksetzen
    } catch (err) {
      console.error("Error fetching likes:", err);
      setError("Fehler beim Laden der Likes"); // Fehlermeldung setzen
    } finally {
      setLoading(false); // Ladezustand beenden
    }
  };

  // useEffect Hook, um Likes zu laden, wenn sich die Post-ID ändert
  useEffect(() => {
    fetchLikes();
  }, [post.idpost]); // Abhängigkeit von post.idpost

  return (
    // Hintergrund-Div für das Modal, klickbar zum Schließen
    <div
      className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      {/* Inhalt des Modals */}
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()} // Klick-Propagation stoppen, um Modal nicht zu schließen
      >
        {/* Schließen-Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
          aria-label="Close Likes Modal"
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-4">Likes</h3>

        {/* Ladeanzeige */}
        {loading && <p className="text-gray-500">Lade Likes...</p>}
        {/* Fehlermeldung */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Meldung, wenn keine Likes vorhanden sind */}
        {!loading && !error && likedUsers.length === 0 && (
          <p className="text-gray-500">Noch keine Likes :(</p>
        )}

        {/* Liste der Benutzer, denen der Post gefällt */}
        {!loading && !error && likedUsers.length > 0 && (
          <div className="flex flex-col gap-4">
            {likedUsers.map(user => (
              <div key={user.iduser} className="flex items-center gap-3">
                <img
                  src={postImage} // Hier wird die Post-Bild-URL verwendet, sollte aber eher die Benutzerbild-URL sein
                  alt={`${user.firstName} ${user.name}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="text-gray-800 font-medium">
                  {user.firstName} {user.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostLikes;
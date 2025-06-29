import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";

interface UserType {
  iduser: number;
  firstName: string;
  name: string;
  image_idimage: string;
}

interface PostLikesProps {
  postId: number;
  onClose: () => void; // Jetzt Pflicht für Modal-Schließen
}

const PostLikes = ({ postId, onClose }: PostLikesProps) => {
  const [likedUsers, setLikedUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLikes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/post/like/users?postId=${postId}`);
      setLikedUsers(response.data.users || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching likes:", err);
      setError("Fehler beim Laden der Likes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [postId]);

  return (
    <div
      className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
          aria-label="Close Likes Modal"
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-4">Likes</h3>

        {loading && <p className="text-gray-500">Lade Likes...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && likedUsers.length === 0 && (
          <p className="text-gray-500">Noch keine Likes :(</p>
        )}

        {!loading && !error && likedUsers.length > 0 && (
          <div className="flex flex-col gap-4">
            {likedUsers.map(user => (
              <div key={user.iduser} className="flex items-center gap-3">
                <img
                  src={`http://localhost:8000/api/image/${user.image_idimage}`}
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







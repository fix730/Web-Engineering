import React, { useState, useEffect } from 'react';
import axiosInstance from "../../../api/axiosInstance";

export interface User {
  iduser: number;
  name: string;
  firstName: string;
  image_idimage: number;
  profileImageUrl?: string;
}

export interface Comment {
  idcomment: number;
  text: string;
  date: string;
  commentcol: string | null;
  user_iduser: number;
  post_idpost: number;
  user: User;
}

interface CommentUnderPostProps {
  postId: number;
  onCommentSubmit?: (commentText: string) => void;
  onViewAllComments?: (postId: number) => void;
  onViewAllLikes?: (postId: number) => void;
  handlePostClick?: React.Dispatch<React.SetStateAction<boolean>>;
  fetchComments?: () => void;
}

const CommentUnderPost: React.FC<CommentUnderPostProps> = ({ postId, onCommentSubmit, onViewAllComments, onViewAllLikes, handlePostClick, fetchComments }) => {
  const [commentText, setCommentText] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false)
  const [likedNames, setLikedNames] = useState<string[]>([]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };
  const handleViewAllLikesClick = () => {
    if (onViewAllLikes) onViewAllLikes(postId);
  };

  // Lade Kommentare beim Mounten und wenn postId sich ändert

  //Kommentar schreiben
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (commentText.trim() === '') return;

    try {
      const response = await axiosInstance.post(`/api/post/comment`, {
        postId: postId,
        text: commentText,
      });
      // setCommentText("");

      if (response.status === 201) {
        if (onCommentSubmit) onCommentSubmit(commentText);
        setCommentText('');
      } else {
        console.error("Fehler beim Senden des Kommentars:", response.data);
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Server Fehler:", error.response.data);
      } else if (error.request) {
        console.error("Keine Antwort vom Server:", error.request);
      } else {
        console.error("Fehler:", error.message);
      }
    }
  };
  // Alle Komments sejen
  const handleViewAllCommentsClick = () => {
    if (onViewAllComments) onViewAllComments(postId);
    handlePostClick?.(true);
  };

  const likedPreview = async () => {
    try {
      const response = await axiosInstance.get(`/api/post/like/users?postId=${postId}`);
      const likedUsers = response.data.users || [];
      const names = likedUsers.map((user: any) => `${user.firstName} ${user.name}`);
      setLikedNames(names);
      console.log("showPreview true gesetzt");
      setShowPreview(true);
    } catch (error) {
      console.error("Fehler beim Laden der Likes:", error);
    }
  };
  const formatLikedNames = (names: string[]) => {
    if(names.length == 0){
      return '...'
    }
    if (names.length <= 3) {
      return names.join(', ');
    } else {
      const firstThree = names.slice(0, 3).join(', ');
      const restCount = names.length - 3;
      return `${firstThree} und von noch ${restCount} mehr`;
    }
  };




  const isCommentEmpty = commentText.trim() === '';

  return (
    <div className="max-w-4xl mx-auto py-4">
      <button
        onClick={handleViewAllCommentsClick}
        className="text-gray-400 px-1 py-2 rounded hover:text-gray-600 transition-colors duration-200"
        onAuxClick={() => handlePostClick?.(true)}
      >
        Alle Kommentare anzeigen
      </button>
      <button
        onMouseEnter={likedPreview}
        onMouseLeave={() => setShowPreview(false)} // Füge dies hinzu
        className="relative text-red-400 px-1 py-2 rounded hover:text-gray-600 transition-colors duration-200" // Füge 'relative' hinzu
        onClick={handleViewAllLikesClick}
      >
        Alle likes anzeigen
        {showPreview && (
          <p className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg z-50">
            Geliked von: {formatLikedNames(likedNames)}
          </p>
        )}
      </button>



      <form onSubmit={handleSubmit} className="relative flex items-center mt-2 pr-20">
        {/* <form onSubmit={handleSubmit} className="relative flex items-center mt-2 pr-[80px]">  You can also use pixel values if needed */}
        <label htmlFor="comment" className="sr-only">Your Comment</label>
        <textarea
          id="comment"
          className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none h-[40px] whitespace-nowrap overflow-x-hidden"
          rows={1}
          placeholder="Schreibe was nettes!"
          value={commentText}
          onChange={handleTextChange}
          required
        ></textarea>
        {!isCommentEmpty && (
          <button
            type="submit"
            className="absolute right-3 text-blue-500 hover:text-blue-700 font-semibold text-sm transition-colors duration-200"
          >
            Posten
          </button>
        )}
      </form>
    </div>
  );
};

export default CommentUnderPost;

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
  handlePostClick?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommentUnderPost: React.FC<CommentUnderPostProps> = ({ postId, onCommentSubmit, onViewAllComments, handlePostClick }) => {
  const [commentText, setCommentText] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  // Lade Kommentare beim Mounten und wenn postId sich ändert
  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/api/post/comment?postId=${postId}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (commentText.trim() === '') return;

    try {
      const response = await axiosInstance.post(`/api/post/comment`, {
        postId: postId,
        text: commentText,
      });
      setCommentText("");

      if (response.status === 201) {
        if (onCommentSubmit) onCommentSubmit(commentText);
        setCommentText('');
        fetchComments(); // Kommentare nach Posting neu laden
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

  const handleViewAllCommentsClick = () => {
    if (onViewAllComments) onViewAllComments(postId);
    handlePostClick?.(true);
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

      {/* Hier kannst du ggf. die Kommentare auch anzeigen (optional) */}
      {/* 
      <div className="mt-2 max-h-40 overflow-y-auto">
        {comments.map(comment => (
          <div key={comment.idcomment} className="mb-2 border-b border-gray-200 pb-2">
            <p className="font-semibold">{comment.user.name} {comment.user.firstName}</p>
            <p>{comment.text}</p>
            <small className="text-gray-400">{new Date(comment.date).toLocaleString()}</small>
          </div>
        ))}
      </div>
      */}

      <form onSubmit={handleSubmit} className="relative flex items-center mt-2">
        <label htmlFor="comment" className="sr-only">Your Comment</label>
        <textarea
          id="comment"
          className="w-full p-2 pr-16 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none overflow-hidden"
          rows={1}
          style={{ minHeight: '40px', maxHeight: '100px' }}
          placeholder="Schreibe was nettes!"
          value={commentText}
          onChange={handleTextChange}
          onInput={(e) => {
            e.currentTarget.style.height = 'auto';
            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
          }}
          required
        />
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

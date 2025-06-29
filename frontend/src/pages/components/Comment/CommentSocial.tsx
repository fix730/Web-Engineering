import React, { useState } from "react";
import heartNotLiked from "../../../icons/heart.png";
import heartLiked from "../../../icons/heartLiked.png";

export interface User {
  iduser: number;
  name: string;
  firstName: string;
  image_idimage: number;
  profileImageUrl?: string; // Falls Bild-URL kommt, sonst musst du es separat holen
}

export interface CommentType {
  idcomment: number;
  text: string;
  date: string;
  user: {
    iduser: number;
    name: string;
    firstName: string;
    image_idimage: number;
  };
}
type CommentProps = {
  comment: CommentType;
  onClick?: (comment: Comment) => void;
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  // Tag, Monat (plus 1, da nullbasiert), Jahr
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};
const CommentSocial = ({ comment, onClick }: CommentProps) => {
  return (

    <div
      className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-4 mb-6 cursor-pointer flex items-start space-x-4 border border-black relative"

    >
      {/* Profilbild */}
      <div className="flex-shrink-0"> {/* Ensures the image doesn't shrink */}
        <img
          src={"http://localhost:8000/api/image/" + comment.user.image_idimage}
          alt={`${comment.user?.firstName} ${comment.user?.name}`}
          className="w-16 h-16 rounded-full object-cover" // Increased size to w-16 h-16 and added object-cover
        />
      </div>

      {/* Textinhalt */}
      <div className="flex flex-col justify-center flex-grow"> {/* Allows text to take remaining space */}
        <h2 className="text-lg font-bold text-gray-900"> {/* Adjusted font size for better fit */}
          {comment.user?.firstName} {comment.user?.name}
        </h2>
        <p className="text-gray-500 text-sm mb-1"> {/* Date is grey, smaller, and directly below the name */}
          {formatDate(comment.date)}
        </p>
        <p className="text-gray-700">{comment.text}</p> {/* Comment text */}
      </div>
    </div>
  );
};

export default CommentSocial;
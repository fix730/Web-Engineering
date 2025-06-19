import React from "react";
import heartNotLiked from "../../../icons/heart.png";
import heartLiked from "../../../icons/heartLiked.png";
import { useState } from "react";
import { UserObject } from "../MockUser";

export type CommentObject = {
  id: string; 
  postId: number;
  author?: UserObject;
  content: string;
  createdAt: string;
  
};

export type CommentProps = {
  comment: CommentObject;
  onClick?: (comment: CommentObject) => void;
};


const Comment = ({ comment, onClick }: CommentProps) => {

  const[liked, setLiked] = useState(false);

function toggleLike() {
  setLiked(!liked); 
}
  return (
    <div
        className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-6 cursor-pointer flex flex-col md:flex-row border border-gray-200"
      >
      {/* Profilbild auf der linken Seite */}
      <div className="md:w-1/3 w-full flex items-center justify-center p-4">
        <img
          src={comment.author?.profilePicture}
          alt={comment.author?.UserName}
          className="w-12 h-12 rounded-full"
        />
      </div>
        {/* Textinhalt auf der rechten Seite */}
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{comment.author?.UserName}</h2>
            <p className="text-gray-700 mb-2">{comment.content}</p>
            <p className="text-gray-500">Erstellt am: {comment.createdAt}</p>

            <img onClick={toggleLike} className="absolute bottom-2 right-2 w-12 h-12"  src={liked ? heartLiked : heartNotLiked} alt="Placeholder" />

        </div>
              
    </div>
  );
};

export default Comment;
import React from "react";
import heartNotLiked from "../../../icons/heart.png";
import heartLiked from "../../../icons/heartLiked.png";
import { CommentType } from "../Comment/CommentSocial"; // Assuming Comment is defined
import CommentUnderPost from "./CommentUnderPost";
import { usePostDetails } from "../Post/usePostDetails"; // Import the hook
import axiosInstance from "../../../api/axiosInstance";
import { useState, useEffect } from "react"; 
type PostObject = {
  id: number;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
};

// Re-export PostType and User if they are canonical here
export interface User {
  name: string;
  firstName: string;
  image_idimage: number;
  iduser: number;
}

export type PostType = {

  idpost: number;
  title: string;
  description: string;
  location_idlocation: number;
  image_idimage: number;
  user_iduser: number;
  start_time: string;
  end_time: string;
  locationName: string;
  user: {
    iduser: number;
    name: string;
    firstName: string;
    image_idimage: number;

  };
};

export type PostProps = {
  post: PostType;
  onClick?: (post: PostObject) => void;
  handlePostClick: React.Dispatch<React.SetStateAction<boolean>>;
  onViewAllLikes?: (postId: number) => void; // NEU
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  // Tag, Monat (plus 1, da nullbasiert), Jahr
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};



const Post = ({ post, onClick, handlePostClick, onViewAllLikes }: PostProps) => {
  const { liked, postImage, countLikes, toggleLike, } = usePostDetails(post);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [sameDate, setSameDate] = useState(false)

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/api/post/comment?postId=${post.idpost}`);
      // Hier erwartet man: response.data.comments (Array)
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  const handleDoubleDate = (dateStringStart: string, dateStringEnd: string) => {
    const dS = formatDate(dateStringStart);
    const dE = formatDate(dateStringEnd);
    if (dE == dS) {
      setSameDate(true)
    }
    else (
      setSameDate(false)
    )
  };

  useEffect(() => {
    handleDoubleDate(post.start_time, post.end_time);
  }, [post.start_time, post.end_time]);

  return (
    <div
      key={post.idpost}
      className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-6 cursor-pointer flex flex-col md:flex-row border border-gray-200"
      onClick={() =>
        onClick?.({
          id: post.idpost,
          title: post.title,
          description: post.description,
          location: post.locationName,
          imageUrl: postImage || "",
        })
      }
    >
      {/* Bild auf der linken Seite */}
      <div className="md:w-1/3 w-full h-96">
        <img
          src={postImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Textinhalt auf der rechten Seite */}
      <div className="md:w-2/3 w-full p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-2">{post.description} </p>

        {sameDate == true && (
          <p className="text-gray-700 mb-2">Am  {formatDate(post.end_time)} </p>
        )
        }
        {sameDate == false && (
          <p className="text-gray-700 mb-2">Vom {formatDate(post.start_time)} bis {formatDate(post.end_time)} </p>
        )
        }
        
        <p className="text-gray-500">Location: {post.locationName}</p>
        <p className="mb-2">Likes: {countLikes}</p>

        <div className="flex items-end gap-4 mt-auto">
          <div className="flex-grow mt-10">
            <CommentUnderPost postId={post.idpost} handlePostClick={handlePostClick} onViewAllLikes={onViewAllLikes} fetchComments={fetchComments} />
          </div>
          <img
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click from bubbling up to open the popup
              toggleLike();
            }}
            className="w-10 h-10 flex-shrink-0 cursor-pointer mb-4"
            src={liked ? heartLiked : heartNotLiked}
            alt="Like"
          />
        </div>
      </div>
    </div>
  );
};

export default Post;
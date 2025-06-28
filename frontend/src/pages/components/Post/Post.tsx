import React, { useEffect } from "react";
import heartNotLiked from "../../../icons/heart.png";
import heartLiked from "../../../icons/heartLiked.png";
import { useState } from "react";
import { fetchProfileImage } from "../../../utils/image";
import axiosInstance from "../../../api/axiosInstance";
import { Comment } from "../Comment/Comment"
import CommentUnderPost from "./CommentUnderPost";
type PostObject = {
  id: number; // GUID später??
  title: string;
  description: string;
  location: string;
  imageUrl: string;


};

interface User {
  name: string;
  firstName: string;
  image_idimage: number;
  iduser: number;
}


export interface PostType {
  idpost: number;
  title: string;
  description: string;
  location_idlocation: number;
  image_idimage: number;
  user_iduser: number;
  locationName: string;
  user: User;
  start_time: Date;
  end_time: Date;
  comments?: Comment[];
}

interface PostsData {
  posts: PostType[];
}


type PostProps = {
  post: PostType;
  onClick?: (post: PostObject) => void;
};



const Post = ({ post, onClick }: PostProps) => {

  const [liked, setLiked] = useState(false);
  const [postImage, setPostImage] = useState<string | undefined>(undefined);
  const [countLikes, setCountLikes] = useState<number>(0);

  function toggleLike() {
    if (!liked) {
      axiosInstance.post("/api/post/like", {
        postId: post.idpost
      });
    } else {
      axiosInstance.delete(`/api/post/like`, {
        params: {
          postId: post.idpost
        }
      });
    }
    setLiked(!liked);
  }
  const aktualisierenLikeStatus = async () => {
    try {
      const getCountLikes = await axiosInstance.get(`/api/post/like/count`, {
        params: {
          postId: post.idpost
        }
      }
      );
      setCountLikes(Number(getCountLikes.data.likes));
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Like-Status:", error);
    }
  }
  aktualisierenLikeStatus();
  useEffect(() => {
    fetchProfileImage({ onSetImageUrl: setPostImage, imageId: post.image_idimage, profilePlaceholder: undefined });
  }, [post.image_idimage]);



  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await axiosInstance.get(`/api/post/like/byUser`, {
          params: {
            postId: post.idpost
          }
        }
        );
        setLiked(Boolean(response.data.isLiked));
        const getCountLikes = await axiosInstance.get(`/api/post/like/count`, {
          params: {
            postId: post.idpost
          }
        }
        );
        setCountLikes(Number(getCountLikes.data.likes));
      } catch (error) {
        console.error("Fehler beim Überprüfen des Like-Status:", error);
      }
    }
    checkLikeStatus();
  }, []);



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
      <div className="md:w-1/3 w-full">
        <img
          src={postImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Textinhalt auf der rechten Seite */}
      <div className="md:w-2/3 w-full p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-2">{post.description}</p>
        <p className="text-gray-500">Location: {post.locationName}</p>
        <p className="mb-2">{countLikes}</p> {/* Added mb-2 for spacing below likes */}


        <div className="flex items-end gap-4 mt-auto">
          {/* Comment nimmt nötigen platz */}
          <div className="flex-grow mt-10">
            <CommentUnderPost postId={post.idpost} />
          </div >
          {/* Heart icon */}
          <img 
            onClick={toggleLike}
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
import React from "react";
import heart from "../../../icons/heart.png";

type PostObject = {
  id: number; // GUID später??
  title: string;
  description: string;
  location: string;
  imageUrl: string;
};

type PostProps = {
  post: PostObject;
  onClick?: (post: PostObject) => void;
};

const Post = ({ post, onClick }: PostProps) => {
  

  return (
            
            <div
              key={post.id}
              className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-6 cursor-pointer flex flex-col md:flex-row border border-gray-200"
              onClick={() => onClick?.(post)} // call it only if it exists
            >
              {/* Bild auf der linken Seite */}
              <div className="md:w-1/3 w-full">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Textinhalt auf der rechten Seite */}
              <div className="md:w-2/3 w-full p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col justify-center relative">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-2">{post.description}</p>
                <p className="text-gray-500">Location: {post.location}</p>

                <img className="absolute bottom-2 right-2 w-12 h-12"  src={heart} alt="Placeholder" />

              </div>
            </div>
  );
};

export default Post;
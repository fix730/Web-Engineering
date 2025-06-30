import heartNotLiked from "../../../icons/heart.png";
import heartLiked from "../../../icons/heartLiked.png";
import CommentUnderPost from "./CommentUnderPost";
import { usePostDetails } from "../Post/usePostDetails"; // Import the hook





export interface User {
  iduser: number;
  name: string;
  firstName: string;
  image_idimage: number;
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
}
export type PostProps = {
  post: PostType;
  
};


const Post = ({ post}: PostProps) => {
  const { liked, postImage, countLikes, toggleLike, } = usePostDetails(post);
  return (
    <div
      key={post.idpost}
      className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-6 flex flex-col md:flex-row border border-gray-200"
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
        <p className="mb-2">Likes: {countLikes}</p>

        <div className="flex items-end gap-4 mt-auto">
          <div className="flex-grow mt-10">
            <CommentUnderPost post={post}  />
          </div>
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
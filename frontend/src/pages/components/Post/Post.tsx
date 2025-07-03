import heartNotLiked from "../../../icons/heart.png";
import heartLiked from "../../../icons/heartLiked.png";
import CommentUnderPost from "./CommentUnderPost";
import { useState, useEffect } from "react";
import { usePostDetails } from "./usePostDetails";



export interface User {
  iduser: number;
  name: string;
  firstName: string;
  image_idimage: number;
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
  user: User;
}
export type PostProps = {
  post: PostType;

};

// formatiert das Datum
const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};




const Post = ({ post }: PostProps) => {
  const { liked, postImage, countLikes, toggleLike, } = usePostDetails(post);
  const [sameDate, setSameDate] = useState(false)

  // prüft ob  zwei   strings denselben Werrt habe
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
  //Wird ausgeführt wenn sich das datum ändert
  useEffect(() => {
    handleDoubleDate(post.start_time, post.end_time);
  }, [post.start_time, post.end_time]);

  return (
    <div
      key={post.idpost}
      className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-6 flex flex-col md:flex-row border border-gray-200 md:h-96"
    >
      {/* Beitragsbild auf der linken Seite */}
      <div className="md:w-1/3 w-full h-full">
        <img src={postImage} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Textinhalt auf der rechten Seite */}
      <div className="md:w-2/3 w-full p-6 pb-1 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-2">{post.description} </p>

        
        {sameDate == true && <p className="text-gray-700 mb-2">Am {formatDate(post.end_time)} </p>}
        {sameDate == false && (
          <p className="text-gray-700 mb-2">
            Vom {formatDate(post.start_time)} bis {formatDate(post.end_time)}{" "}
          </p>
        )}

        <p className="text-gray-500">Location: {post.locationName}</p>
        <p className="mb-2">Likes: {countLikes}</p>

        {/* Fußzeile für Interaktionen (Kommentare und Likes) */}
        <div className="flex flex-grow items-end mt-auto w-full">
          {/* Kommentarbereich */}
          <div className="flex-grow w-10/12 mr-auto">
            <CommentUnderPost post={post} />
          </div>
          {/* Like-Button */}
          <div className="ml-auto py-5">
            <img
              onClick={(e) => {
                e.stopPropagation(); // Verhindert, dass das Klickereignis zum übergeordneten Beitrag "hochblubbert"
                toggleLike();
              }}
              className="w-10 h-10 flex-shrink-0 cursor-pointer ml-4 "
              src={liked ? heartLiked : heartNotLiked}
              alt="Like"
            />
          </div>
        </div>
      </div>
    </div>

  );
};

export default Post;
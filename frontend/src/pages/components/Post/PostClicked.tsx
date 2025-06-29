import React, { useEffect, useState } from "react";
import heartNotLiked from "../../../icons/heart.png"; // Pfad anpassen
import heartLiked from "../../../icons/heartLiked.png"; // Pfad anpassen
import { PostType } from "../Post/Post"; // Pfad anpassen
import { usePostDetails } from "../Post/usePostDetails"; // Pfad anpassen
import axiosInstance from "../../../api/axiosInstance"; // Pfad anpassen
import Comment from "../Comment/CommentSocial";
import CommentSocial, { CommentType } from "../Comment/CommentSocial";
import CommentUnderPost from "./CommentUnderPost";

interface PostClickedProps {
    post: PostType;
    onClose: () => void;
    handlePostClick: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostClicked = ({ post, onClose, handlePostClick }: PostClickedProps) => {
    const { liked, postImage, countLikes, toggleLike } = usePostDetails(post);

    const [comments, setComments] = useState<CommentType[]>([]);

    // Kommentare laden
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

    useEffect(() => {
        fetchComments();
    }, [post.idpost]);

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl flex w-full max-w-5xl h-5/6 overflow-hidden relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-semibold z-10"
                    aria-label="Close post"
                >
                    &times;
                </button>

                {/* Linke Seite: Bild nimmt 50% Breite, Höhe 100%, Bild stretch in Höhe */}
                <div className="w-1/2 h-full bg-black flex items-center justify-center overflow-hidden">
                    <img
                        src={postImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Rechte Seite: nimmt andere 50%, flex-grow, scrollbar */}
                <div className="w-1/2 p-6 flex flex-col overflow-hidden">
                    {/* Oben: Infos nebeneinander, ohne Scrollbar */}
                    <div className="flex flex-row justify-between items-start mb-4 flex-none">
                        {/* Links: Titel + Beschreibung */}
                        <div className="flex-1 pr-4">
                            <h2 className="text-4xl font-bold text-gray-900 mb-2">{post.title}</h2>
                            <p className="text-base text-gray-700 mb-2">{post.description}</p>
                        </div>

                        {/* Rechts: Location + Likes */}
                        <div className="flex flex-col flex-none text-right">
                            <p className="text-sm text-gray-500 mb-2">Location: {post.locationName}</p>
                            <p className="text-lg text-gray-700 font-semibold">{countLikes} Likes</p>
                        </div>
                    </div>

                    {/* Kommentare: Scrollbar nur hier */}
                    <div className="flex-grow overflow-y-auto py-2 pr-2 text-sm min-h-[58%]"> {/* Changed py-4 to py-2 and removed mb-4 */}
                        {comments.length === 0 ? (
                            <p className="text-gray-500">Keine Kommentare :/</p>
                        ) : (
                            comments.map(comment => (
                                <CommentSocial key={comment.idcomment} comment={comment} />
                            ))
                        )}
                    </div>

                    {/* CommentUnderPost und Like Button nebeneinander */}
                    <div className="flex items-center gap-4 pt-2 flex-none"> {/* Changed pt-4 to pt-2 */}
                        {/* CommentUnderPost */}
                        <div className="flex-1">
                            <CommentUnderPost
                                postId={post.idpost}
                                onCommentSubmit={() => fetchComments()} 
                            />
                        </div>

                        {/* Like Button */}
                        <div className="flex-none">
                            <img
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLike();
                                }}
                                className="w-12 h-12 cursor-pointer"
                                src={liked ? heartLiked : heartNotLiked}
                                alt={liked ? "Unlike" : "Like"}
                            />
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default PostClicked;

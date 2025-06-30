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
    onViewAllLikes?: (postId: number) => void; // NEU
}

const PostClicked = ({ post, onClose, onViewAllLikes }: PostClickedProps) => {
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
        <div
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl flex w-full max-w-5xl h-5/6 overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-1 right-4 text-gray-600 hover:text-gray-900 text-3xl font-semibold z-10"
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
                <div className="w-1/2 p-7 flex flex-col overflow-hidden relative h-full">
                    {/* Oben: Infos - jetzt 25% Höhe */}
                    <div className="flex flex-row justify-between items-start mb-4 flex-none flex-nowrap h-[20%]">
                        {/* Profilbereich */}
                        <div className="flex flex-col items-center flex-shrink-0 mr-4">
                            <p className="text-sm font-semibold text-gray-900 mb-1 text-center">
                                {post.user.firstName}
                            </p>
                            <div className="flex flex-col items-center">
                                <img
                                    src={"http://localhost:8000/api/image/" + post.user.image_idimage}
                                    alt={`${post.user?.firstName} ${post.user?.name}`}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <p className="text-lg text-gray-700 font-semibold mt-2 text-center">
                                    {countLikes} Likes
                                </p>
                            </div>
                        </div>

                        {/* Titel + Beschreibung + Location */}
                        <div className="flex-1 pr-4 pl-1 max-w-[calc(100%-150px)]">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h2>
                            <p className="text-sm text-gray-700 mb-2">{post.description}</p>
                            <p className="text-xs text-gray-500 mb-2 break-words">
                                Location: {post.locationName}
                            </p>
                        </div>
                    </div>

                    {/* Kommentare: Scrollbarer Bereich, jetzt 55% Höhe */}
                    <div className="overflow-y-auto pr-2 text-sm h-[60%]  bg-white border-t border-grey-300">
                        
                        {comments.length === 0 ? (
                            <p className="text-gray-500">Keine Kommentare :/</p>
                        ) : (
                            comments.map((comment) => (
                                <CommentSocial key={comment.idcomment} comment={comment} />
                            ))
                        )}
                    </div>

                    {/* Fixierter unterer Bereich, jetzt 20% Höhe */}
                    <div className="flex items-center gap-4 pt-2 flex-none bg-white border-t border-grey-300 h-[20%]">
                        <div className="flex-1">
                            <CommentUnderPost
                                postId={post.idpost}
                                onCommentSubmit={() => fetchComments()}
                                onViewAllLikes={onViewAllLikes}
                            />
                        </div>
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

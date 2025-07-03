import React, { useEffect, useState } from "react";
import heartNotLiked from "../../../icons/heart.png"; // Pfad anpassen
import heartLiked from "../../../icons/heartLiked.png"; // Pfad anpassen
import { PostType } from "../Post/Post"; // Pfad anpassen
import { usePostDetails } from "../Post/usePostDetails"; // Pfad anpassen
import axiosInstance from "../../../api/axiosInstance"; // Pfad anpassen
import CommentSocial, { CommentType } from "../Comment/CommentSocial";
import CommentUnderPost from "./CommentUnderPost";

interface PostClickedProps {
    post: PostType;
    onClose: () => void;


}

const PostClicked = ({ post, onClose, }: PostClickedProps) => {
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
            // Grauer hintergrund
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={onClose} // Klick auf Overlay schließt das Modal
        >
            <div
                // Flexbox: Spalte auf klein, Reihe ab md (medium)
                className="bg-white rounded-lg shadow-xl flex flex-col md:flex-row w-full max-w-5xl h-[90vh] overflow-hidden relative"
                onClick={(e) => e.stopPropagation()} //  verhindert Schließen
            >
                {/* Linke Seite: Bild-Container */}
                {/* Breite: 100% auf klein, 50% ab md */}
                <div className="bg-black flex items-center justify-center overflow-hidden w-full md:w-1/2 h-64 md:h-auto">
                    <img
                        src={postImage}
                        alt={post.title}
                        // Bild nimmt ganze Fläche ein, Zuschneiden bei Überschuss
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Rechte Seite: Inhalt-Container */}
                {/* Breite wie links: 100% auf klein, 50% ab md */}
                
                {/* Höhe 90vh auf klein, automatisch ab md */}
                <div className="w-full md:w-1/2 p-4 md:p-7 flex flex-col overflow-hidden relative h-[calc(90vh)] md:h-auto">

                    {/* Close Button */}
                    
                    <button
                        onClick={onClose}
                        className="absolute top-1 right-4 text-gray-600 hover:text-gray-900 text-3xl font-semibold z-10"
                        aria-label="Close post"
                    >
                        &times;
                    </button>

                    {/* Obere Info-Leiste */}
                   
                    <div className="flex flex-row justify-between items-start mb-4 flex-none h-auto md:h-[20%] flex-nowrap">

                        {/* Profilbereich (links) */}
                       
                        <div className="flex flex-col items-center flex-shrink-0 mr-4 hidden md:block">
                            <p className="text-sm font-semibold text-gray-900 mb-1 text-center">
                                {post.user.firstName}
                            </p>
                            <div className="flex flex-col items-center">
                                <img
                                    src={postImage}
                                    alt={`${post.user?.firstName} ${post.user?.name}`}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <p className="text-lg text-gray-700 font-semibold mt-2 text-center">
                                    {countLikes} Likes
                                </p>
                            </div>
                        </div>

                        {/* Titel + Beschreibung + Location (rechts) */}
                        {/* Nimmt den restlichen Platz ein */}
                        {/* Innenabstand rechts und links, max. Breite berechnet */}
                        {/* Nur ab md sichtbar */}
                        <div className="flex-1 pr-2 pl-1 max-w-[calc(100%-150px)] hidden md:block">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{post.title}</h2>
                            <p className="text-sm text-gray-700 mb-2">{post.description}</p>
                            <p className="text-xs text-gray-500 mb-2 break-words">
                                Location: {post.locationName}
                            </p>
                        </div>
                    </div>

                    {/* Kommentarbereich */}
                    {/* Vertikal scrollbar, füllt verbleibenden Platz aus */}
                    {/* Oben Padding rechts, kleiner Text */}
                    <div className="overflow-y-auto pr-2 text-sm flex-grow bg-white border-t border-gray-300">
                        {comments.length === 0 ? (
                            <p className="text-gray-500">Keine Kommentare :/</p>
                        ) : (
                            comments.map((comment) => (
                                <CommentSocial key={comment.idcomment} comment={comment} />
                            ))
                        )}
                    </div>

                    {/* Fixierter Bereich unten mit Kommentar-Eingabe und Like-Button */}
                    {/* Flex-Container mit Abstand zwischen Elementen */}
                    {/* Höhenanpassung je nach Bildschirmgröße */}
                    <div className="flex items-center gap-4 pt-2 flex-none bg-white border-t border-gray-300 h-auto md:h-[20%]">
                        <div className="flex-1">
                            <CommentUnderPost
                                post={post}
                                onCommentAdded={fetchComments}
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

import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from "../../../api/axiosInstance";
import { PostType } from './Post';
import { User } from './Post'
import PostLikes from './PostLikes';
import PostClicked from './PostClicked';

// Definition des Comment-Interfaces
export interface Comment {
  idcomment: number;
  text: string;
  date: string;
  commentcol: string | null;
  user_iduser: number;
  post_idpost: number;
  user: User;
}

// Definition der Props für die Komponente
interface CommentUnderPostProps {
  post: PostType;
  onCommentAdded?: () => void; // Optionaler Callback, wenn ein Kommentar hinzugefügt wurde
}

const CommentUnderPost = ({ post, onCommentAdded }: CommentUnderPostProps) => {
  // Zustandsvariablen für die Komponente
  const [commentText, setCommentText] = useState<string>(''); // Text des Kommentars
  const [showPreview, setShowPreview] = useState(false); // Zeigt Vorschau der "Gefällt mir"-Namen an
  const [likedNames, setLikedNames] = useState<string[]>([]); // Namen der Benutzer, denen der Beitrag gefällt
  const [postClicked, setPostClicked] = useState(false); // Zeigt an, ob der Beitrag geklickt wurde (für Detailansicht)
  const [isLikesOpen, setIsLikesOpen] = useState(false); // Zeigt an, ob die "Gefällt mir"-Liste geöffnet ist

  // Referenz für das Textarea-Element
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Hilfsfunktion für eine Verzögerung
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Handler für Änderungen im Kommentar-Textfeld
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  // Effekt zur automatischen Größenanpassung des Textarea-Feldes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Höhe zurücksetzen
      const computedHeight = textareaRef.current.scrollHeight; // Aktuelle Scroll-Höhe
      const singleLineHeight = textareaRef.current.clientHeight; // Höhe einer einzelnen Zeile
      const twoLineHeight = singleLineHeight * 2; // Höhe für zwei Zeilen

      // Höhe auf maximal zwei Zeilen begrenzen
      textareaRef.current.style.height = `${Math.min(computedHeight, twoLineHeight)}px`;

      // Bei mehr als zwei Zeilen, Scrollbalken anzeigen
      if (computedHeight > twoLineHeight) {
        textareaRef.current.style.overflowY = 'auto';
      } else {
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  }, [commentText]); // Abhängigkeit vom Kommentartext

  // Handler zum Anzeigen aller Likes
  const handleViewAllLikesClick = () => {
    setIsLikesOpen(true);
  };

  // Handler, wenn der Beitrag geklickt wird
  const handlePostCLicked = () => {
    setPostClicked(true);
  };

  // Kommentar abschicken
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (commentText.trim() === '') return; // Leere Kommentare nicht senden

    console.time("Comment Submission Process"); // Startet Timer für den gesamten Prozess

    try {
      console.time("API Post Request"); // Startet Timer für den API-Aufruf
      const response = await axiosInstance.post(`/api/post/comment`, {
        postId: post.idpost,
        text: commentText,
      });
      console.timeEnd("API Post Request"); // Beendet Timer für den API-Aufruf

      if (response.status === 200) {
        setCommentText(''); // Eingabefeld sofort leeren
        console.log("Comment submitted successfully to backend.");

        console.time("Delay Before Reload"); // Startet Timer für die künstliche Verzögerung
        await delay(500); // 500ms Verzögerung
        console.timeEnd("Delay Before Reload"); // Beendet Timer für die Verzögerung

        console.time("Comments Reload Trigger"); // Startet Timer für das Auslösen des Neuladens
        await onCommentAdded?.(); // Callback aufrufen, um Kommentare neu zu laden
        console.timeEnd("Comments Reload Trigger"); // Beendet Timer für das Auslösen des Neuladens

        console.log("Reload of comments triggered after delay.");
      } else {
        console.error("Fehler beim Senden des Kommentars:", response.data);
        console.log("Comment submission failed on backend.");
      }
    } catch (error: any) {
      console.error("Error during comment submission:", error);
      console.log("Comment submission failed due to network or unexpected error.");
    } finally {
      console.timeEnd("Comment Submission Process"); // Beendet Timer für den gesamten Prozess
    }
  };

  // Vorschau der "Gefällt mir"-Namen laden
  const likedPreview = async () => {
    try {
      const response = await axiosInstance.get(`/api/post/like/users?postId=${post.idpost}`);
      const likedUsers = response.data.users || [];
      const names = likedUsers.map((user: any) => `${user.firstName} ${user.name}`);
      setLikedNames(names);
      setShowPreview(true);
    } catch (error) {
      console.error("Fehler beim Laden der Likes:", error);
    }
  };

  // Formatierung der "Gefällt mir"-Namen für die Anzeige
  const formatLikedNames = (names: string[]) => {
    if (names.length === 0) {
      return '...';
    }
    if (names.length <= 3) {
      return names.join(', ');
    } else {
      const firstThree = names.slice(0, 3).join(', ');
      const restCount = names.length - 3;
      return `${firstThree} und von noch ${restCount} mehr`;
    }
  };

  // Prüft, ob der Kommentar-Text leer ist
  const isCommentEmpty = commentText.trim() === '';

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Button zum Anzeigen aller Kommentare */}
      <button
        onClick={handlePostCLicked}
        className="text-gray-400 px-1 py-2 rounded hover:text-gray-600 transition-colors duration-200"
      >
        Alle Kommentare anzeigen
      </button>

      {/* Button zum Anzeigen aller Likes mit Vorschau */}
      <button
        onMouseEnter={likedPreview} // Zeigt Vorschau beim Mouse-Over
        onMouseLeave={() => setShowPreview(false)} // Versteckt Vorschau beim Mouse-Leave
        className="relative text-red-400 px-1 py-2 rounded hover:text-gray-600 transition-colors duration-200"
        onClick={handleViewAllLikesClick}
      >
        Alle Likes anzeigen
        {showPreview && ( // Wenn Vorschau angezeigt werden soll
          <p className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg z-50">
            Geliked von: {formatLikedNames(likedNames)}
          </p>
        )}
      </button>

      {/* Komponente zum Anzeigen aller Likes, wenn isLikesOpen true ist */}
      {isLikesOpen && (
        <PostLikes
          post={post}
          onClose={() => setIsLikesOpen(false)}
        />
      )}

      {/* Komponente zur Detailansicht des Posts, wenn postClicked true ist */}
      {postClicked && (
        <PostClicked
          post={post}
          onClose={() => setPostClicked(false)}
        />
      )}

      {/* Formular zum Schreiben eines Kommentars */}
      <form onSubmit={handleSubmit} className="relative flex items-center mt-2 pr-20">
        <label htmlFor="comment" className="sr-only">Your Comment</label>
        <textarea
          ref={textareaRef}
          id="comment"
          className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none overflow-hidden"
          rows={1} // Startet mit einer Zeile
          placeholder="Schreibe was nettes!"
          value={commentText}
          onChange={handleTextChange}
          onKeyDown={(e) => { // Absenden bei Enter-Taste (ohne Shift)
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          required
        ></textarea>
        {!isCommentEmpty && ( // Zeigt den "Posten"-Button nur an, wenn der Kommentar nicht leer ist
          <button
            type="submit"
            className="absolute right-3 text-blue-500 hover:text-blue-700 font-semibold text-sm transition-colors duration-200"
          >
            Posten
          </button>
        )}
      </form>
    </div>
  );
};

export default CommentUnderPost;
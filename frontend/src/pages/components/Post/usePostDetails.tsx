import { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { fetchProfileImage } from "../../../utils/image";
import { PostType } from "../Post/Post";

// --- Typdefinition für den Rückgabewert des Hooks ---
interface UsePostDetailsResult {
  liked: boolean; 
  setLiked: React.Dispatch<React.SetStateAction<boolean>>; // Funktion zum Aktualisieren des 'liked'-Zustands
  postImage: string | undefined; 
  countLikes: number; // Die Gesamtzahl der Likes für den Post
  toggleLike: () => Promise<void>; 
  
  checkLikeStatus: () => Promise<void>; // Funktion zum Überprüfen des initialen Like-Status und der Anzahl
}

// --- Definition des benutzerdefinierten React Hooks: usePostDetails --- nimmt Objekt vom Typen PostType
export const usePostDetails = (post: PostType): UsePostDetailsResult => {
  //  ob geliked, image url und wieviel likes
  const [liked, setLiked] = useState(false);
  const [postImage, setPostImage] = useState<string | undefined>(undefined);
  const [countLikes, setCountLikes] = useState<number>(0);

  // --- useEffect Hook zum Laden des Post-Bildes ---
  useEffect(() => {
    
    fetchProfileImage({
      onSetImageUrl: setPostImage,
      imageId: post.image_idimage,
      profilePlaceholder: undefined,
    });
  }, [post.image_idimage]); 

  // --- Funktion: checkLikeStatus (Initialer Like-Status und Anzahl überprüfen) ---
  // Diese asynchrone Funktion holt den Like-Status des aktuellen Benutzers und die Gesamtzahl der Likes vom Server.
  const checkLikeStatus = async () => {
    try {
      // Führt zwei API-Aufrufe parallel mit Promise.all aus, um Effizienz zu gewährleisten:
      const [likeStatusResponse, likeCountResponse] = await Promise.all([
        // 1. Abfrage, ob der Benutzer den Post geliked hat
        axiosInstance.get(`/api/post/like/byUser`, {
          params: { postId: post.idpost },
        }),
        // 2. Abfrage der Gesamtzahl der Likes für den Post
        axiosInstance.get(`/api/post/like/count`, {
          params: { postId: post.idpost },
        }),
      ]);
      // Aktualisiert den 'liked'-Zustand basierend auf der Antwort des Servers (konvertiert zu Boolean)
      setLiked(Boolean(likeStatusResponse.data.isLiked));
      // Aktualisiert den 'countLikes'-Zustand basierend auf der Antwort des Servers (konvertiert zu Number)
      setCountLikes(Number(likeCountResponse.data.likes));
    } catch (error) {
      // Fehlerbehandlung: Gibt eine Fehlermeldung in der Konsole aus, wenn die API-Aufrufe fehlschlagen
      console.error("Fehler beim Überprüfen des Like-Status:", error);
    }
  };

  // --- Funktion: aktualisierenLikeStatus (Nur Like-Anzahl aktualisieren) ---
  // Diese asynchrone Funktion dient dazu, nur die aktuelle Anzahl der Likes vom Server neu zu laden.
  // Nützlich, um die Anzeige nach einem optimistischen Update zu synchronisieren oder externe Änderungen zu erfassen.
  

  // --- Funktion: toggleLike (Like-Status umschalten) ---
  // Diese asynchrone Funktion handhabt das Hinzufügen oder Entfernen eines Likes für den Post.
  // Sie verwendet optimistische Updates für eine schnellere UI-Reaktion.
  const toggleLike = async () => {
    try {
      // Überprüfe, ob der Post aktuell nicht geliked ist (d.h., der Benutzer möchte ihn liken)
      if (!liked) {
        // Sende einen POST-Request an die API, um den Like hinzuzufügen
        await axiosInstance.post("/api/post/like", {
          postId: post.idpost, // Sende die ID des Posts mit
        });
        // Optmistisches Update: Erhöhe die Like-Anzahl sofort im Frontend,
        // bevor die Serverantwort zurückkommt, um die UI schnell zu aktualisieren.
        setCountLikes((prev) => prev + 1);
      } else {
        // Wenn der Post bereits geliked ist (d.h., der Benutzer möchte den Like entfernen)
        // Sende einen DELETE-Request an die API, um den Like zu entfernen
        await axiosInstance.delete(`/api/post/like`, {
          params: {
            postId: post.idpost, // Sende die ID des Posts als URL-Parameter mit
          },
        });
        // Optimistisches Update: Verringere die Like-Anzahl sofort im Frontend.
        // Math.max(0, prev - 1) stellt sicher, dass die Anzahl nicht unter Null fällt.
        setCountLikes((prev) => Math.max(0, prev - 1));
      }
      // Schalte den 'liked'-Status im Frontend um (von true zu false oder umgekehrt),
      // basierend auf der ausgeführten Aktion.
      setLiked(!liked);
    } catch (error) {
      // Fehlerbehandlung: Wenn der API-Aufruf fehlschlägt
      console.error("Fehler beim Umschalten des Like-Status:", error);
      // Mache das optimistische Update rückgängig:
      // Setze die Like-Anzahl auf den Zustand zurück, der vor dem (fehlgeschlagenen) Klick galt.
      // Wenn es ein 'Like'-Versuch war, der fehlschlug, erhöhe; wenn ein 'Unlike'-Versuch, verringere.
      setCountLikes((prev) => (liked ? prev + 1 : prev - 1));
      // Setze den 'liked'-Status auf seinen vorherigen Zustand zurück.
      setLiked(liked);
    }
  };

  // --- useEffect Hook für den initialen Like-Status und die Anzahl ---
  // Dieser Effekt wird ausgeführt, wenn die Komponente zum ersten Mal gerendert wird
  // und jedes Mal, wenn sich die 'idpost' des Posts ändert.
  useEffect(() => {
    // Ruft die Funktion 'checkLikeStatus' auf, um den initialen Like-Status
    // und die Gesamtzahl der Likes vom Server abzurufen.
    checkLikeStatus();
  }, [post.idpost]); // Abhängigkeit: Effekt wird bei Änderung von 'post.idpost' erneut ausgeführt.
  // Dies ist wichtig, wenn der Hook in einer Liste von Posts verwendet wird
  // oder wenn sich der angezeigte Post dynamisch ändert.

  // --- Rückgabe des Hooks ---
  // Der Hook gibt ein Objekt zurück, das alle Zustände und Funktionen enthält,
  // die eine Komponente benötigt, um Post-Details anzuzeigen und zu interagieren.
  return {
    liked, // Der aktuelle Like-Status des Benutzers
    setLiked, // Setter-Funktion für den 'liked'-Status 
    postImage, // Id vom Image
    countLikes, // Die Gesamtzahl der Likes des Posts
    toggleLike, // Funktion zum Hinzufügen oder Entfernen eines Likes
    
    checkLikeStatus, // Funktion zum erneuten Abrufen aller Like-Informationen
  };
};
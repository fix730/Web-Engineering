import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook für die Navigation innerhalb der Anwendung
import { Pencil, Trash2 } from "lucide-react"; // Icons für Bearbeiten und Löschen von Posts
import Header from "./components/Header/Header"; // Kopfzeilen-Komponente der Anwendung
import Footer from "./components/Footer/Footer"; // Fußzeilen-Komponente der Anwendung
import Post, { PostType } from "./components/Post/Post"; // Post-Komponente zur Anzeige eines einzelnen Posts und dessen Typ-Definition
import axiosInstance from "../api/axiosInstance"; // Vorkonfigurierte Axios-Instanz für API-Anfragen
import { DialogQuestion } from "../Pop-Up-Window/alert"; // Eine Dialog-Komponente für Bestätigungsfragen (z.B. vor dem Löschen)

// MyPosts-Komponente: Zeigt alle Posts des aktuell angemeldeten Benutzers an
const MyPosts = () => {
  // Zustandsvariable zur Speicherung der Liste der Posts des Benutzers
  const [posts, setPosts] = useState<PostType[]>([]);
  // Hook für die Navigation, z.B. zum Edit-Post-Formular
  const navigate = useNavigate();

  // --- Zustandsvariablen für den "Post löschen"-Bestätigungsdialog ---
  const [isOpenDialog, setIsOpenDialog] = useState(false); // Steuert die Sichtbarkeit des Dialogs
  const [dialogHeader, setDialogHeader] = useState("");     // Überschrift des Dialogs
  const [dialogContent, setDialogContent] = useState("");   // Inhaltstext des Dialogs
  const [dialogConfirmText, setDialogConfirmText] = useState(""); // Text für den Bestätigungsbutton
  const [dialogConfirmColor, setDialogConfirmColor] = useState(""); // Farbe für den Bestätigungsbutton
  const [dialogHoverColor, setDialogHoverColor] = useState("");     // Hover-Farbe für den Bestätigungsbutton
  const [postToDeleteId, setPostToDeleteId] = useState<number | null>(null); // Speichert die ID des zu löschenden Posts

  // Hilfsfunktion zum Erzeugen einer künstlichen Verzögerung
  // Nützlich, um dem Backend Zeit zu geben, die Löschaktion zu verarbeiten, bevor die Posts neu geladen werden.
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  // useEffect Hook: Wird einmal beim Mounten der Komponente ausgeführt, um die Benutzer-Posts zu laden.
  useEffect(() => {
    getUserPosts();
  }, []); // Leeres Abhängigkeits-Array bedeutet, dass der Effekt nur einmal nach dem ersten Rendern läuft.

  // Asynchrone Funktion zum Abrufen der Posts des angemeldeten Benutzers von der API.
  const getUserPosts = async () => {
    try {
      // Sendet eine GET-Anfrage an den "/api/post/user"-Endpunkt.
      // Die Antwort wird als Objekt mit einem "posts"-Array erwartet.
      const response = await axiosInstance.get<{ posts: PostType[] }>("/api/post/user");
      // Aktualisiert den Zustand 'posts' mit den abgerufenen Daten, um die UI zu aktualisieren.
      setPosts(response.data.posts);
    } catch (error) {
      // Fehlerbehandlung: Gibt Fehler beim Abrufen der Posts in der Konsole aus.
      console.error("Fehler beim Abrufen der Posts:", error);
    }
  };

  // Handler-Funktion für das Bearbeiten eines Posts.
  // Leitet den Benutzer zur "EditPost"-Seite mit der spezifischen Post-ID weiter.
  const handleEdit = (id: number) => {
    navigate(`/posts/edit/${id}`);
  };

  // Handler-Funktion für das Klicken auf den "Löschen"-Button eines Posts.
  // Bereitet den Bestätigungsdialog vor und öffnet ihn.
  const handleDeleteClick = (id: number) => {
    setDialogHeader("Post löschen?");
    setDialogContent("Bist du sicher, dass du diesen Post löschen möchtest?");
    setDialogConfirmText("Löschen");
    setDialogConfirmColor("red"); // Setzt die Farbe des Bestätigungsbuttons auf Rot
    setDialogHoverColor("red");   // Setzt die Hover-Farbe des Bestätigungsbuttons auf Rot
    setPostToDeleteId(id);        // Speichert die ID des Posts, der gelöscht werden soll
    setIsOpenDialog(true);        // Öffnet den Bestätigungsdialog
  };

  // Asynchrone Funktion zum tatsächlichen Löschen des Posts nach Bestätigung.
  const deletePost = async () => {
    setIsOpenDialog(false); // Schließt den Dialog sofort nach Bestätigung
    if (postToDeleteId == null) return; // Bricht ab, wenn keine Post-ID zum Löschen gesetzt ist

    try {
      // Sendet eine DELETE-Anfrage an den "/api/post"-Endpunkt mit der Post-ID als Parameter.
      await axiosInstance.delete(`/api/post/`, {
        params: { postId: postToDeleteId } // Übergibt die Post-ID als Query-Parameter
      });

      // Fügt eine kurze Verzögerung ein, um sicherzustellen, dass die Backend-Operation abgeschlossen ist.
      await delay(500);

      // Lädt die Posts neu, um die Benutzeroberfläche nach dem Löschen zu aktualisieren.
      await getUserPosts();

      // Das Kommentarfeld "Modal schließen, falls aktueller Post gelöscht wurde" ist hier leer gelassen,
      // da der Dialog bereits oben geschlossen wird und kein weiteres Modal explizit verwaltet wird.

    } catch (error) {
      // Fehlerbehandlung beim Löschen des Posts.
      console.error("Fehler beim Löschen des Posts:", error);
    }
  };

  // useEffect Hook: Setzt den Dokumententitel (Browser-Tab-Titel) beim Mounten der Komponente.
  useEffect(() => {
    document.title = "Meine Posts - FindDHBW";
  }, []); // Leeres Abhängigkeits-Array bedeutet, dass der Effekt nur einmal nach dem ersten Rendern läuft.

  // JSX-Struktur der MyPosts-Komponente
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-postnew1.jpg')" }} // Hintergrundbild für die Seite
    >
      <Header /> {/* Anzeige der Kopfzeile */}
      <div className="mt-16"></div> {/* Abstandshalter unter dem Header */}
      <main className="max-w-4xl mx-auto p-4 space-y-6"> {/* Hauptinhaltsbereich, zentriert und mit Padding */}
        <h1 className="text-4xl font-bold text-center underline mb-16">Meine Posts</h1> {/* Überschrift der Seite */}
        {/* Bedingte Anzeige: Wenn keine Posts vorhanden sind, wird ein entsprechender Text angezeigt */}
        {posts.length === 0 && (
          <p className="text-gray-600 text-center">Du hast noch keine Posts.</p>
        )}
        <div className="space-y-8">
          {/* Rendert die Posts in umgekehrter Reihenfolge (neueste zuerst), indem das Array zuerst kopiert und dann umgekehrt wird */}
          {posts.slice().reverse().map((post) => (
            <div key={post.idpost} className="relative"> {/* Jeder Post hat einen eindeutigen Schlüssel */}
              <Post post={post} /> {/* Die eigentliche Post-Komponente zur Darstellung der Details */}
              <div className="absolute top-2 right-2 flex space-x-2"> {/* Container für Bearbeiten- und Löschen-Buttons, absolut positioniert */}
                {/* Bearbeiten-Button */}
                <button
                  onClick={() => handleEdit(post.idpost)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Pencil size={16} /> {/* Bleistift-Icon */}
                  <span className="text-sm">Bearbeiten</span>
                </button>
                {/* Löschen-Button */}
                <button
                  onClick={() => handleDeleteClick(post.idpost)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 size={16} /> {/* Mülleimer-Icon */}
                  <span className="text-sm">Löschen</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Die DialogQuestion-Komponente, die als Bestätigungs-Pop-up dient */}
      <DialogQuestion
        open={isOpenDialog}             // Steuert die Sichtbarkeit des Dialogs
        header={dialogHeader}          // Übergibt die dynamische Überschrift
        content={dialogContent}        // Übergibt den dynamischen Inhaltstext
        buttonConfirm={dialogConfirmText} // Übergibt den Text für den Bestätigungsbutton
        onConfirm={deletePost}         // Callback-Funktion, die beim Bestätigen ausgeführt wird (löscht den Post)
        onCancel={() => setIsOpenDialog(false)} // Callback-Funktion, die beim Abbrechen ausgeführt wird (schließt den Dialog)
        colorHeader={dialogConfirmColor} // Setzt die Farbe der Überschrift
        colorOnHover={dialogHoverColor}  // Setzt die Hover-Farbe des Bestätigungsbuttons
        colorConfirm={dialogConfirmColor} // Setzt die Farbe des Bestätigungsbuttons
      />

      <Footer /> {/* Anzeige der Fußzeile */}
    </div>
  );
}

export default MyPosts;
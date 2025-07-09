import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"; // Hooks für Navigation und URL-Parameter
import Header from "./components/Header/Header"; // Header-Komponente für die obere Navigation
import { SubmitButton } from "./components/Button"; // Wiederverwendbarer Button für Formularübermittlung
import DialogAlert from "../Pop-Up-Window/alert"; // Komponenten für Pop-up-Benachrichtigungen
import axiosInstance from "../api/axiosInstance"; // Axios-Instanz für API-Anfragen (mit Basis-URL und ggf. Interceptoren)
import { AxiosError } from "axios"; // Typdefinition für Axios-Fehler
import { fetchProfileImage } from "../utils/image"; // Hilfsfunktion zum Abrufen von Bildern
import Footer from "./components/Footer/Footer"; // Footer-Komponente für den unteren Bereich

// EditPost-Komponente: Ermöglicht das Bearbeiten eines bestehenden Posts.
function EditPost() {
  // Holt die "id" des Posts aus der URL (z.B. /posts/edit/123 -> id = "123").
  const { id } = useParams<{ id: string }>();
  // Hook zur programmatischen Navigation (z.B. nach dem Speichern des Posts).
  const navigate = useNavigate();

  // --- Zustandsvariablen für die Post-Daten ---
  // Diese States sind an die Formularfelder gebunden und speichern die Werte des zu bearbeitenden Posts.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [startTime, setStartTime] = useState(""); // Speichert Datum/Uhrzeit als String für datetime-local Input
  const [endTime, setEndTime] = useState("");     // Speichert Datum/Uhrzeit als String für datetime-local Input
  const [imageId, setImageId] = useState<number>(1); // ID des aktuell verknüpften Bildes (aus der Datenbank)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined); // URL des anzuzeigenden Bildes (Vorschau)
  const [imageFile, setImageFile] = useState<File | null>(null); // Die neu ausgewählte Bilddatei, wenn der Benutzer ein neues Bild hochlädt

  // --- Zustandsvariablen für Alert-Dialoge ---
  // Steuern den Inhalt und die Sichtbarkeit des Alert-Pop-ups für Benutzer-Feedback.
  const [alertTitle, setAlertTitle] = useState("");
  const [alertText, setAlertText] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // --- useEffect Hook zum Laden der Post-Daten beim Komponenten-Mount ---
  // Dieser Hook wird ausgeführt, sobald die Komponente geladen wird oder sich die 'id' in der URL ändert.
  // Er holt die aktuellen Daten des Posts von der API, um das Formular vorab zu befüllen.
  useEffect(() => {
    // Stoppt die Ausführung, wenn keine Post-ID in der URL vorhanden ist.
    if (!id) return;

    // Asynchrone IIFE (Immediately Invoked Function Expression) zum Abrufen der Daten.
    (async () => {
      try {
        // API-Anfrage, um die Details des spezifischen Posts abzurufen.
        const res = await axiosInstance.get(`/api/post/one?postId=${id}`);
        // Extrahiert die Post-Daten aus der API-Antwort.
        const data = (res.data.post ?? res.data) as any;

        // Befüllt die Zustandsvariablen mit den abgerufenen Daten.
        setTitle(data.title);
        setDescription(data.description);
        setLocationName(data.locationName || "");

        // Konvertiert die ISO-Datumsstrings von der API in das für 'datetime-local' benötigte Format.
        if (data.start_time)
          setStartTime(new Date(data.start_time).toISOString().slice(0, 16));
        if (data.end_time)
          setEndTime(new Date(data.end_time).toISOString().slice(0, 16));

        // Lädt das aktuelle Bild des Posts, wenn eine Bild-ID vorhanden ist.
        if (data.image_idimage) {
          setImageId(data.image_idimage);
          fetchProfileImage({
            onSetImageUrl: setImageUrl,
            imageId: data.image_idimage,
            profilePlaceholder: undefined // Platzhalter ist hier nicht relevant
          });
        }
      } catch (error: any) {
        // Fehlerbehandlung beim Laden des Posts.
        let msg = "Kann den Post nicht laden.";
        // Prüft, ob es sich um einen Axios-Fehler mit einer Server-Antwort handelt.
        if (error.isAxiosError && (error as AxiosError).response?.data) {
          const resp = (error as AxiosError).response!.data as any;
          if (typeof resp.message === "string") msg = resp.message; // Nimmt die Fehlermeldung vom Server.
        }
        // Setzt die Alert-Nachricht und öffnet den Dialog.
        setAlertTitle("Ladefehler");
        setAlertText(msg);
        setIsAlertOpen(true);
      }
    })();
  }, [id]); // Die Abhängigkeit 'id' sorgt dafür, dass der Effekt erneut läuft, wenn sich die Post-ID in der URL ändert.

  // --- Funktion zum Absenden des Formulars (Post bearbeiten) ---
  // Wird aufgerufen, wenn der Benutzer auf den "Speichern"-Button klickt.
  // Sendet die aktualisierten Post-Daten an die API.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Verhindert das Standard-Neuladen der Seite beim Formular-Submit.

    // Grundlegende Validierung: Prüft, ob alle Pflichtfelder ausgefüllt sind.
    if (!id || !title || !description || !locationName || !startTime || !!endTime) {
      setAlertTitle("Fehler");
      setAlertText("Bitte fülle alle Felder aus.");
      setIsAlertOpen(true);
      return; // Bricht die Funktion ab, wenn Felder fehlen.
    }

    try {
      // Erstellt ein FormData-Objekt, um Text- und ggf. Bilddaten zu senden.
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("locationName", locationName);
      // Konvertiert die lokalen Datums-Strings zurück in ISO-Format für die API.
      formData.append("start_time", new Date(startTime).toISOString());
      formData.append("end_time", new Date(endTime).toISOString());
      formData.append("postId", id); // Sendet die Post-ID, um den richtigen Post zu aktualisieren.
      if (imageFile) formData.append("imagePost", imageFile); // Fügt die neue Bilddatei hinzu, wenn eine ausgewählt wurde.

      // Sendet die PATCH-Anfrage an die API, um den Post zu aktualisieren.
      const res = await axiosInstance.patch(
        "/api/post",
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } } // Wichtig für den Datei-Upload
      );

      // Überprüft den Status der API-Antwort.
      if (res.status === 200) {
        navigate("/myposts"); // Leitet den Benutzer bei Erfolg zur Seite "Meine Posts" weiter.
      } else {
        // Wirft einen Fehler, wenn der Status nicht 200 ist.
        throw new Error(res.data?.message || "Update fehlgeschlagen");
      }
    } catch (error: any) {
      // Fehlerbehandlung beim Aktualisieren des Posts.
      let msg = "Update fehlgeschlagen.";
      // Behandelt Axios-Fehler (Netzwerkprobleme, Server-Antworten mit Fehlern).
      if (error.isAxiosError && (error as AxiosError).response?.data) {
        const resp = (error as AxiosError).response!.data as any;
        if (typeof resp.message === "string") msg = resp.message;
      } else if (error instanceof Error) {
        // Behandelt generische JavaScript-Fehler.
        msg = error.message;
      }
      // Setzt die Alert-Nachricht und öffnet den Dialog.
      setAlertTitle("Fehler");
      setAlertText(msg);
      setIsAlertOpen(true);
    }
  };

  return (
    // Hauptcontainer der Seite mit Hintergrundbild.
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-postnew1.jpg')" }} // Nutzt dasselbe Hintergrundbild wie die "Neuer Post"-Seite
    >
      <Header /> {/* Zeigt die Kopfzeile der Anwendung an. */}

      <div className="mt-20"></div> {/* Platzhalter für Abstand zum Header */}

      {/* Überschrift der Seite */}
      <h2 className="mt-4 mb-16 text-center text-4xl underline font-bold">Post bearbeiten</h2>

      {/* Container für das Formular, zentriert auf der Seite */}
      <div className="flex min-h-screen items-center justify-center px-4 pb-20">
        {/* Innerer Container für das Formular mit Styling */}
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-1">
          {/* Das Bearbeitungsformular */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Eingabefeld für den Titel */}
            <div>
              <label className="block text-md font-medium text-gray-900">Titel:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-md border px-1 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required // Feld ist Pflichtfeld
              />
            </div>
            {/* Textarea für die Beschreibung */}
            <div>
              <label className="block text-md font-medium text-gray-900">Beschreibung:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-md border px-1 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                rows={5} // Legt die anfängliche Höhe des Textfeldes fest
                required
              ></textarea>
            </div>
            {/* Eingabefeld für den Ort */}
            <div>
              <label className="block text-md font-medium text-gray-900">Ort:</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="mt-1 w-full rounded-md border px-1 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required
              />
            </div>
            {/* Eingabefeld für die Startzeit (Datum und Uhrzeit) */}
            <div>
              <label className="block text-md font-medium text-gray-900">Startzeit:</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 w-full rounded-md border px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required
              />
            </div>
            {/* Eingabefeld für die Endzeit (Datum und Uhrzeit) */}
            <div>
              <label className="block text-md font-medium text-gray-900">Endzeit:</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 w-full rounded-md border px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required
              />
            </div>
            {/* Bereich zum Anzeigen des aktuellen Bildes und zum Hochladen eines neuen Bildes */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-2">Bild einfügen:</label>
              {/* Klickbarer Bereich, der das versteckte Datei-Input-Feld auslöst */}
              <div
                onClick={() => document.getElementById("fileInput")?.click()}
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-indigo-500 transition bg-gray-300"
              >
                {imageUrl ? (
                  // Zeigt eine Vorschau des aktuellen oder neu ausgewählten Bildes an
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-md"
                  />
                ) : (
                  // Platzhalter-Symbol, wenn kein Bild vorhanden oder geladen ist
                  <span className="text-4xl text-gray-400">+</span>
                )}
              </div>
              {/* Verstecktes Input-Feld für die Dateiauswahl */}
              <input
                type="file"
                id="fileInput"
                accept="image/*" // Akzeptiert nur Bilddateien
                className="hidden" // Versteckt das Standard-Input-Feld
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]); // Speichert die ausgewählte Datei
                    setImageUrl(URL.createObjectURL(e.target.files[0])); // Erzeugt eine URL für die Vorschau
                  }
                }}
              />
            </div>
            {/* Absende-Button des Formulars */}
            <SubmitButton>Speichern</SubmitButton>
          </form>
        </div>
      </div>
      {/* Alert-Dialog-Komponente zur Anzeige von Fehlern oder Bestätigungen */}
      <DialogAlert
        open={isAlertOpen}
        isOpen={() => setIsAlertOpen(false)} // Callback zum Schließen des Dialogs
        header={alertTitle}
        content={alertText}
        buttonText="Schließen"
      />
      <Footer /> {/* Zeigt die Fußzeile der Anwendung an. */}
    </div>
  );
}

export default EditPost;
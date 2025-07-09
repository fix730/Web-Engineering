import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"; // Importiert Hooks für den Zugriff auf URL-Parameter und Navigation
import Header from "./components/Header/Header"; // Importiert die Header-Komponente
import { SubmitButton } from "./components/Button"; // Importiert einen generischen Submit-Button
import DialogAlert from "../Pop-Up-Window/alert"; // Importiert eine Alert-Dialog-Komponente für Benachrichtigungen
import axiosInstance from "../api/axiosInstance"; // Importiert eine vordefinierte Axios-Instanz für API-Anfragen
import { AxiosError } from "axios"; // Importiert den Typ für Axios-Fehler
import { fetchProfileImage } from "../utils/image"; // Importiert eine Hilfsfunktion zum Abrufen von Bildern
import Footer from "./components/Footer/Footer"; // Importiert die Footer-Komponente

// EditPost-Komponente: Bietet ein Formular zum Bearbeiten eines bestehenden Posts.
function EditPost() {
  // Holt die "id" des Posts aus den URL-Parametern, z.B. `/posts/edit/123`.
  const { id } = useParams<{ id: string }>();
  // Der `useNavigate`-Hook ermöglicht die programmgesteuerte Navigation nach Aktionen (z.B. nach dem Speichern).
  const navigate = useNavigate();

  // --- Zustandsvariablen für die Formularfelder des Posts ---
  // Diese States speichern die aktuellen Werte der Eingabefelder und werden beim Laden des Posts befüllt.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [startTime, setStartTime] = useState(""); // Speichert Datum und Uhrzeit im Format für <input type="datetime-local">
  const [endTime, setEndTime] = useState("");     // Speichert Datum und Uhrzeit im Format für <input type="datetime-local">
  const [imageId, setImageId] = useState<number>(1); // Speichert die ID des aktuellen Bildes (falls vorhanden)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined); // URL für die Bildvorschau im Frontend
  const [imageFile, setImageFile] = useState<File | null>(null); // Speichert die ausgewählte neue Bilddatei vor dem Upload

  // --- Zustandsvariablen für Alert-Dialoge ---
  // Diese States steuern den Inhalt und die Sichtbarkeit eines Pop-up-Dialogs für Fehlermeldungen oder Bestätigungen.
  const [alertTitle, setAlertTitle] = useState("");
  const [alertText, setAlertText] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // --- useEffect Hook zum Laden der Post-Daten beim Komponenten-Mount ---
  // Dieser Hook wird ausgeführt, wenn die Komponente initial geladen wird oder wenn sich die Post-ID in der URL ändert.
  // Er ist verantwortlich dafür, die bestehenden Daten des Posts von der API abzurufen und die Formularfelder damit vorab zu befüllen.
  useEffect(() => {
    // Wenn keine Post-ID in der URL vorhanden ist, wird die Funktion abgebrochen.
    if (!id) return;

    // Eine asynchrone IIFE (Immediately Invoked Function Expression) wird verwendet, um die Daten abzurufen.
    (async () => {
      try {
        // Sendet eine GET-Anfrage an die API, um die Details des spezifischen Posts abzurufen.
        const res = await axiosInstance.get(`/api/post/one?postId=${id}`);
        // Extrahiert die Post-Daten aus der Antwort. `res.data.post` oder direkt `res.data` können die Daten enthalten.
        const data = (res.data.post ?? res.data) as any;

        // Aktualisiert die Zustandsvariablen mit den geladenen Daten.
        setTitle(data.title);
        setDescription(data.description);
        setLocationName(data.locationName || ""); // Stellt sicher, dass ein leerer String gesetzt wird, falls null/undefined

        // Konvertiert die Start- und Endzeiten vom ISO-String-Format (von der API)
        // in das von <input type="datetime-local"> erwartete Format (YYYY-MM-DDTHH:MM).
        if (data.start_time)
          setStartTime(new Date(data.start_time).toISOString().slice(0, 16));
        if (data.end_time)
          setEndTime(new Date(data.end_time).toISOString().slice(0, 16));

        // Wenn eine Bild-ID vorhanden ist, wird das Bild über `fetchProfileImage` geladen und die URL für die Vorschau gesetzt.
        if (data.image_idimage) {
          setImageId(data.image_idimage);
          fetchProfileImage({
            onSetImageUrl: setImageUrl,
            imageId: data.image_idimage,
            profilePlaceholder: undefined // Der Platzhalter wird hier nicht benötigt, da es um Post-Bilder geht.
          });
        }
      } catch (error: any) {
        // Fehlerbehandlung beim Laden des Posts.
        let msg = "Kann den Post nicht laden.";
        // Prüft, ob es sich um einen Axios-Fehler handelt und ob eine Server-Antwort mit einer Fehlermeldung vorhanden ist.
        if (error.isAxiosError && (error as AxiosError).response?.data) {
          const resp = (error as AxiosError).response!.data as any;
          if (typeof resp.message === "string") msg = resp.message; // Verwendet die Fehlermeldung vom Server.
        }
        // Setzt die Alert-Nachricht und öffnet den Dialog, um den Benutzer zu informieren.
        setAlertTitle("Ladefehler");
        setAlertText(msg);
        setIsAlertOpen(true);
      }
    })();
  }, [id]); // Das Array `[id]` als zweite Argument bedeutet, dass der Effekt neu ausgelöst wird, wenn sich die `id` ändert.

  // --- Funktion zum Absenden des Formulars (Post bearbeiten) ---
  // Diese Funktion wird aufgerufen, wenn das Bearbeitungsformular abgesendet wird.
  // Sie validiert die Eingaben und sendet die aktualisierten Post-Daten an die API.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Verhindert das Standardverhalten des Formulars (Seiten-Neuladen).

    // Grundlegende Validierung: Prüft, ob alle erforderlichen Felder ausgefüllt sind.
    if (!id || !title || !description || !locationName || !startTime || !endTime) {
      setAlertTitle("Fehler");
      setAlertText("Bitte fülle alle Felder aus.");
      setIsAlertOpen(true);
      return; // Bricht die Funktion ab, wenn Felder fehlen.
    }

    try {
      // Erstellt ein `FormData`-Objekt, das für das Senden von Datei-Uploads und anderen Formulardaten an die API verwendet wird.
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("locationName", locationName);
      // Konvertiert die Datums- und Zeitstrings von den Input-Feldern zurück ins ISO-Format für die API.
      formData.append("start_time", new Date(startTime).toISOString());
      formData.append("end_time", new Date(endTime).toISOString());
      formData.append("postId", id); // Die Post-ID muss gesendet werden, damit die API weiß, welchen Post sie aktualisieren soll.
      // Wenn eine neue Bilddatei ausgewählt wurde, wird diese dem FormData hinzugefügt.
      if (imageFile) formData.append("imagePost", imageFile);

      // Sendet eine PATCH-Anfrage an die API, um den Post zu aktualisieren.
      // Der Header `Content-Type: 'multipart/form-data'` ist entscheidend für den Datei-Upload.
      const res = await axiosInstance.patch(
        "/api/post",
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Prüft den HTTP-Status der Antwort. Bei Erfolg (Status 200) wird der Benutzer umgeleitet.
      if (res.status === 200) {
        navigate("/myposts"); // Leitet den Benutzer zur "Meine Posts"-Seite weiter.
      } else {
        // Falls der Status nicht 200 ist, wird ein Fehler geworfen (entweder Server-Nachricht oder generisch).
        throw new Error(res.data?.message || "Update fehlgeschlagen");
      }
    } catch (error: any) {
      // Allgemeine Fehlerbehandlung für den Submit-Prozess.
      let msg = "Update fehlgeschlagen.";
      // Behandelt spezifische Axios-Fehler (z.B. Netzwerkprobleme oder Fehlerantworten vom Server).
      if (error.isAxiosError && (error as AxiosError).response?.data) {
        const resp = (error as AxiosError).response!.data as any;
        if (typeof resp.message === "string") msg = resp.message;
      } else if (error instanceof Error) {
        // Behandelt generische JavaScript-Fehler.
        msg = error.message;
      }
      // Setzt die Alert-Nachricht und öffnet den Dialog, um den Fehler anzuzeigen.
      setAlertTitle("Fehler");
      setAlertText(msg);
      setIsAlertOpen(true);
    }
  };

  return (
    // Hauptcontainer der Seite mit einem Hintergrundbild, das über Tailwind CSS angewendet wird.
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-postnew1.jpg')" }} // Verwendet dasselbe Hintergrundbild wie die PostNew-Seite.
    >
      <Header /> {/* Rendert die Kopfzeile der Anwendung. */}

      <div className="mt-20"></div> {/* Ein Abstandshalter, um den Inhalt unterhalb des fest positionierten Headers zu platzieren. */}

      {/* Überschrift der Bearbeitungsseite. */}
      <h2 className="mt-4 mb-16 text-center text-4xl underline font-bold">Post bearbeiten</h2>

      {/* Flex-Container, um das Formular auf der Seite zu zentrieren. */}
      <div className="flex min-h-screen items-center justify-center px-4 pb-20">
        {/* Innerer Container für das Formular mit Styling (Hintergrund, Schatten, Abrundung). */}
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-1">
          {/* Das eigentliche Bearbeitungsformular. */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Eingabefeld für den Titel des Posts. */}
            <div>
              <label className="block text-md font-medium text-gray-900">Titel:</label>
              <input
                type="text"
                value={title} // Der Wert des Feldes ist an den `title`-State gebunden (kontrollierte Komponente).
                onChange={(e) => setTitle(e.target.value)} // Aktualisiert den `title`-State bei jeder Eingabe.
                className="mt-1 w-full rounded-md border px-1 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required // Markiert das Feld als Pflichtfeld für die HTML5-Validierung.
              />
            </div>
            {/* Textarea für die Beschreibung des Posts. */}
            <div>
              <label className="block text-md font-medium text-gray-900">Beschreibung:</label>
              <textarea
                value={description} // Der Wert des Feldes ist an den `description`-State gebunden.
                onChange={(e) => setDescription(e.target.value)} // Aktualisiert den `description`-State.
                className="mt-1 w-full rounded-md border px-1 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                rows={5} // Legt die anfängliche sichtbare Höhe des Textfeldes in Zeilen fest.
                required
              ></textarea>
            </div>
            {/* Eingabefeld für den Ort des Events. */}
            <div>
              <label className="block text-md font-medium text-gray-900">Ort:</label>
              <input
                type="text"
                value={locationName} // Der Wert des Feldes ist an den `locationName`-State gebunden.
                onChange={(e) => setLocationName(e.target.value)} // Aktualisiert den `locationName`-State.
                className="mt-1 w-full rounded-md border px-1 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required
              />
            </div>
            {/* Eingabefeld für die Startzeit mit Datum und Uhrzeit. */}
            <div>
              <label className="block text-md font-medium text-gray-900">Startzeit:</label>
              <input
                type="datetime-local" // Spezieller Input-Typ für Datum und Uhrzeit.
                value={startTime} // Der Wert ist an den `startTime`-State gebunden.
                onChange={(e) => setStartTime(e.target.value)} // Aktualisiert den `startTime`-State.
                className="mt-1 w-full rounded-md border px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required
              />
            </div>
            {/* Eingabefeld für die Endzeit mit Datum und Uhrzeit. */}
            <div>
              <label className="block text-md font-medium text-gray-900">Endzeit:</label>
              <input
                type="datetime-local"
                value={endTime} // Der Wert ist an den `endTime`-State gebunden.
                onChange={(e) => setEndTime(e.target.value)} // Aktualisiert den `endTime`-State.
                className="mt-1 w-full rounded-md border px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required
              />
            </div>
            {/* Bereich zum Anzeigen des aktuellen Bildes und zum Hochladen eines neuen Bildes. */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-2">Bild einfügen:</label>
              {/* Ein klickbarer Bereich, der das versteckte Datei-Input-Feld auslöst. */}
              <div
                onClick={() => document.getElementById("fileInput")?.click()} // Simuliert einen Klick auf das versteckte Input-Feld.
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-indigo-500 transition bg-gray-300"
              >
                {imageUrl ? (
                  // Zeigt eine Vorschau des aktuell geladenen oder neu ausgewählten Bildes an.
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-md"
                  />
                ) : (
                  // Zeigt ein Plus-Symbol als Platzhalter, wenn kein Bild vorhanden ist oder geladen wird.
                  <span className="text-4xl text-gray-400">+</span>
                )}
              </div>
              {/* Verstecktes Input-Feld für die Dateiauswahl. Es wird über den `onClick` des div-Elements ausgelöst. */}
              <input
                type="file"
                id="fileInput" // ID, die vom `onClick`-Handler verwendet wird.
                accept="image/*" // Akzeptiert nur Bilddateien.
                className="hidden" // Versteckt das Standard-Input-Feld des Browsers.
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]); // Speichert die ausgewählte Datei im State.
                    setImageUrl(URL.createObjectURL(e.target.files[0])); // Erstellt eine temporäre URL für die Bildvorschau.
                  }
                }}
              />
            </div>
            {/* Der Absende-Button für das Formular. */}
            <SubmitButton>Speichern</SubmitButton>
          </form>
        </div>
      </div>
      {/* Die DialogAlert-Komponente, die zur Anzeige von Erfolgs- oder Fehlermeldungen verwendet wird. */}
      <DialogAlert
        open={isAlertOpen} // Steuert die Sichtbarkeit des Dialogs.
        isOpen={() => setIsAlertOpen(false)} // Callback-Funktion zum Schließen des Dialogs.
        header={alertTitle} // Übergibt den Titel des Alerts.
        content={alertText} // Übergibt den Haupttext des Alerts.
        buttonText="Schließen" // Text für den Bestätigungsbutton im Dialog.
      />
      <Footer /> {/* Rendert die Fußzeile der Anwendung. */}
    </div>
  );
}

export default EditPost;
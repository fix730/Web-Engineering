import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import { SubmitButton } from "./components/Button";
import DialogAlert, { DialogSuccess } from "../Pop-Up-Window/alert";
import axiosInstance from "../api/axiosInstance";
import Footer from "./components/Footer/Footer";

// Eine Helferfunktion, um ein Date-Objekt in einen lokalen 'YYYY-MM-DDTHH:MM' String zu formatieren.
const formatToLocalDateTimeString = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

function PostNew() {
  const navigate = useNavigate();
  const locationNavigate = useLocation();
  // Extrahiere mögliche Start- und Endzeitparameter aus dem Navigations-State.
  // Diese könnten von einer anderen Komponente übergeben worden sein.
  const { startTimeParameter, endTimeParameter } = (locationNavigate.state as { startTimeParameter?: string; endTimeParameter?: string }) || {};

  // --- Zustandsvariablen für Formularfelder ---
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [locationName, setLocationName] = useState<string>(""); // Umbenannt von 'location' für bessere Klarheit
  const [image, setImage] = useState<File | null>(null);

  // Initialisiere Start- und Endzeit als Strings.
  // Wenn Parameter von einer anderen Seite übergeben wurden, werden diese
  // in ein Date-Objekt (intern in UTC) umgewandelt und dann über
  // `formatToLocalDateTimeString` in das lokale Format für den Input gebracht.
  const [startTime, setStartTime] = useState<string>(() => {
    if (startTimeParameter) {
      // Wichtig: new Date() interpretiert ISO-Strings (die meist UTC sind) korrekt.
      const date = new Date(startTimeParameter);
      // Wir wollen die LOKALE Darstellung dieses Datums im Input-Feld sehen.
      return formatToLocalDateTimeString(date);
    }
    return "";
  });

  const [endTime, setEndTime] = useState<string>(() => {
    if (endTimeParameter) {
      // Wichtig: new Date() interpretiert ISO-Strings (die meist UTC sind) korrekt.
      const date = new Date(endTimeParameter);
      // Wir wollen die LOKALE Darstellung dieses Datums im Input-Feld sehen.
      return formatToLocalDateTimeString(date);
    }
    return "";
  });

  // --- Zustandsvariablen für Alert-Dialoge ---
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertText, setAlertText] = useState<string>("");
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState<boolean>(false);

  // Callback-Funktion, die bei Erfolg des Post-Uploads aufgerufen wird.
  function handlePostUploadSuccess() {
    setIsSuccessAlertOpen(false); // Schließt den Erfolgs-Dialog
    navigate("/"); // Leitet den Benutzer auf die Startseite um
  }

  // --- Funktion zum Erstellen eines neuen Posts ---
  // Behandelt das Absenden des Formulars und sendet die Post-Daten an die API.
  const newPost = async (e: React.FormEvent) => {
    e.preventDefault();

    // Grundlegende Validierung der Formularfelder
    if (!title || !description || !locationName || !image || !startTime || !endTime) {
      setAlertTitle("Felder unvollständig");
      setAlertText("Bitte fülle alle erforderlichen Felder aus.");
      setIsAlertOpen(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("locationName", locationName);
      formData.append("imagePost", image);

      // Konvertiere die lokalen Zeit-Strings aus den Input-Feldern
      // in Date-Objekte, die JavaScript als lokale Zeit interpretiert,
      // und wandle sie DANN mit .toISOString() in UTC für das Backend um.
      formData.append("start_time", new Date(startTime).toISOString());
      formData.append("end_time", new Date(endTime).toISOString());

      const response = await axiosInstance.post("/api/post/new", formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Wichtig für FormData
        },
      });

      if (response.status === 200) {
        setAlertTitle("Post erfolgreich erstellt");
        setAlertText("Dein Post wurde erfolgreich hochgeladen.");
        setIsSuccessAlertOpen(true); // Öffnet den Erfolgs-Dialog
      } else {
        // Bei einem nicht-200-Statuscode wird ein Fehler ausgelöst oder eine Fehlermeldung gesetzt.
        setAlertTitle("Fehler beim Erstellen des Posts");
        setAlertText(response.data.message || "Unbekannter Fehler beim Erstellen des Posts.");
        setIsAlertOpen(true);
      }
    } catch (error: any) {
      // Fehlerbehandlung für Axios-Fehler oder andere Fehler
      console.error("Fehler beim Hochladen des Posts:", error);
      let errorMessage = "Unbekannter Fehler beim Hochladen des Posts.";
      if (error.isAxiosError && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setAlertTitle("Fehler beim Hochladen des Posts");
      setAlertText(errorMessage);
      setIsAlertOpen(true);
    }
  };

  // Setze den Dokumententitel beim Laden der Komponente
  useEffect(() => {
    document.title = "Post erstellen - FindDHBW";
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-postnew1.jpg')" }}
    >
      <Header />

      <div className="mt-20"></div> {/* Abstand nach dem Header */}

      <h2 className="mt-4 mb-16 text-center text-4xl underline font-bold">Post erstellen</h2>

      <div className="flex min-h-screen items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-1">
          <form className="space-y-4" onSubmit={newPost}>
            {/* Titel-Eingabefeld */}
            <div>
              <label htmlFor="title" className="block text-md font-medium text-gray-900">Titel:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-md border px-1 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required
              />
            </div>

            {/* Beschreibung (mehrzeiliges Textfeld) */}
            <div>
              <label htmlFor="description" className="block text-md font-medium text-gray-900">Beschreibung:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-md border px-1 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                rows={5} // Ermöglicht 5 sichtbare Zeilen, kann vom Benutzer skaliert werden
                required
              ></textarea>
            </div>

            {/* Ort-Eingabefeld */}
            <div>
              <label htmlFor="locationName" className="block text-md font-medium text-gray-900">Ort:</label>
              <input
                type="text"
                id="locationName"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="mt-1 w-full rounded-md border px-1 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required
              />
            </div>

            {/* Startzeit-Eingabefeld */}
            <div>
              <label htmlFor="startTime" className="block text-md font-medium text-gray-900">Startzeit:</label>
              <input
                type="datetime-local"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 w-full rounded-md border px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required
              />
            </div>

            {/* Endzeit-Eingabefeld */}
            <div>
              <label htmlFor="endTime" className="block text-md font-medium text-gray-900">Endzeit:</label>
              <input
                type="datetime-local"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 w-full rounded-md border px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required
              />
            </div>

            {/* Bild-Upload-Bereich */}
            <div>
              <label htmlFor="fileInput" className="block text-md font-medium text-gray-700 mb-2">Bild einfügen:</label>
              <div
                onClick={() => document.getElementById("fileInput")?.click()}
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-indigo-500 transition bg-gray-300"
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Vorschau"
                    className="w-full h-full object-contain rounded-md"
                  />
                ) : (
                  <span className="text-4xl text-gray-400">+</span>
                )}
              </div>
              <input
                type="file"
                id="fileInput"
                accept="image/*" // Akzeptiert nur Bilddateien
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setImage(e.target.files[0]);
                  }
                }}
                className="hidden" // Das tatsächliche Input-Feld verstecken
                required
              />
            </div>

            {/* Submit-Button */}
            <SubmitButton>Hochladen</SubmitButton>
          </form>
        </div>
      </div>

      {/* Alert- und Erfolgs-Dialoge */}
      <DialogAlert
        open={isAlertOpen}
        isOpen={() => setIsAlertOpen(false)}
        header={alertTitle}
        content={alertText}
        buttonText="Schließen"
      />
      <DialogSuccess
        open={isSuccessAlertOpen}
        isOpen={handlePostUploadSuccess}
        header={alertTitle}
        content={alertText}
        buttonText="OK"
      />
      <Footer />
    </div>
  );
}

export default PostNew;
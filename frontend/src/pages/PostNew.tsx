import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import { SubmitButton } from "./components/Button";
import DialogAlert from "../Pop-Up-Window/alert";
import axiosInstance from "../api/axiosInstance";
import Footer from "./components/Footer/Footer";

function PostNew() {
  const navigate = useNavigate();

  // --- Zustandsvariablen für Formularfelder ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  // --- Zustandsvariablen für Alert-Dialoge ---
  const [titleAlert, setTitleAlert] = useState("");
  const [descriptionAlert, setDescriptionAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);

  // --- Funktion zum Erstellen eines neuen Posts ---
  // Behandelt das Absenden des Formulars und sendet die Post-Daten an die API.
  const newPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && location && image && startTime && endTime) {
      try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("locationName", location);
        formData.append("imagePost", image);
        formData.append("start_time", startTime.toISOString());
        formData.append("end_time", endTime.toISOString());

        const response = await axiosInstance.post("/api/post/new", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          setTitleAlert("Post erfolgreich erstellt");
          setDescriptionAlert("Dein Post wurde erfolgreich erstellt.");
          setIsAlert(true);
          navigate("/"); // Weiterleitung bei Erfolg
        } else {
          setTitleAlert("Fehler beim Erstellen des Posts");
          setDescriptionAlert(response.data.message || "Unbekannter Fehler beim Erstellen des Posts.");
          setIsAlert(true);
        }
      } catch (error) {
        console.error("Fehler beim Hochladen des Posts:", error);
        setTitleAlert("Fehler beim Hochladen des Posts");
        setDescriptionAlert(error instanceof Error ? error.message : "Unbekannter Fehler beim Hochladen des Posts.");
        setIsAlert(true);
      }
    } else {
      setTitleAlert("Felder unvollständig");
      setDescriptionAlert("Bitte fülle alle Felder aus.");
      setIsAlert(true);
    }
  };

  return (
    <>
      <Header />
      <div>
            <h2 className="mt-4 mb-0 text-center text-3xl font-bold text-gray-700">Post erstellen</h2>
          </div>
      <div className="flex min-h-screen items-center justify-center bg-gray-200 px-4">
  <div className="w-full max-w-2xl bg-white p-10 rounded-xl shadow-2xl space-y-8">
          <form className="space-y-4" onSubmit={newPost}>
            <div>
              <label className="block text-xl font-medium text-gray-900">Titel</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-md border px-4 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900">Beschreibung</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-md border px-4 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900">Ort</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-md border px-4 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900">Startzeit</label>
              <input
                type="datetime-local"
                value={startTime ? startTime.toISOString().slice(0, 16) : ""}
                onChange={(e) => setStartTime(new Date(e.target.value))}
                className="mt-1 w-full rounded-md border px-4 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900">Endzeit</label>
              <input
                type="datetime-local"
                value={endTime ? endTime.toISOString().slice(0, 16) : ""}
                onChange={(e) => setEndTime(new Date(e.target.value))}
                className="mt-1 w-full rounded-md border px-4 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-300"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-2">Bild</label>
              <div
                onClick={() => document.getElementById("fileInput")?.click()}
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-indigo-500 transition bg-gray-300"
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-md"
                  />
                ) : (
                  <span className="text-4xl text-gray-400">+</span>
                )}
              </div>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setImage(e.target.files[0]);
                  }
                }}
                className="hidden"
                required
              />
            </div>

            <SubmitButton>Hochladen</SubmitButton>
          </form>
        </div>
      </div>
      <DialogAlert open={isAlert} isOpen={() => setIsAlert(false)} header={titleAlert} content={descriptionAlert} buttonText="Schließen" />
      <Footer />
    </>
  );
}

export default PostNew;
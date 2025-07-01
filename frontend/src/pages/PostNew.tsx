import { useState, useEffect } from "react"; // useEffect hinzufügen
import { useAppDispatch } from "../hooks/redux-hooks";
import { register } from "../slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation hinzufügen
import Header from "./components/Header/Header";
import { SubmitButton } from "./components/Button";
import DialogAlert from "../Pop-Up-Window/alert";
import axiosInstance from "../api/axiosInstance";

// MomentJS importieren, um Datums-Strings zu parsen und zu formatieren
import moment from "moment";

function PostNew() {
  const navigate = useNavigate();
  const location = useLocation(); // useLocation Hook initialisieren

  const [title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [locationName, setLocationName] = useState(""); // Variable angepasst von 'location' zu 'locationName' um Namenskonflikt zu vermeiden
  const [image, setImage] = useState<File | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [titleAlert, setTitleAlert] = useState("");
  const [descriptionAlert, setDescriptionAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);

  // Verwenden Sie useEffect, um die URL-Parameter beim Laden der Komponente zu prüfen
  useEffect(() => {
    if (location.state) {
      const { startTime: initialStartTime, endTime: initialEndTime } =
        location.state as { startTime: string; endTime: string };

      if (initialStartTime) {
        setStartTime(new Date(initialStartTime));
      }
      if (initialEndTime) {
        setEndTime(new Date(initialEndTime));
      }
    }
  }, [location.state]); // Abhängigkeit auf location.state setzen, damit es bei Änderungen reagiert

  // reagiert auf das submit event des Formulars
  // backend muss noch erstellt werden

  const newPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title && Description && locationName && image && startTime && endTime) { // locationName verwenden
      try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", Description);
        formData.append("locationName", locationName); // locationName verwenden
        formData.append("imagePost", image);
        formData.append("start_time", startTime.toISOString());
        formData.append("end_time", endTime.toISOString());

        const response = await axiosInstance.post("/api/post/new", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const data = response.data;
        if (response.status === 200) {
          setTitleAlert("Post erfolgreich erstellt");
          setDescriptionAlert("Dein Post wurde erfolgreich erstellt.");
          setIsAlert(true);
          console.log("Post erfolgreich erstellt:", data);
          // Optional: Eine kurze Verzögerung, bevor navigiert wird, damit der Nutzer die Nachricht sehen kann
          setTimeout(() => {
            navigate("/"); // Weiterleitung ins Hauptmenü
          }, 1500); // z.B. 1.5 Sekunden
        } else {
          setTitleAlert("Fehler beim Erstellen des Posts");
          setDescriptionAlert(
            data.message || "Unbekannter Fehler beim Erstellen des Posts."
          );
          setIsAlert(true);
          console.error("Fehler beim Erstellen des Posts:", data);
        }
      } catch (error) {
        console.error("Fehler beim Hochladen des Posts:", error);
        setTitleAlert("Fehler beim Hochladen des Posts");
        setDescriptionAlert(
          error instanceof Error
            ? error.message
            : "Unbekannter Fehler beim Hochladen des Posts."
        );
        setIsAlert(true);
      }
    } else {
      setTitleAlert("Felder unvollständig");
      setDescriptionAlert("Bitte fülle alle Felder aus.");
      setIsAlert(true);
      console.error("Alle Felder müssen ausgefüllt sein.");
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-center text-3xl font-bold text-gray-700">
              Post erstellen
            </h2>
          </div>
          <form className="space-y-4" onSubmit={newPost}>
            <div>
              <label className="block text-xl font-medium text-gray-900">
                Titel
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-md border px-4 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900">
                Beschreibung
              </label>
              <input
                type="text"
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-md border px-4 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900">
                Ort
              </label>
              <input
                type="text"
                value={locationName} // locationName verwenden
                onChange={(e) => setLocationName(e.target.value)} // setLocationName verwenden
                className="mt-1 w-full rounded-md border px-4 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900">
                Startzeit
              </label>
              <input
                type="datetime-local"
                // Formatieren des Date-Objekts für den datetime-local Input
                value={startTime ? moment(startTime).format("YYYY-MM-DDTHH:mm") : ""}
                onChange={(e) => setStartTime(new Date(e.target.value))}
                className="mt-1 w-full rounded-md border px-4 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900">
                Endzeit
              </label>
              <input
                type="datetime-local"
                // Formatieren des Date-Objekts für den datetime-local Input
                value={endTime ? moment(endTime).format("YYYY-MM-DDTHH:mm") : ""}
                onChange={(e) => setEndTime(new Date(e.target.value))}
                className="mt-1 w-full rounded-md border px-4 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-2">
                Bild
              </label>
              <div
                onClick={() => document.getElementById("fileInput")?.click()}
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-indigo-500 transition"
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
              />
            </div>

            <SubmitButton>Hochladen</SubmitButton>
          </form>
        </div>
      </div>
      <DialogAlert
        open={isAlert}
        isOpen={() => setIsAlert(false)}
        header={titleAlert}
        content={descriptionAlert}
        buttonText="Schließen"
      />
    </>
  );
}

export default PostNew;
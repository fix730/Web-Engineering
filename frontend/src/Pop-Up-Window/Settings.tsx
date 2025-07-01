import React, { useRef, useState, useEffect } from "react";
import { TabsWithIcon } from "../pages/components/Tabs";
import {
  UserCircleIcon,
  KeyIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import { LabelOverInput } from "../pages/components/Label";
import { Email, Paasswort } from "../pages/components/Inputs";
import { SubmitButton } from "../pages/components/Button";
import axiosInstance from "../api/axiosInstance";
import DialogAlert, { DialogSuccess } from "./alert";
import { fetchProfileImage } from "../utils/image";

type DialogAlertProps = {
  open: boolean;
  isOpen: () => void;
  currentImageId: number | null;
  onImageUploadSuccess?: (newImageId: number) => void;
};

const Settings: React.FC<DialogAlertProps> = ({ open, isOpen, currentImageId, onImageUploadSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [displayedImageUrl, setDisplayedImageUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States für das DialogAlert-Fenster
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertContent, setAlertContent] = useState("");
  const [isSuccessOpen, setIsSuccesstOpen] = useState(false);
  const [successHeader, setSuccessHeader] = useState("");
  const [successContent, setSuccessContent] = useState("");

  // Hilfsfunktion zum Anzeigen des Alerts
  const showAlert = (header: string, content: string) => {
    setAlertHeader(header);
    setAlertContent(content);
    setIsAlertOpen(true);
  };

  const showSuccess = (header: string, content: string) => {
    setSuccessHeader(header);
    setSuccessContent(content);
    setIsSuccesstOpen(true);

  }

  // Callback zum Schließen des Alerts
  const closeAlert = () => {
    setIsAlertOpen(false);
    setAlertHeader("");
    setAlertContent("");
  };

  const closeSuccess = () =>{
    setIsSuccesstOpen(false);
    setSuccessHeader("");
    setSuccessContent("");
   }

  // Effekt, um das vorhandene Profilbild des Benutzers zu laden
  useEffect(() => {
    const fetchCurrentImage = async () => {
      if (open && currentImageId) {
        fetchProfileImage({
          onSetImageUrl: setDisplayedImageUrl, imageId: currentImageId, profilePlaceholder: undefined
        });
      } else if (open && !currentImageId) {
        setDisplayedImageUrl(undefined);
      }
    };

    fetchCurrentImage();

    return () => {
      if (displayedImageUrl) {
        URL.revokeObjectURL(displayedImageUrl);
      }
    };
  }, [currentImageId, open]);

  // Handler für Passwortänderung
  const handleChangePasswort = async () => {
    if (password !== passwordConfirm) {
      showAlert("Fehler", "Die neuen Passwörter stimmen nicht überein.");
      return;
    }
    try {
      const response = await axiosInstance.patch("api/user/data", {
          currentPasswort: currentPassword,
          newPassword: password
      });
      const data = response.data;

      if (response.status === 200) {
        showSuccess("Erfolg", "Passwort erfolgreich aktualiseiert!");
      }
      setSelectedImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      } else {
        showAlert("Fehler", data.message || "Fehler beim Aktualisieren des Passworts.");
        console.error("Upload Fehler:", data);
      }

    } catch (error: any) {
      showAlert(
        "Fehler",
        error.response?.data?.message || error.message || "Netzwerkfehler: Konnte keine Verbindung zum Server herstellen."
      );
      console.error("Axios Upload Fehler:", error.response?.data || error.message);
    }
    
  };

  // Handler für E-Mail-Änderung (Beispiel)
  const handleChangeEmail = async () => {
    try {
      const response = await axiosInstance.patch("api/user/data", {
          email: email
      });
      const data = response.data;

      if (response.status === 200) {
        showSuccess("Erfolg", "E-Mail erfolgreich aktualiseiert!");
      }
      setSelectedImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      } else {
        showAlert("Fehler", data.message || "Fehler beim Aktualisieren der E-Mail Adresse.");
        console.error("Upload Fehler:", data);
      }

    } catch (error: any) {
      showAlert(
        "Fehler",
        error.response?.data?.message || error.message || "Netzwerkfehler: Konnte keine Verbindung zum Server herstellen."
      );
      console.error("Axios Upload Fehler:", error.response?.data || error.message);
    }
  };

  // Handler für Bild-Upload (mit Axios)
  const handleImageUpload = async () => {
    if (!selectedImageFile) {
      showAlert("Fehler", "Bitte wählen Sie ein Bild zum Hochladen aus.");
      return;
    }

    showAlert("Information", "Bild wird hochgeladen...");
    const formData = new FormData();
    formData.append("profileImage", selectedImageFile);

    try {
      const response = await axiosInstance.post("/api/user/upload-profile-image", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;

      if (response.status === 200) {
        closeAlert(); // Schließe das Alert-Fenster zum Bild Hochladen
        showSuccess("Erfolg", data.message || "Profilbild erfolgreich hochgeladen!");
        if (data.imageId) {
          setDisplayedImageUrl(URL.createObjectURL(selectedImageFile));
          if (onImageUploadSuccess) {
            onImageUploadSuccess(data.imageId);
          }
        }
        setSelectedImageFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        showAlert("Fehler", data.message || "Fehler beim Hochladen des Profilbilds.");
        console.error("Upload Fehler:", data);
      }
    } catch (error: any) {
      showAlert(
        "Fehler",
        error.response?.data?.message || error.message || "Netzwerkfehler: Konnte keine Verbindung zum Server herstellen."
      );
      console.error("Axios Upload Fehler:", error.response?.data || error.message);
    }
  };



  const myTabData = [
    {
      label: "Passwort",
      value: "0",
      icon: KeyIcon,
      desc: (
        <div className="flex flex-col items-center">
          <div className="w-full mt-2">
            <LabelOverInput>Aktuelles Passwort</LabelOverInput>
            <Paasswort
              handleChncePassword={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
              password={currentPassword}
              autoComplete="current-password"
            />
          </div>
          <div className="w-full mt-2">
            <LabelOverInput>Neues Passwort</LabelOverInput>
            <Paasswort handleChncePassword={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} password={password} autoComplete="new-password" />
          </div>
          <div className="w-full mt-2">
            <LabelOverInput>Neues Passwort bestätigen</LabelOverInput>
            <Paasswort
              handleChncePassword={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirm(e.target.value)}
              password={passwordConfirm}
              autoComplete="new-password"
            />
          </div>
          <div className="mt-4 w-full">
            <SubmitButton onClick={handleChangePasswort}>Passwort ändern</SubmitButton>
          </div>
        </div>
      )
    },
    {
      label: "E-Mail",
      value: "1",
      icon: EnvelopeIcon,
      desc: (
        <div className="flex flex-col items-center">
          <div className="w-full mt-2">
            <LabelOverInput>Neue E-Mail Adresse</LabelOverInput>
            <Email
              handleChnceEmail={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              email={email}
            />
          </div>
          <div className="mt-4 w-full">
            <SubmitButton onClick={handleChangeEmail}>E-Mail Adresse ändern</SubmitButton>
          </div>
        </div>
      )
    },
    {
      label: "Profilbild",
      value: "2",
      icon: UserCircleIcon,
      desc: (
        <div>
          <label className="block text-xl font-medium text-gray-700 mb-2">Profilbild hochladen</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-indigo-500 transition"
          >
            {selectedImageFile ? (
              <img
                src={URL.createObjectURL(selectedImageFile)}
                alt="Vorschau ausgewähltes Bild"
                className="w-full h-full object-contain rounded-md"
              />
            ) : displayedImageUrl ? (
              <img
                src={displayedImageUrl}
                alt="Aktuelles Profilbild"
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
                setSelectedImageFile(e.target.files[0]);
                // Das Alert-Fenster hier nicht schließen, nur neue Auswahl vorbereiten
              }
            }}
            className="hidden"
            ref={fileInputRef}
          />
          <div className="mt-4 w-full">
            <SubmitButton onClick={handleImageUpload}>Profilbild speichern</SubmitButton>
          </div>
        </div>
      ),
    }
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-black">Einstellungen</h2>
        {/* KEINE direkte Anzeige von Nachrichten hier */}
        <TabsWithIcon tabContent={myTabData} />
        <div className="flex justify-end mt-4">
          <button onClick={isOpen} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Schließen
          </button>
        </div>
      </div>
      {/* Das DialogAlert-Fenster wird hier gerendert */}
      <DialogAlert
        open={isAlertOpen}
        isOpen={closeAlert} 
        header={alertHeader}
        content={alertContent}
      />
      <DialogSuccess
        open={isSuccessOpen}
        isOpen={closeSuccess}
        header={successHeader}
        content={successContent}
      />
    </div>
  );
};

export default Settings;
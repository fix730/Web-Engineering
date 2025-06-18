import React, { useState } from "react";
import { TabsWithIcon } from "../pages/components/Tabs";
import {
  Square3Stack3DIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  KeyIcon,
  EnvelopeIcon,
  
} from "@heroicons/react/24/solid";
import keyImage from "../assets/key.png";
import { LabelOverInput } from "../pages/components/Label";
import { Email, Paasswort } from "../pages/components/Inputs";
import { SubmitButton } from "../pages/components/Button";

type DialogAlertProps = {
  open: boolean;
  isOpen: () => void;
};

const Settings: React.FC<DialogAlertProps> = ({ open, isOpen }) => {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [image, setImage] = useState<File | null>(null);
  const handleChangePasswort = () => {
  
    if (password !== passwordConfirm) {
      alert("Die Passwörter stimmen nicht überein.");
      return;
    }
    // Hier sollte die Logik zum Ändern des Passworts implementiert werden
    console.log("Passwort geändert:", currentPassword, password);
    // Nach erfolgreicher Änderung das Formular zurücksetzen
    setCurrentPassword("");
    setPassword("");
    setPasswordConfirm("");
  }
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
                handleChncePassword={(e: any) => setCurrentPassword(e.target.value)}
                password={currentPassword}
                autoComplete="current-password"
              />
              
          </div>
          <div className="w-full mt-2">
            <LabelOverInput>Neues Passwort</LabelOverInput>
            <Paasswort handleChncePassword={(e: any) => setPassword(e.target.value)} password={password} autoComplete="new-password" />
          </div>
          <div className="w-full mt-2">
            <LabelOverInput>Neues Passwort bestätigen</LabelOverInput>
            <Paasswort
              handleChncePassword={(e: any) => setPasswordConfirm(e.target.value)}
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
      icon: EnvelopeIcon ,
      desc: (
        <div className="flex flex-col items-center">
          <div className="w-full mt-2">
            <LabelOverInput>neue E-Mail Adresse</LabelOverInput>
            <Email
              handleChnceEmail={(e: any) => setEmail(e.target.value)}
              email={email}
            />
          </div>
          <div className="mt-4 w-full">
            <SubmitButton>E-Mail Adresse ändern</SubmitButton>
          </div>
        </div>
      )
    },
    {
      label: "Profilbild",
      value: "2",
      icon: UserCircleIcon,
      desc: "",
    }
  ];

  if (!open) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-black">Einstellungen</h2>
        <TabsWithIcon tabContent={myTabData} />
        <div className="flex justify-end">
          <button onClick={isOpen} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
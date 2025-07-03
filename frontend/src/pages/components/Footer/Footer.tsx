import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import Settings from "../../../Pop-Up-Window/Settings";
import {Help} from "../../../Pop-Up-Window/Help";


const Footer = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <footer className="bg-black text-center text-xs text-white py-6">
        <nav className="flex flex-wrap justify-center space-x-4 mb-4">
          <div className="flex items-center">
    </div>


          <button onClick={() => navigate("/")} className="font-semibold hover:underline">
            Startseite
          </button>
          <button onClick={() => navigate("/posts/new")} className="font-semibold hover:underline">
            Post erstellen
          </button>
          <button onClick={() => setSettingsOpen(true)} className="font-semibold hover:underline">
            Einstellungen
          </button>
          <button onClick={() => setHelpOpen(true)} className="font-semibold hover:underline">
            Hilfe
          </button>
        </nav>
        <div>
          © 2025 FindDHBW
        </div>
      </footer>

      <Settings
        open={settingsOpen}
        isOpen={() => setSettingsOpen(false)}
        currentImageId={null}
        onImageUploadSuccess={() => {}}
      />
      <Help 
        open={helpOpen}
        isOpen={() => setHelpOpen(false)}
      />
    </>
  );
};

export default Footer;


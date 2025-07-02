import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import Settings from "../../../Pop-Up-Window/Settings";

const Footer = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <footer className="bg-gray-400 text-center text-xs text-black py-6">
        <nav className="flex flex-wrap justify-center space-x-4 mb-4">
          <button onClick={() => navigate("/")} className="font-semibold hover:underline">
            Start
          </button>
          <button onClick={() => navigate("/posts/new")} className="font-semibold hover:underline">
            Post erstellen
          </button>
          <button onClick={() => setSettingsOpen(true)} className="font-semibold hover:underline">
            Einstellungen
          </button>
          <button className="font-semibold hover:underline">
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
    </>
  );
};

export default Footer;


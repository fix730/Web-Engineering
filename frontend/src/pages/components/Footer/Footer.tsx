import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import Settings from "../../../Pop-Up-Window/Settings";

const Footer = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
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
            Hilfe
          </button>
        </nav>

        <div className="flex justify-center items-center space-x-2 mb-2">
          <button
            onClick={() => setLanguageOpen(!languageOpen)}
            className="flex items-center font-semibold hover:underline"
            aria-label="Sprache auswählen"
          >
            Deutsch <ChevronDown size={14} className="ml-1" />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-600 hover:text-blue-600"
            aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="flex flex-col space-y-2 mb-4">
            <button onClick={() => navigate("/")} className="font-semibold hover:underline text-left w-full">
              Start
            </button>
            <button onClick={() => navigate("/posts/new")} className="font-semibold hover:underline text-left w-full">
              Post erstellen
            </button>
            <button onClick={() => setHelpOpen(true)} className="font-semibold hover:underline text-left w-full">
              Hilfe
            </button>
          </nav>
        )}

        <div>
          © {new Date().getFullYear()} FindDHBW
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


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const Footer = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <footer className="bg-white text-center text-xs text-gray-500 py-6">
      {/* Link-Zeile */}
      <nav className="flex flex-wrap justify-center space-x-4 mb-4">
        <button onClick={() => navigate("/")} className="font-semibold hover:underline">
          Start
        </button>
        <button onClick={() => navigate("/posts/new")} className="font-semibold hover:underline">
          Post erstellen
        </button>
        <button onClick={() => navigate("/login")} className="font-semibold hover:underline">
          Login
        </button>
        <button onClick={() => navigate("/register")} className="font-semibold hover:underline">
          Registrieren
        </button>
        <button onClick={() => navigate("/einstellungen")} className="font-semibold hover:underline">
          Einstellungen
        </button>
      </nav>

      {/* Sprache und Mobile Menu Toggle */}
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

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="flex flex-col space-y-2 mb-4">
          <button onClick={() => navigate("/")} className="font-semibold hover:underline text-left w-full">
            Start
          </button>
          <button onClick={() => navigate("/posts/new")} className="font-semibold hover:underline text-left w-full">
            Post erstellen
          </button>
          <button onClick={() => navigate("/login")} className="font-semibold hover:underline text-left w-full">
            Login
          </button>
          <button onClick={() => navigate("/register")} className="font-semibold hover:underline text-left w-full">
            Registrieren
          </button>
          <button onClick={() => navigate("/einstellungen")} className="font-semibold hover:underline text-left w-full">
            Einstellungen
          </button>
        </nav>
      )}

      {/* Copyright */}
      <div>
        © {new Date().getFullYear()} FindDHBW
      </div>
    </footer>
  );
};

export default Footer;

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavigationLink } from "./compnents";
import { AllNavigationLinks, ProfileMenu } from "./elemnts";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="bg-black text-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-20">
          <div className="hidden md:block">
            <Link to="/">
              <img
                src="/finddhbwlogo.png"
                alt="Logo"
                className="h-14 w-auto mr-20 hover:scale-110 transition-transform duration-200"
              />
            </Link>
          </div>


          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 mr-auto"> {/*mr-auto bedeutet nach links ausrichten */}
            <AllNavigationLinks />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 hover:text-blue-600">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <div className="ml-auto" >
            <ProfileMenu />
          </div>

        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="flex flex-col space-y-2 px-4 py-2"> {/* felx-col für vertikale Anordnung*/}
          <AllNavigationLinks className="border-b pb-2" />
        </div>
      )}
    </header>
  );
};

export default Header;
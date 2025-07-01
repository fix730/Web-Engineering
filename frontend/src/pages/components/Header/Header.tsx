import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavigationLink } from "./compnents";
import { AllNavigationLinks, ProfileMenu } from "./elemnts";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="bg-gray-300 text-black shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 mr-auto"> {/*mr-auto bedeutet nach links ausrichten */}
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
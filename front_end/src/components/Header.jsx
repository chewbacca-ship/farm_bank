import { useState } from "react";
import Navigation from "./Navigation";
import { Menu, XIcon, LayoutDashboard, Leaf} from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative ">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-green-900/50 via-transparent to-emerald-900/30"></div>
      {/* Header: mobile/tablet only */}
      <header className="flex justify-between items-center p-4 backdrop-blur-md border-b border-[#2d5a2d] lg:hidden">
        

        <h1 className=" flex flex-row text-lg font-semibold text-white">
        <div className="text-xl mr-2 "><Leaf className="w-6 h-6 text-white" /></div>
          Pasture Portfolio
        </h1>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
          {isMenuOpen ? <XIcon /> : <Menu />}
        </button>
      </header>

      {/* Mobile dropdown navigation */}
      <div
        className={`
          absolute z-20  w-full overflow-hidden transition-all duration-300 ease-out lg:hidden bg-gradient-to-br from-slate-900 via-emerald-900 text-white 
          ${
            isMenuOpen
              ? "max-h-96 opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-2"
          }
        `}
      >
        <Navigation onItemSelect={() => setIsMenuOpen(false)} />
      </div>

      
      <nav className="hidden lg:block text-white relative z-50">
        <div className="flex flex-row">
            <Leaf className="w-6 h-6 text-white" />
            <h2 className="font-bold text-white">Pasture Portfolio</h2>

        </div>
        
        <Navigation />
      </nav>
    </div>
  );
};

export default Header;


import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Mock user - would be replaced with actual auth state
  const user = { name: "Arjun Kumar", isLoggedIn: true };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/barter", label: "Barter" },
    { path: "/sell", label: "Sell" },
    { path: "/donations", label: "Donations" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="font-bold text-2xl md:text-3xl text-primary flex items-center gap-1"
          >
            <span className="text-vismay-600">Vismay</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium text-base transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "text-primary font-semibold"
                    : "text-foreground/80 hover:text-primary"
                } link-underline`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User section for desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user.isLoggedIn ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent hover:bg-accent/80 transition-colors duration-200 cursor-pointer">
                <User size={18} className="text-primary" />
                <span className="font-medium text-sm">{user.name}</span>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-vismay py-2"
              >
                Login / Register
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-in-out transform ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-10">
            <Link 
              to="/" 
              className="font-bold text-2xl text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-vismay-600">Vismay</span>
            </Link>
            <button
              className="text-foreground focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col space-y-6 items-center justify-center flex-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium text-lg ${
                  location.pathname === item.path
                    ? "text-primary font-semibold"
                    : "text-foreground/70"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* User section for mobile */}
            {user.isLoggedIn ? (
              <div className="flex items-center gap-2 mt-4 px-5 py-2 rounded-full bg-accent">
                <User size={18} className="text-primary" />
                <span className="font-medium">{user.name}</span>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-vismay mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

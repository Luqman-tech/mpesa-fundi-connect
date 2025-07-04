import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/fundi-connect-logo.jpg" alt="Fundi Connect Logo" className="w-10 h-10 rounded-xl object-contain" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Fundi Connect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <a href="#services" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Services
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors font-medium">
              How It Works
            </a>
            <a href="#providers" className="text-gray-700 hover:text-primary transition-colors font-medium">
              For Providers
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={signOut}
                  className="border-gray-200 hover:border-primary hover:text-primary"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost"
                  onClick={() => navigate("/auth")}
                  className="text-gray-700 hover:text-primary"
                >
                  Login
                </Button>
                <Button 
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Home
              </Link>
              <a href="#services" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Services
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors font-medium">
                How It Works
              </a>
              <a href="#providers" className="text-gray-700 hover:text-primary transition-colors font-medium">
                For Providers
              </a>
              <div className="pt-4 border-t border-gray-100">
                {user ? (
                  <div className="flex flex-col space-y-3">
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate("/dashboard")}
                      className="justify-start text-gray-700 hover:text-primary"
                    >
                      Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={signOut}
                      className="justify-start border-gray-200 hover:border-primary hover:text-primary"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Button 
                      variant="ghost"
                      onClick={() => navigate("/auth")}
                      className="justify-start text-gray-700 hover:text-primary"
                    >
                      Login
                    </Button>
                    <Button 
                      className="justify-start bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
                      onClick={() => navigate("/auth")}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

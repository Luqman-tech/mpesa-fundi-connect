
import { Phone, Menu, User, Bell, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FB</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">FundisBot</span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#services" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Services</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-green-600 font-medium transition-colors">How It Works</a>
            <a href="#providers" className="text-gray-600 hover:text-green-600 font-medium transition-colors">For Providers</a>
            <a href="#about" className="text-gray-600 hover:text-green-600 font-medium transition-colors">About</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden sm:flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Get Started
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

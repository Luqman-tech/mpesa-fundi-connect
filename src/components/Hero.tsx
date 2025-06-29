
import { MessageCircle, Star, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div className="mb-12 lg:mb-0">
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-800">Trusted by 2000+ clients</span>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Book Trusted
              <span className="text-green-600"> Fundis </span>
              via WhatsApp
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with verified local service providers instantly. From plumbers to cleaners, 
              electricians to tutors - all through WhatsApp with secure M-Pesa payments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Start on WhatsApp</span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-semibold"
              >
                Join as Provider
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Verified Providers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-green-600" />
                <span>Instant Booking</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-green-600">M-PESA</span>
                <span>Secure Payments</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="bg-green-600 rounded-t-lg p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-semibold">WhatsApp Business</span>
                </div>
                <div className="text-sm opacity-90">+254 700 123 456</div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm">Hi! I need a plumber for my kitchen sink 🔧</p>
                  <div className="text-xs text-gray-500 mt-1">2:30 PM</div>
                </div>
                
                <div className="bg-green-100 rounded-lg p-3 max-w-xs ml-auto">
                  <p className="text-sm">Found 3 verified plumbers near you! 
                  <br />📍 Westlands, Nairobi
                  <br />⭐ 4.8+ rating
                  <br />💰 KES 2,500 - 4,000</p>
                  <div className="text-xs text-gray-500 mt-1">2:31 PM</div>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm">Book John K. for tomorrow 10 AM ✅</p>
                  <div className="text-xs text-gray-500 mt-1">2:32 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

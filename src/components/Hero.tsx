
import { Button } from "@/components/ui/button";
import { MessageCircle, Star, Users } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/254700000000', '_blank');
  };

  return (
    <section className="bg-gradient-to-r from-green-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Find Trusted <span className="text-green-600">Service Providers</span> in Kenya
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with verified fundis for home repairs, cleaning, tutoring, and more. 
              Book instantly via WhatsApp and pay securely with M-Pesa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
                onClick={handleGetStarted}
              >
                {user ? 'Go to Dashboard' : 'Book a Service'}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-3 border-green-600 text-green-600 hover:bg-green-50"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </Button>
            </div>

            <div className="flex items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                <span>500+ Verified Providers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>4.7/5 Average Rating</span>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <div className="relative">
              <img
                src="/placeholder.svg"
                alt="Service providers at work"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Quick Response</p>
                    <p className="text-sm text-gray-600">Get matched in minutes</p>
                  </div>
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

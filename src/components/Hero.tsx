import { ArrowRight, Shield, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
                <span className="text-sm font-medium text-gray-700">🚀 Trusted by 10,000+ customers</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Find Skilled
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                  Fundis Near You
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Connect with verified local professionals for all your home and business needs. 
                Fast, reliable, and affordable services at your fingertips.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {user ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-200 hover:border-primary hover:text-primary bg-white/80 backdrop-blur-sm"
                onClick={() => {
                  const section = document.getElementById('how-it-works');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-gray-700">Verified Professionals</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-secondary" />
                </div>
                <p className="text-sm font-medium text-gray-700">Quick Response</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <p className="text-sm font-medium text-gray-700">24/7 Support</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-100">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">JM</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">John Mechanic</p>
                      <p className="text-sm text-gray-500">Car Repair Specialist</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★★★★★</span>
                    </div>
                    <p className="text-sm text-gray-500">4.9 rating</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Response time:</span>
                    <span className="font-semibold text-secondary">30 mins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed jobs:</span>
                    <span className="font-semibold text-primary">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-semibold text-gray-900">2.3 km away</span>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white"
                  onClick={() => {
                    if (user) {
                      navigate("/bookings/new");
                    } else {
                      navigate("/auth?redirect=/bookings/new");
                    }
                  }}
                >
                  Book Now - KSh 2,500
                </Button>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-secondary/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
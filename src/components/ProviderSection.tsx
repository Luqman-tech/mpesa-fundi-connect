import { TrendingUp, Clock, CreditCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { whatsappClient } from "@/integrations/whatsapp/client";

const ProviderSection = () => {
  const { user } = useAuth();

  const benefits = [
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Access more customers and increase your income with our platform",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Work when you want and manage your own availability",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Get paid quickly and securely through our payment system",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Shield,
      title: "Verified Platform",
      description: "Build trust with customers through our verification system",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const testimonials = [
    {
      name: "Michael Kamau",
      role: "Electrician",
      content: "FundisBot has transformed my business. I now get 3x more clients than before!",
      rating: 5,
      avatar: "MK",
    },
    {
      name: "Grace Wanjiku",
      role: "House Cleaner",
      content: "The platform is easy to use and payments are always on time. Highly recommend!",
      rating: 5,
      avatar: "GW",
    },
  ];

  const handleContactFundi = async (fundi) => {
    if (!user) {
      alert('Please log in to contact fundis');
      return;
    }

    try {
      // Record the lead first
      await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: user.id,
          fundi_id: fundi.id,
          client_phone: user.user_metadata?.phone || user.phone,
          fundi_phone: fundi.phone,
        }),
      });
      
      // Then open WhatsApp
      whatsappClient.openChat({ 
        phone: fundi.phone, 
        message: 'Hi, I need your service.' 
      });
    } catch (error) {
      console.error('Error recording lead:', error);
      // Still open WhatsApp even if lead recording fails
      whatsappClient.openChat({ 
        phone: fundi.phone, 
        message: 'Hi, I need your service.' 
      });
    }
  };

  return (
    <section id="providers" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-secondary/10 rounded-full mb-6">
            <span className="text-sm font-semibold text-secondary">For Service Providers</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Join Our
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Provider Network</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Turn your skills into a thriving business. Connect with customers who need your services 
            and grow your income with FundisBot.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Benefits */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Why Choose FundisBot?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4`}>
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Provider mockup */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Your Earnings</h4>
                  <span className="text-sm text-gray-500">This month</span>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">KSh 89,500</div>
                <div className="flex items-center text-sm text-secondary">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+23% from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Car Service</p>
                      <p className="text-sm text-gray-500">Tomorrow, 10:00 AM</p>
                    </div>
                    <span className="text-primary font-semibold">KSh 4,500</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Home Cleaning</p>
                      <p className="text-sm text-gray-500">Today, 2:00 PM</p>
                    </div>
                    <span className="text-secondary font-semibold">KSh 2,800</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-secondary/20 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">What Our Providers Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-12 border border-gray-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Earning?</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of successful service providers who have grown their business with FundisBot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Become a Provider
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-200 hover:border-primary hover:text-primary"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderSection;

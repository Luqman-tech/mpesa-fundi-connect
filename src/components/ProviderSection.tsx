
import { Smartphone, DollarSign, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ProviderSection = () => {
  const benefits = [
    {
      icon: Smartphone,
      title: "Easy Setup",
      description: "Register and start earning through WhatsApp in minutes"
    },
    {
      icon: DollarSign,
      title: "Keep 85% Earnings",
      description: "Low platform fees mean more money in your pocket"
    },
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Access analytics and tools to expand your client base"
    },
    {
      icon: Shield,
      title: "Verified Profile",
      description: "Build trust with verified credentials and reviews"
    }
  ];

  return (
    <section id="providers" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div className="mb-12 lg:mb-0">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Grow Your Service Business
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join hundreds of service providers earning more by connecting with clients 
              through our WhatsApp-based platform. No complicated apps or websites needed.
            </p>

            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Earning Today
              </Button>
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Learn More
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">KES 45K</div>
                <div className="text-sm text-gray-600">Avg. Monthly Earnings</div>
                <div className="text-xs text-gray-500 mt-1">Top 20% of providers</div>
              </CardContent>
            </Card>
            
            <Card className="transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">4.8★</div>
                <div className="text-sm text-gray-600">Provider Rating</div>
                <div className="text-xs text-gray-500 mt-1">Average across platform</div>
              </CardContent>
            </Card>
            
            <Card className="transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Support Available</div>
                <div className="text-xs text-gray-500 mt-1">WhatsApp assistance</div>
              </CardContent>
            </Card>
            
            <Card className="transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">15%</div>
                <div className="text-sm text-gray-600">Platform Fee</div>
                <div className="text-xs text-gray-500 mt-1">Industry leading low rate</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderSection;

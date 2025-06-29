
import { MessageCircle, Search, CreditCard, Star } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: MessageCircle,
      title: "Message on WhatsApp",
      description: "Send us your service request via WhatsApp. Describe what you need and when you need it.",
      color: "bg-green-100 border-green-200"
    },
    {
      icon: Search,
      title: "Get Matched",
      description: "Our system finds verified providers near you based on your location, requirements, and budget.",
      color: "bg-blue-100 border-blue-200"
    },
    {
      icon: CreditCard,
      title: "Book & Pay",
      description: "Choose your preferred provider and pay securely through M-Pesa. Track your booking in real-time.",
      color: "bg-purple-100 border-purple-200"
    },
    {
      icon: Star,
      title: "Rate Experience",
      description: "After service completion, rate your provider to help maintain quality standards for all users.",
      color: "bg-orange-100 border-orange-200"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Book trusted service providers in 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className={`${step.color} border-2 rounded-2xl p-6 text-center h-full flex flex-col justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    <step.icon className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-green-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

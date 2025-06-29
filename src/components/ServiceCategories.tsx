
import { Wrench, Sparkles, GraduationCap, Car, Home, Scissors, Camera, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ServiceCategories = () => {
  const categories = [
    {
      icon: Wrench,
      title: "Home Repairs",
      description: "Plumbers, electricians, carpenters",
      providers: "150+ providers",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Sparkles,
      title: "Cleaning Services",
      description: "House cleaning, office cleaning",
      providers: "80+ providers",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: GraduationCap,
      title: "Tutoring",
      description: "Academic subjects, languages",
      providers: "120+ providers",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Car,
      title: "Auto Services",
      description: "Mechanics, car wash, repairs",
      providers: "60+ providers",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Home,
      title: "Home Services",
      description: "Gardening, security, maintenance",
      providers: "90+ providers",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: Scissors,
      title: "Beauty & Wellness",
      description: "Hairdressers, massage, fitness",
      providers: "70+ providers",
      color: "bg-pink-100 text-pink-600"
    },
    {
      icon: Camera,
      title: "Photography",
      description: "Events, portraits, commercial",
      providers: "40+ providers",
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      icon: Users,
      title: "Event Services",
      description: "Catering, decoration, planning",
      providers: "55+ providers",
      color: "bg-teal-100 text-teal-600"
    }
  ];

  return (
    <section id="services" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Popular Service Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From home repairs to personal services, find trusted professionals for any job
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium">{category.providers}</span>
                  <span className="text-xs text-gray-400">Available now</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;

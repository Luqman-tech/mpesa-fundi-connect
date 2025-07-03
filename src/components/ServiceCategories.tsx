
import { Wrench, Zap, Paintbrush, Car, Home, Laptop, Scissors, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ServiceCategories = () => {
  const categories = [
    {
      icon: Wrench,
      title: "Plumbing",
      description: "Pipes, fixtures, and water systems",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      count: "120+ providers",
    },
    {
      icon: Zap,
      title: "Electrical",
      description: "Wiring, installations, and repairs",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      count: "89+ providers",
    },
    {
      icon: Car,
      title: "Auto Repair",
      description: "Vehicle maintenance and repairs",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      count: "156+ providers",
    },
    {
      icon: Paintbrush,
      title: "Painting",
      description: "Interior and exterior painting",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      count: "78+ providers",
    },
    {
      icon: Home,
      title: "Carpentry",
      description: "Furniture and woodwork services",
      color: "from-amber-600 to-orange-600",
      bgColor: "bg-amber-50",
      count: "92+ providers",
    },
    {
      icon: Laptop,
      title: "Tech Support",
      description: "Computer and device repairs",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      count: "45+ providers",
    },
    {
      icon: Scissors,
      title: "Beauty & Grooming",
      description: "Hair, nails, and beauty services",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      count: "67+ providers",
    },
    {
      icon: Camera,
      title: "Photography",
      description: "Events and portrait photography",
      color: "from-slate-600 to-gray-600",
      bgColor: "bg-slate-50",
      count: "34+ providers",
    },
  ];

  return (
    <section id="services" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-6">
            <span className="text-sm font-semibold text-primary">Popular Services</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Services You Can
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Trust</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From home repairs to personal services, find skilled professionals for every need. 
            All our providers are verified and rated by the community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-105 cursor-pointer overflow-hidden"
            >
              <CardContent className="p-0">
                <div className={`${category.bgColor} p-6 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 bg-white/70 px-3 py-1 rounded-full">
                        {category.count}
                      </span>
                      <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center group-hover:bg-white/50 transition-colors">
                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">Can't find what you're looking for?</p>
          <button className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-semibold transition-all duration-300">
            Request Custom Service
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;


import { Users, CheckCircle, Star, MapPin } from "lucide-react";

const Stats = () => {
  const stats = [
    {
      icon: Users,
      value: "500+",
      label: "Active Providers",
      description: "Verified professionals",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: CheckCircle,
      value: "2,000+",
      label: "Completed Jobs",
      description: "Successful bookings",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
    },
    {
      icon: Star,
      value: "4.7/5",
      label: "Average Rating",
      description: "Customer satisfaction",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
    },
    {
      icon: MapPin,
      value: "15+",
      label: "Cities Covered",
      description: "Across Kenya",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-white/5"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <span className="text-sm font-semibold text-white">Our Impact</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Join the growing community of satisfied customers and service providers 
            who trust FundisBot for quality connections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-3">{stat.value}</div>
                <div className="text-xl text-white font-semibold mb-2">{stat.label}</div>
                <div className="text-white/80">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-2xl mx-auto border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">Be Part of Our Success Story</h3>
            <p className="text-white/90 mb-6">Whether you're looking for services or want to offer your skills, we're here to help you succeed.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg">
                Find Services
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-primary transition-all duration-300">
                Become a Provider
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;

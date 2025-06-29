
import { Users, CheckCircle, Star, MapPin } from "lucide-react";

const Stats = () => {
  const stats = [
    {
      icon: Users,
      value: "500+",
      label: "Active Providers",
      description: "Verified professionals"
    },
    {
      icon: CheckCircle,
      value: "2,000+",
      label: "Completed Jobs",
      description: "Successful bookings"
    },
    {
      icon: Star,
      value: "4.7/5",
      label: "Average Rating",
      description: "Customer satisfaction"
    },
    {
      icon: MapPin,
      value: "15+",
      label: "Cities Covered",
      description: "Across Kenya"
    }
  ];

  return (
    <section className="py-16 bg-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Join the growing community of satisfied customers and service providers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-xl text-white font-semibold mb-1">{stat.label}</div>
              <div className="text-green-100">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;

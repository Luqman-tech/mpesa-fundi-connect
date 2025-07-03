import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BookingForm from '@/components/booking/BookingForm';
import BookingsList from '@/components/booking/BookingsList';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [subscribing, setSubscribing] = useState(false);
  const [fundiStats, setFundiStats] = useState({ total: 0, commission: 0, net: 0, completed: 0, leadCommission: 0 });
  const role = user?.user_metadata?.role || 'client';

  useEffect(() => {
    if (role !== 'fundi' || !user) return;
    const fetchFundiStats = async () => {
      // Fetch booking stats
      const bookingResponse = await fetch(`http://localhost:5000/api/fundi/bookings-stats?fundi_id=${user.id}`);
      const bookingData = await bookingResponse.json();
      
      // Fetch lead stats
      const leadResponse = await fetch(`http://localhost:5000/api/fundi/leads-stats?fundi_id=${user.id}`);
      const leadData = await leadResponse.json();
      
      if (!bookingData.error && !leadData.error) {
        setFundiStats({
          ...bookingData.data,
          leadCommission: leadData.data.leadCommission || 0
        });
      }
    };
    fetchFundiStats();
  }, [role, user]);

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const response = await fetch('http://localhost:5000/api/fundi/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user.phone, // fundi's phone number
          fundi_id: user.id  // fundi's id
        })
      });
      const data = await response.json();
      if (data.error) {
        alert('Payment initiation failed: ' + data.error);
      } else {
        alert('Payment initiated! Please complete the M-Pesa prompt on your phone.');
        // Optionally, poll for subscription status update
      }
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FundisBot Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage your bookings and services</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-semibold text-gray-900">
                  {user?.user_metadata?.name || user?.email}
                </p>
              </div>
              <Button 
                onClick={signOut} 
                variant="outline"
                className="border-gray-200 hover:border-primary hover:text-primary"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm">📋</span>
                </div>
                Book a Service
              </CardTitle>
              <p className="text-gray-600">Find and book professional services near you</p>
            </CardHeader>
            <CardContent>
              {role === 'client' ? <BookingForm /> : <div className="text-gray-500">Only clients can book services.</div>}
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm">📊</span>
                </div>
                {role === 'fundi' ? 'Jobs You Got' : 'Your Bookings'}
              </CardTitle>
              <p className="text-gray-600">{role === 'fundi' ? 'Track your jobs and earnings' : 'Track your service requests and history'}</p>
            </CardHeader>
            <CardContent>
              <BookingsList role={role} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {role === 'fundi' ? (
            <>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-white text-lg">💰</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">KES {fundiStats.total.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Earnings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-rose-50 to-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-white text-lg">🧾</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">KES {fundiStats.commission.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Commission</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-white text-lg">✅</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">KES {fundiStats.net.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Net Earnings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-white text-lg">💸</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">KES {fundiStats.leadCommission.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Lead Commission</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-white text-lg">📋</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">5</p>
                      <p className="text-sm text-gray-600">Total Bookings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-white text-lg">✅</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">3</p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-white text-lg">⭐</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">4.8</p>
                      <p className="text-sm text-gray-600">Avg Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {role === 'fundi' && (
          <Button
            onClick={handleSubscribe}
            disabled={subscribing}
          >
            {subscribing ? "Processing..." : "Subscribe for KES 1000 (one-time)"}
          </Button>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

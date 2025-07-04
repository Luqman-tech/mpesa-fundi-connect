import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BookingForm from '@/components/booking/BookingForm';
import BookingsList from '@/components/booking/BookingsList';
import { useEffect, useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [subscribing, setSubscribing] = useState(false);
  const [fundiStats, setFundiStats] = useState({ total: 0, commission: 0, net: 0, completed: 0, leadCommission: 0 });
  const [viewMode, setViewMode] = useState<'client' | 'fundi'>('client');
  const [dashboardMode, setDashboardMode] = useState<'book' | 'offer'>('book');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '', whatsapp_number: '' });
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceError, setServiceError] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const role = user?.user_metadata?.role || 'client';
  const userId = user?.id;

  useEffect(() => {
    if (role !== 'fundi' || !user) return;
    const fetchFundiStats = async () => {
      // Fetch booking stats
      const bookingResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/fundi/bookings-stats?fundi_id=${user.id}`);
      const bookingData = await bookingResponse.json();
      
      // Fetch lead stats
      const leadResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/fundi/leads-stats?fundi_id=${user.id}`);
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

  // Fetch fundi's services
  useEffect(() => {
    if (dashboardMode === 'offer' && userId) {
      supabase.from('services').select('*').eq('fundi_id', userId).then(({ data }) => {
        setServices(data || []);
      });
    }
  }, [dashboardMode, userId]);

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/fundi/subscribe`, {
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

  const handleServiceInput = (e) => {
    setServiceForm({ ...serviceForm, [e.target.name]: e.target.value });
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    setServiceLoading(true);
    setServiceError('');
    if (!serviceForm.name || !serviceForm.price || !serviceForm.whatsapp_number) {
      setServiceError('Name, price, and WhatsApp number are required.');
      setServiceLoading(false);
      return;
    }
    const { error } = await supabase.from('services').insert([
      {
        fundi_id: userId,
        name: serviceForm.name,
        description: serviceForm.description,
        price: parseFloat(serviceForm.price),
        whatsapp_number: serviceForm.whatsapp_number,
      },
    ]);
    if (error) {
      setServiceError(error.message);
    } else {
      setShowServiceForm(false);
      setServiceForm({ name: '', description: '', price: '', whatsapp_number: '' });
      // Refresh services
      const { data } = await supabase.from('services').select('*').eq('fundi_id', userId);
      setServices(data || []);
    }
    setServiceLoading(false);
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
        <div className="flex justify-center mb-8 gap-4">
          <button
            className={`px-4 py-2 rounded font-semibold ${dashboardMode === 'book' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setDashboardMode('book')}
          >
            Book a Service
          </button>
          <button
            className={`px-4 py-2 rounded font-semibold ${dashboardMode === 'offer' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setDashboardMode('offer')}
          >
            Offer a Service
          </button>
        </div>
        {dashboardMode === 'book' ? (
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
                <BookingForm />
              </CardContent>
            </Card>
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">📊</span>
                  </div>
                  Your Bookings
                </CardTitle>
                <p className="text-gray-600">Track your service requests and history</p>
              </CardHeader>
              <CardContent>
                <BookingsList role="client" />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">🛠️</span>
                  </div>
                  Offer a Service
                </CardTitle>
                <p className="text-gray-600">Manage your jobs and earnings as a provider</p>
              </CardHeader>
              <CardContent>
                <BookingsList role="fundi" />
              </CardContent>
            </Card>
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">💰</span>
                  </div>
                  Provider Stats
                </CardTitle>
                <p className="text-gray-600">Track your jobs and earnings</p>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        )}
        {dashboardMode === 'offer' && (
          <div className="mb-8">
            <button
              className="px-4 py-2 bg-primary text-white rounded font-semibold"
              onClick={() => setShowServiceForm((v) => !v)}
            >
              {showServiceForm ? 'Cancel' : 'Create New Service'}
            </button>
            {showServiceForm && (
              <form className="mt-4 space-y-4 bg-white p-4 rounded shadow" onSubmit={handleCreateService}>
                <div>
                  <label className="block font-semibold mb-1">Service Name</label>
                  <input
                    type="text"
                    name="name"
                    value={serviceForm.name}
                    onChange={handleServiceInput}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea
                    name="description"
                    value={serviceForm.description}
                    onChange={handleServiceInput}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Price (KES)</label>
                  <input
                    type="number"
                    name="price"
                    value={serviceForm.price}
                    onChange={handleServiceInput}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    name="whatsapp_number"
                    value={serviceForm.whatsapp_number}
                    onChange={handleServiceInput}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g. 254712345678"
                    required
                  />
                </div>
                {serviceError && <div className="text-red-500">{serviceError}</div>}
                <button
                  type="submit"
                  className="px-4 py-2 bg-secondary text-white rounded font-semibold"
                  disabled={serviceLoading}
                >
                  {serviceLoading ? 'Saving...' : 'Save Service'}
                </button>
              </form>
            )}
            <div className="mt-6">
              <h3 className="font-bold mb-2">Your Services</h3>
              {services.length === 0 ? (
                <div className="text-gray-500">No services created yet.</div>
              ) : (
                <ul className="space-y-2">
                  {services.map((svc) => (
                    <li key={svc.id} className="border rounded p-3 bg-white flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{svc.name}</div>
                        <div className="text-gray-600 text-sm">{svc.description}</div>
                      </div>
                      <div className="font-bold text-primary">KES {svc.price}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

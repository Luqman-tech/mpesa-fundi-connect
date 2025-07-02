import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Wrench } from 'lucide-react';

interface Booking {
  id: string;
  service: string;
  location: string;
  date: string;
  status: string;
  created_at: string;
  amount?: number;
  commission?: number;
}

interface BookingsListProps {
  role?: 'client' | 'fundi';
}

const BookingsList = ({ role = 'client' }: BookingsListProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        let query = supabase.from('bookings').select('*');
        if (role === 'fundi') {
          query = query.eq('fundi_id', user.id);
        } else {
          query = query.eq('client_id', user.id);
        }
        query = query.order('created_at', { ascending: false });
        const { data, error } = await query;
        if (error) throw error;
        setBookings(data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `${role === 'fundi' ? 'fundi_id' : 'client_id'}=eq.${user.id}`
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, role]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading bookings...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No bookings yet. Create your first service request!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{booking.service}</h3>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{booking.location}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(booking.date).toLocaleDateString()}</span>
              </div>
              {typeof booking.amount === 'number' && typeof booking.commission === 'number' && (
                <div className="pt-2">
                  <p>Total: <span className="font-semibold">KES {booking.amount.toLocaleString()}</span></p>
                  <p>Commission (10%): <span className="font-semibold text-red-600">KES {booking.commission.toLocaleString()}</span></p>
                  <p>Your Earnings: <span className="font-semibold text-green-600">KES {(booking.amount - booking.commission).toLocaleString()}</span></p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookingsList;

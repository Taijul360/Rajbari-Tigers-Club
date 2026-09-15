import { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api/client';
import { Trophy, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '../../components/Skeleton';
import localforage from 'localforage';

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localforage.getItem('cache_tournaments').then((cachedData: any) => {
      if (cachedData) {
        setTournaments(cachedData);
        setLoading(false);
      }
    });

    fetchApi('/public/tournaments')
      .then((res: any) => { 
        setTournaments(res); 
        setLoading(false);
        localforage.setItem('cache_tournaments', res);
      })
      .catch(() => {
        if (!tournaments.length) setLoading(false);
      });
  }, []);

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold font-bangla text-tiger-navy mb-8 border-b-4 border-tiger-orange inline-block pb-2">টুর্নামেন্টসমূহ</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm flex flex-col">
              <Skeleton className="h-40 w-full rounded-none" />
              <div className="p-5 flex-1 flex flex-col space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map(t => (
            <div key={t._id} className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="h-40 bg-tiger-navy/5 flex items-center justify-center border-b border-gray-100 relative">
                 <Trophy className="w-16 h-16 text-tiger-navy/20" />
                 <div className="absolute top-3 right-3 px-2 py-1 bg-white border border-gray-200 text-tiger-orange text-[10px] font-bold rounded uppercase tracking-wider">
                   {t.status === 'upcoming' ? 'আসন্ন' : t.status === 'ongoing' ? 'চলমান' : 'সম্পন্ন'}
                 </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold font-bangla text-tiger-navy mb-4 leading-tight">{t.title?.bn}</h3>
                
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2 font-bangla">
                   <Calendar className="w-4 h-4 text-tiger-royal" /> 
                   <span>{t.startDate ? format(new Date(t.startDate), 'dd MMM yyyy') : 'তারিখ নির্ধারিত নয়'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm font-bangla">
                   <MapPin className="w-4 h-4 text-tiger-royal" /> 
                   <span>{t.venue || 'স্থান নির্ধারিত নয়'}</span>
                </div>
              </div>
            </div>
          ))}
          {tournaments.length === 0 && <p className="text-gray-500 font-bangla py-8">কোন টুর্নামেন্ট পাওয়া যায়নি।</p>}
        </div>
      )}
    </div>
  );
}

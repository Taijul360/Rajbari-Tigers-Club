import { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api/client';
import { Droplet, MapPin, Phone } from 'lucide-react';
import { Skeleton } from '../../components/Skeleton';
import localforage from 'localforage';

export default function BloodDonorsPage() {
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localforage.getItem('cache_donors').then((cachedData: any) => {
      if (cachedData) {
        setDonors(cachedData);
        setLoading(false);
      }
    });

    fetchApi('/public/blood-donors')
      .then((res: any) => { 
        setDonors(res); 
        setLoading(false); 
        localforage.setItem('cache_donors', res);
      })
      .catch(() => {
        if (!donors.length) setLoading(false);
      });
  }, []);

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold font-bangla text-tiger-navy mb-2 border-b-4 border-tiger-orange inline-block pb-2">রক্তদাতা তালিকা</h1>
      <p className="text-gray-600 font-bangla mb-8 max-w-2xl">জরুরী প্রয়োজনে রক্তের জন্য নিচে উল্লেখিত রক্তদাতাদের সাথে যোগাযোগ করতে পারেন। শুধুমাত্র যারা বর্তমানে রক্ত দিতে প্রস্তুত তাদের তালিকা এখানে দেখানো হয়েছে।</p>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-md border border-gray-200 p-5 shadow-sm flex items-start gap-4">
              <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {donors.map(donor => (
            <div key={donor._id} className="bg-white rounded-md border border-gray-200 p-5 shadow-sm flex items-start gap-4 hover:border-red-200 transition-colors">
               <div className="w-12 h-12 bg-red-50 border border-red-100 text-red-600 rounded-full flex flex-col items-center justify-center flex-shrink-0">
                 <Droplet className="w-4 h-4 mb-0.5" />
                 <span className="font-bold text-sm font-archivo leading-none">{donor.bloodGroup}</span>
               </div>
               <div>
                 <h3 className="font-bold font-bangla text-lg text-tiger-navy">{donor.name}</h3>
                 <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-2 font-bangla">
                   <MapPin className="w-3.5 h-3.5 text-gray-400" /> {donor.area || 'রাজবাড়ি সদর'}
                 </div>
                 <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1.5 font-archivo">
                   <Phone className="w-3.5 h-3.5 text-gray-400" /> {donor.phone}
                 </div>
               </div>
            </div>
          ))}
          {donors.length === 0 && <p className="text-gray-500 font-bangla py-8 col-span-3">কোন রক্তদাতার তথ্য পাওয়া যায়নি।</p>}
        </div>
      )}
    </div>
  );
}

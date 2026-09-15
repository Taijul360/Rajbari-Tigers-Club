import { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api/client';
import { HeartHandshake, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '../../components/Skeleton';
import localforage from 'localforage';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localforage.getItem('cache_projects').then((cachedData: any) => {
      if (cachedData) {
        setProjects(cachedData);
        setLoading(false);
      }
    });

    fetchApi('/public/projects')
      .then((res: any) => { 
        setProjects(res); 
        setLoading(false);
        localforage.setItem('cache_projects', res);
      })
      .catch(() => {
        if (!projects.length) setLoading(false);
      });
  }, []);

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold font-bangla text-tiger-navy mb-8 border-b-4 border-tiger-orange inline-block pb-2">সামাজিক প্রকল্পসমূহ</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm flex flex-col md:flex-row">
              <Skeleton className="h-48 md:h-auto md:w-1/3 rounded-none" />
              <div className="p-5 flex-1 flex flex-col justify-center space-y-3">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(p => (
            <div key={p._id} className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm flex flex-col md:flex-row hover:shadow-md transition-shadow">
              <div className="h-48 md:h-auto md:w-1/3 bg-tiger-orange/10 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                 <HeartHandshake className="w-16 h-16 text-tiger-orange/50" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{p.category?.replace('_', ' ')}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {p.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-bangla text-tiger-navy mb-2">{p.title?.bn}</h3>
                
                <div className="mb-4 text-sm font-bangla text-gray-600 line-clamp-2">
                  {p.summary || p.title?.en}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 h-1.5 rounded-full mb-1">
                  <div className="bg-tiger-orange h-1.5 rounded-full" style={{ width: `${p.progressPercent || 0}%` }}></div>
                </div>
                <div className="text-right text-[10px] font-archivo text-gray-500 mb-4">{p.progressPercent || 0}% Complete</div>
                
                <div className="flex items-center gap-2 text-gray-600 text-xs font-bangla">
                   <MapPin className="w-3.5 h-3.5" /> 
                   <span>{p.location || 'রাজবাড়ি'}</span>
                   <span className="mx-2">•</span>
                   <span>{p.startDate ? format(new Date(p.startDate), 'MMM yyyy') : ''}</span>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="text-gray-500 font-bangla py-8">কোন প্রকল্প পাওয়া যায়নি।</p>}
        </div>
      )}
    </div>
  );
}

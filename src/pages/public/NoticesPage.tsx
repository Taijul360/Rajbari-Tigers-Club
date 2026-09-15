import { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api/client';
import { FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';
import localforage from 'localforage';
import { Skeleton } from '../../components/Skeleton';

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Load from cache first for fast offline-ready rendering
    localforage.getItem('cache_notices').then((cachedData: any) => {
      if (cachedData) {
        setNotices(cachedData);
        setLoading(false);
      }
    });

    // 2. Fetch fresh data in the background
    fetchApi('/public/notices')
      .then((res: any) => { 
        setNotices(res); 
        setLoading(false);
        localforage.setItem('cache_notices', res);
      })
      .catch(() => {
        if (!notices.length) setLoading(false);
      });
  }, []);

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-bangla text-tiger-navy mb-8 border-b-4 border-tiger-orange inline-block pb-2">নোটিশ বোর্ড</h1>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-md border border-gray-200 p-5 shadow-sm flex items-start gap-4">
              <Skeleton className="w-12 h-12 rounded-full hidden sm:block flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-full h-16" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map(notice => (
            <div key={notice._id} className="bg-white rounded-md border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex items-start gap-4">
                 <div className="hidden sm:flex w-12 h-12 bg-tiger-navy/5 rounded-full items-center justify-center text-tiger-navy flex-shrink-0">
                   <FileText className="w-5 h-5" />
                 </div>
                 <div className="flex-1">
                   <div className="flex flex-wrap items-center gap-2 mb-2">
                     {notice.priority === 'urgent' && (
                       <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">জরুরী</span>
                     )}
                     <span className="text-xs text-gray-500 font-archivo flex items-center gap-1">
                       <Clock className="w-3.5 h-3.5" /> 
                       {format(new Date(notice.createdAt), 'dd MMM yyyy')}
                     </span>
                   </div>
                   <h3 className="text-xl font-bold font-bangla text-tiger-navy mb-2">{notice.title?.bn}</h3>
                   <div className="text-gray-700 font-bangla text-sm leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: notice.body }} />
                 </div>
               </div>
            </div>
          ))}
          {notices.length === 0 && (
            <div className="text-center py-12 bg-white rounded-md border border-gray-200 border-dashed">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-bangla">বর্তমানে কোনো নতুন নোটিশ নেই।</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

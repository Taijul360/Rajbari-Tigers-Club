import { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api/client';

export default function CommitteePage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/public/committee')
      .then((res: any) => { setRoles(res); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold font-bangla text-tiger-navy mb-8 border-b-4 border-tiger-orange inline-block pb-2">কার্যনির্বাহী পরিষদ</h1>
      
      {loading ? (
        <div className="text-center font-bangla text-gray-500 py-10">লোড হচ্ছে...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.filter(r => r.key !== 'super_admin').map(role => (
            <div key={role._id} className="bg-white rounded-md border border-gray-200 p-6 shadow-sm">
               <h3 className="text-xl font-bold font-bangla text-tiger-navy mb-1">{role.label?.bn}</h3>
               <p className="text-xs text-tiger-orange font-english uppercase tracking-widest mb-4">{role.label?.en}</p>
               
               <div className="border-t border-gray-100 pt-4">
                 <h4 className="font-bold font-bangla text-gray-700 mb-3 text-sm flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-tiger-navy inline-block"></span>
                   দায়িত্বসমূহ:
                 </h4>
                 <ul className="space-y-2">
                   {role.responsibilities?.bn?.map((resp: string, idx: number) => (
                     <li key={idx} className="text-gray-600 font-bangla text-sm flex items-start gap-2">
                       <span className="text-tiger-orange mt-0.5">•</span>
                       <span className="leading-relaxed">{resp}</span>
                     </li>
                   ))}
                   {(!role.responsibilities?.bn || role.responsibilities.bn.length === 0) && (
                     <li className="text-gray-400 text-sm font-bangla italic">দায়িত্ব উল্লেখ করা নেই</li>
                   )}
                 </ul>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

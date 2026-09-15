import { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api/client';
import { Check, X, Clock, Droplet, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadApplications = () => {
    setLoading(true);
    fetchApi('/applications/pending')
      .then((res: any) => { setApplications(res); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (!confirm(`Are you sure you want to ${action} this application?`)) return;
    
    setProcessingId(id);
    try {
      await fetchApi(`/applications/${id}/${action}`, { method: 'POST' });
      loadApplications();
    } catch (error) {
      alert(`Failed to ${action} application`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold font-bangla text-tiger-navy mb-2 border-b-4 border-tiger-orange inline-block pb-2">নতুন সদস্যপদ আবেদন</h1>
      <p className="text-gray-500 font-bangla mb-8">যেসব ব্যবহারকারী সদস্য হওয়ার জন্য আবেদন করেছেন তাদের তালিকা এবং অনুমোদন।</p>

      {loading ? (
        <div className="text-center font-bangla text-gray-500 py-10">লোড হচ্ছে...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map(app => (
            <div key={app._id} className="bg-white rounded-md shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold font-bangla text-tiger-navy">{app.name?.bn}</h3>
                    <p className="text-sm text-gray-500 font-archivo">{app.name?.en}</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 uppercase tracking-wider">
                    <Clock className="w-3 h-3" /> Pending
                  </span>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-archivo">
                    <span className="font-bold text-gray-400 w-16">Phone:</span> {app.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-archivo">
                    <span className="font-bold text-gray-400 w-16">Blood:</span> 
                    <span className="text-red-600 font-bold flex items-center gap-1"><Droplet className="w-3 h-3"/>{app.bloodGroup || 'N/A'}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-700 font-bangla">
                    <span className="font-bold text-gray-400 font-archivo w-16">Address:</span> 
                    <span className="flex-1 flex items-start gap-1"><MapPin className="w-3 h-3 mt-1 text-gray-400"/> {app.address || 'N/A'}</span>
                  </div>
                  <div className="text-xs text-gray-400 font-archivo mt-4 pt-4 border-t border-gray-100">
                    Applied on: {format(new Date(app.createdAt), 'dd MMM yyyy, hh:mm a')}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  disabled={processingId === app._id}
                  onClick={() => handleAction(app._id, 'approve')}
                  className="flex-1 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 transition-colors py-2 rounded flex justify-center items-center gap-2 font-bangla font-bold disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> অনুমোদন করুন
                </button>
                <button 
                  disabled={processingId === app._id}
                  onClick={() => handleAction(app._id, 'reject')}
                  className="flex-1 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200 transition-colors py-2 rounded flex justify-center items-center gap-2 font-bangla font-bold disabled:opacity-50"
                >
                  <X className="w-4 h-4" /> বাতিল করুন
                </button>
              </div>
            </div>
          ))}
          {applications.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-md border border-gray-200 border-dashed">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-bangla">বর্তমানে কোনো নতুন আবেদন নেই।</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

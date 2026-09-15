import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { fetchApi } from '../../lib/api/client';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Skeleton } from '../../components/Skeleton';
import localforage from 'localforage';
import { useRenderLog } from '../../hooks/useRenderLog';

export default function HomePage() {
  useRenderLog('HomePage');
  const { t } = useTranslation();
  const { settings } = useSettingsStore();
  const [stats, setStats] = useState<{ members: number, tournaments: number, projects: number } | null>(null);

  useEffect(() => {
    localforage.getItem('cache_stats').then((cachedData: any) => {
      if (cachedData) setStats(cachedData);
    });

    fetchApi('/public/stats').then((res: any) => {
      setStats(res);
      localforage.setItem('cache_stats', res);
    }).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col w-full -mt-4">
      {/* Crest Hero */}
      <section className="bg-tiger-navy text-bone py-16 px-4 flex flex-col items-center text-center w-full shadow-inner">
        {settings?.logoUrl ? (
          <img src={settings.logoUrl} alt="Crest" className="w-40 h-40 mb-6 object-contain drop-shadow-xl" />
        ) : (
          <div className="w-32 h-32 bg-bone rounded-full flex items-center justify-center mb-6 shadow-lg">
             <span className="text-tiger-navy font-bold text-4xl">RTC</span>
          </div>
        )}
        <h1 className="font-bangla font-bold text-4xl md:text-5xl mb-3 text-bone">
          {settings?.siteName?.bn || 'রাজবাড়ি টাইগার্স ক্লাব'}
        </h1>
        <p className="font-english text-sm md:text-base text-tiger-gold uppercase tracking-widest mb-10">
          {settings?.tagline?.en || 'Sports & Social Development'}
        </p>
        
        {/* Live Counters */}
        <div className="grid grid-cols-3 gap-3 md:gap-8 w-full max-w-2xl">
          {stats ? (
            <>
              <StatCard value={stats.members.toString()} label={t('home.members_count')} />
              <StatCard value={stats.tournaments.toString()} label={t('home.tournaments_count')} />
              <StatCard value={stats.projects.toString()} label={t('home.projects_count')} />
            </>
          ) : (
            <>
              <div className="flex flex-col items-center p-4 bg-bone/10 backdrop-blur-sm border border-bone/20 rounded-md">
                <Skeleton className="w-16 h-10 mb-2 bg-bone/30" />
                <Skeleton className="w-20 h-4 bg-bone/30" />
              </div>
              <div className="flex flex-col items-center p-4 bg-bone/10 backdrop-blur-sm border border-bone/20 rounded-md">
                <Skeleton className="w-16 h-10 mb-2 bg-bone/30" />
                <Skeleton className="w-20 h-4 bg-bone/30" />
              </div>
              <div className="flex flex-col items-center p-4 bg-bone/10 backdrop-blur-sm border border-bone/20 rounded-md">
                <Skeleton className="w-16 h-10 mb-2 bg-bone/30" />
                <Skeleton className="w-20 h-4 bg-bone/30" />
              </div>
            </>
          )}
        </div>

        <div className="mt-12 flex gap-4">
          <Link to="/join" className="bg-tiger-orange hover:bg-tiger-orange/90 text-white font-bold py-3 px-8 rounded-sm transition-colors font-bangla text-lg shadow-md hover:shadow-lg">
            যোগদান করুন
          </Link>
        </div>
      </section>

      {/* Anti-Drug Pledge */}
      <section className="py-16 px-4 bg-white text-center border-b border-gray-100">
         <h2 className="font-bangla font-bold text-3xl text-tiger-navy mb-6">আমাদের অঙ্গীকার</h2>
         <p className="font-bangla text-xl leading-relaxed text-gray-700 max-w-3xl mx-auto border-l-4 border-tiger-orange pl-6 italic text-left">
           "খেলাধুলায় বাড়ে বল, মাদক ছেড়ে মাঠে চল।" রাজবাড়ি টাইগার্স ক্লাব যুবসমাজকে মাদকের ভয়াল থাবা থেকে দূরে রাখতে এবং সুস্থ সমাজ গঠনে সর্বদা প্রতিশ্রুতিবদ্ধ। আমরা বিশ্বাস করি একটি সুস্থ মন এবং শরীর একটি সুন্দর সমাজ গড়তে পারে।
         </p>
      </section>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center p-4 bg-bone/10 backdrop-blur-sm border border-bone/20 rounded-md">
      <span className="font-archivo font-bold text-3xl md:text-4xl text-tiger-orange tabular-nums drop-shadow-md">{value}</span>
      <span className="text-xs md:text-sm text-center text-bone/90 mt-2 font-bangla">{label}</span>
    </div>
  );
}

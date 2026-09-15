import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="hidden md:flex items-center gap-1 rounded-sm bg-tiger-orange/20 px-3 py-1.5 text-xs font-bold font-bangla text-tiger-gold hover:bg-tiger-orange/30 transition-colors ml-2"
      >
        <Download className="w-3 h-3" />
        অ্যাপ ইনস্টল
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="hidden md:flex items-center gap-1 rounded-sm border border-white/20 px-3 py-1.5 text-xs font-bold font-bangla text-white hover:bg-white/10 transition-colors ml-2"
        >
          <Download className="w-3 h-3" />
          অ্যাপ ইনস্টল
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-ink">
              <h3 className="text-lg font-bold font-bangla text-tiger-navy dark:text-bone">আইফোনে ইনস্টল করুন</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 font-bangla">
                ১. সাফারির নিচের মেনু থেকে <strong>Share</strong> আইকনে চাপ দিন।<br />
                ২. নিচের দিকে স্ক্রল করে <strong>Add to Home Screen</strong> এ চাপ দিন।
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded bg-gray-100 py-2 text-sm font-bold font-bangla text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

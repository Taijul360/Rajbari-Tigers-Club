import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  // @ts-ignore
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('React Component crashed', error, { componentStack: errorInfo.componentStack });
  }

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      // @ts-ignore
      if (this.props.fallback) {
        // @ts-ignore
        return this.props.fallback;
      }
      
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center bg-bone">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 font-bangla">দুঃখিত, একটি সমস্যা হয়েছে!</h2>
            <p className="text-gray-500 mb-6 font-bangla text-sm">
              আমাদের সিস্টেমে একটি অপ্রত্যাশিত ত্রুটি দেখা দিয়েছে। আমরা বিষয়টি নিয়ে কাজ করছি।
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-tiger-navy text-white px-4 py-2.5 rounded font-bold font-bangla hover:bg-tiger-navy/90 transition-colors"
            >
              পেজটি রিলোড করুন
            </button>
            
            {/* @ts-ignore */}
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="mt-6 p-4 bg-gray-50 text-left rounded overflow-x-auto">
                {/* @ts-ignore */}
                <p className="text-xs font-mono text-red-600 font-bold mb-1">{this.state.error.toString()}</p>
                <p className="text-[10px] font-mono text-gray-600 whitespace-pre-wrap">
                  {/* @ts-ignore */}
                  {this.state.error.stack}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}

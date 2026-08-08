import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AlgoPioneers Uncaught Error Boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#0e1628] border border-rose-500/30 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Application Refresh Required</h2>
              <p className="text-xs text-slate-400 mt-2">
                {this.state.error?.message || 'A temporary state glitch occurred. Click reload to restore your practice session.'}
              </p>
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 mx-auto shadow-lg shadow-indigo-950 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Platform</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

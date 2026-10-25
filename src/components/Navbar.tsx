import { Pill, ShieldCheck, User as UserIcon, LogOut, History } from 'lucide-react';
import { User } from '../types.ts';

interface NavbarProps {
  activeTab: 'search' | 'admin' | 'catalogue';
  setActiveTab: (tab: 'search' | 'admin' | 'catalogue') => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenDocs?: () => void;
  onOpenHistory?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onOpenHistory,
  onLogout
}) => {

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-2.5 text-left group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">MediFind</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Medicine Availability &amp; Proximity Finder
              </p>
            </div>
          </button>
        </div>

        {/* Center Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'search'
                ? 'bg-teal-50 text-teal-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Find Medicine
          </button>

          <button
            onClick={() => setActiveTab('catalogue')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'catalogue'
                ? 'bg-teal-50 text-teal-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Medicine Directory
          </button>

          <button
            onClick={() => {
              if (currentUser?.role === 'ADMIN') {
                setActiveTab('admin');
              } else {
                onOpenAuth();
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-700 hover:text-teal-800 hover:bg-slate-100'
            }`}
            title={currentUser?.role === 'ADMIN' ? 'Go to Admin Dashboard' : 'Sign in as Administrator'}
          >
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Admin Dashboard</span>
          </button>
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">

          {/* User Auth Info */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                onClick={onOpenHistory}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-colors"
                title="View search history"
              >
                <History className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">Search History</span>
              </button>

              <div className="text-right hidden lg:block">
                <div className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-teal-600">
                  {currentUser.role}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
            >
              <UserIcon className="w-4 h-4 text-slate-500" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

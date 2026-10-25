import React, { useEffect, useState } from 'react';
import { X, History, Search, Trash2, Clock, ArrowRight, User as UserIcon } from 'lucide-react';
import { User } from '../types.ts';
import { api } from '../services/api.ts';

interface UserHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSelectQuery: (query: string) => void;
}

export const UserHistoryModal: React.FC<UserHistoryModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectQuery
}) => {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const res = await api.getUserSearchHistory();
      setHistory(res.history || []);
    } catch {
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      loadHistory();
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleClear = async () => {
    try {
      await api.clearUserSearchHistory();
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear search history', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">User Dashboard &amp; Search History</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{currentUser.name}</span>
                <span>•</span>
                <span className="font-mono text-slate-500">{currentUser.email}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span>Recent medicine lookups ({history.length})</span>
            {history.length > 0 && (
              <button
                onClick={handleClear}
                className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-xs text-slate-400">Loading search logs...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <div className="font-bold text-slate-700 text-sm">No Search Records Yet</div>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Any medicine availability searches you perform while signed in will automatically be saved here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl border border-slate-200 hover:border-teal-300 bg-white hover:bg-teal-50/30 flex items-center justify-between transition-all group"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>{log.query}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {log.resultsCount} formulations found
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectQuery(log.query);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 group-hover:bg-teal-600 text-teal-700 group-hover:text-white font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Signed in as: <strong className="text-slate-700">{currentUser.role}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

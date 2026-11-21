import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, lead }) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !lead) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm(lead.id);
      onClose();
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900">Delete Lead</h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-2 leading-relaxed">
              Are you sure you want to permanently delete lead{' '}
              <strong className="text-slate-900 font-semibold">{lead.name}</strong>
              {lead.company ? ` from ${lead.company}` : ''}?
            </p>

            <p className="text-[11px] text-rose-500 bg-rose-50 p-2 rounded-lg border border-rose-100">
              Warning: This action cannot be undone. All contact history will be removed.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={deleting}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 rounded-lg shadow-sm shadow-rose-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete Lead</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import LeadsFilter from './components/LeadsFilter.jsx';
import LeadsTable from './components/LeadsTable.jsx';
import LeadModal from './components/LeadModal.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';
import Toast from './components/Toast.jsx';
import { leadsApi } from './services/api.js';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search by name & filter by status
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  // Modals state
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingLead, setDeletingLead] = useState(null);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch leads from API with search (name) and status filter
  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await leadsApi.getAll({
        search,
        status,
      });

      if (res.success) {
        setLeads(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
      setError(err.message || 'Unable to connect to the server.');
      showToast(err.message || 'Error fetching leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // Create or Update lead handler
  const handleSaveLead = async (formData, leadId) => {
    if (leadId) {
      await leadsApi.update(leadId, formData);
      showToast(`Lead "${formData.name}" updated successfully!`, 'success');
    } else {
      await leadsApi.create(formData);
      showToast(`Lead "${formData.name}" added successfully!`, 'success');
    }
    await loadLeads();
  };

  // Delete lead handler
  const handleDeleteConfirm = async (id) => {
    await leadsApi.delete(id);
    showToast('Lead deleted successfully', 'info');
    await loadLeads();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation Header with Title and Add Lead Button */}
      <Navbar
        onOpenAddModal={() => {
          setEditingLead(null);
          setLeadModalOpen(true);
        }}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error notification if server is unreachable */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-800 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadLeads}
              className="px-3 py-1 bg-white border border-rose-300 text-rose-700 rounded-md text-xs font-semibold hover:bg-rose-50 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Search by Name & Status Filter */}
        <LeadsFilter
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />

        {/* Leads Table */}
        <LeadsTable
          leads={leads}
          loading={loading}
          onEditLead={(lead) => {
            setEditingLead(lead);
            setLeadModalOpen(true);
          }}
          onDeleteLead={(lead) => {
            setDeletingLead(lead);
            setDeleteModalOpen(true);
          }}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            Lead Manager — Full Stack Screening Assignment for{' '}
            <span className="font-semibold text-slate-700">Meru Technosoft Pvt. Ltd.</span>
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>React + Vite</span>
            <span>•</span>
            <span>Node.js / Express</span>
            <span>•</span>
            <span>SQLite Database</span>
          </div>
        </div>
      </footer>

      {/* Add / Edit Lead Modal */}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => {
          setLeadModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        lead={editingLead}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingLead(null);
        }}
        onConfirm={handleDeleteConfirm}
        lead={deletingLead}
      />

      {/* Notification Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

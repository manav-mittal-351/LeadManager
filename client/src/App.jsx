import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import StatsCards from './components/StatsCards.jsx';
import LeadsFilter from './components/LeadsFilter.jsx';
import LeadsTable from './components/LeadsTable.jsx';
import LeadModal from './components/LeadModal.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import Toast from './components/Toast.jsx';
import { leadsApi } from './services/api.js';
import { useAuth } from './context/AuthContext.jsx';
import { RefreshCw, PlusCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const { user } = useAuth();

  // Data states
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, qualified: 0, lost: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Pagination states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [source, setSource] = useState('All');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Modal states
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingLead, setDeletingLead] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch statistics
  const loadStats = useCallback(async () => {
    try {
      const res = await leadsApi.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  // Fetch leads
  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await leadsApi.getAll({
        search: debouncedSearch,
        status,
        source,
        sortBy,
        sortOrder,
        page,
        limit,
      });

      if (res.success) {
        setLeads(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
      setError(err.message || 'Unable to retrieve leads from the server.');
      showToast(err.message || 'Error fetching leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, source, sortBy, sortOrder, page, limit]);

  // Load leads and stats whenever query filters change or user auth changes
  useEffect(() => {
    loadLeads();
    loadStats();
  }, [loadLeads, loadStats, user]);

  // Sort handler
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setPage(1);
  };

  // Status selection handler (e.g. from Dashboard Cards or Filter)
  const handleStatusSelect = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearch('');
    setStatus('All');
    setSource('All');
    setSortBy('created_at');
    setSortOrder('desc');
    setPage(1);
  };

  // Create or Update Lead
  const handleSaveLead = async (formData, leadId) => {
    if (leadId) {
      await leadsApi.update(leadId, formData);
      showToast(`Lead "${formData.name}" updated successfully!`, 'success');
    } else {
      await leadsApi.create(formData);
      showToast(`Lead "${formData.name}" added to pipeline!`, 'success');
    }
    await loadLeads();
    await loadStats();
  };

  // Delete Lead
  const handleDeleteConfirm = async (id) => {
    await leadsApi.delete(id);
    showToast('Lead deleted successfully', 'info');
    await loadLeads();
    await loadStats();
  };

  // Quick Status Change directly from table row
  const handleQuickStatusChange = async (lead, newStatus) => {
    if (lead.status === newStatus) return;

    try {
      await leadsApi.update(lead.id, {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        source: lead.source,
        status: newStatus,
        notes: lead.notes,
      });
      showToast(`Status for "${lead.name}" changed to ${newStatus}`, 'success');
      await loadLeads();
      await loadStats();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        onOpenAuthModal={(tab) => {
          setAuthModalTab(tab);
          setAuthModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Lead Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Capture, qualify, and track prospective sales leads across your pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                loadLeads();
                loadStats();
                showToast('Refreshed leads data', 'info');
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Refresh leads and stats"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={() => {
                setEditingLead(null);
                setLeadModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm shadow-indigo-200 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Capture Lead</span>
            </button>
          </div>
        </div>

        {/* Server Connection Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Connection Problem</span>
              <span className="text-xs">{error}</span>
            </div>
            <button
              onClick={() => {
                loadLeads();
                loadStats();
              }}
              className="px-3 py-1 bg-white border border-rose-300 text-rose-700 rounded-md text-xs font-semibold hover:bg-rose-50 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Dashboard Status Counter Cards (Bonus Feature) */}
        <StatsCards
          stats={stats}
          activeStatus={status}
          onSelectStatus={handleStatusSelect}
        />

        {/* Filters & Actions Bar */}
        <LeadsFilter
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={handleStatusSelect}
          source={source}
          onSourceChange={(src) => {
            setSource(src);
            setPage(1);
          }}
          onOpenAddModal={() => {
            setEditingLead(null);
            setLeadModalOpen(true);
          }}
        />

        {/* Leads Table with Sorting and Pagination */}
        <LeadsTable
          leads={leads}
          loading={loading}
          pagination={pagination}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          onEditLead={(lead) => {
            setEditingLead(lead);
            setLeadModalOpen(true);
          }}
          onDeleteLead={(lead) => {
            setDeletingLead(lead);
            setDeleteModalOpen(true);
          }}
          onQuickStatusChange={handleQuickStatusChange}
          onResetFilters={handleResetFilters}
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

      {/* Modals */}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => {
          setLeadModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        lead={editingLead}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingLead(null);
        }}
        onConfirm={handleDeleteConfirm}
        lead={deletingLead}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

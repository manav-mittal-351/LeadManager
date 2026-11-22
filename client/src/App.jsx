import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import AuthView from './components/AuthView.jsx';
import DashboardCounts from './components/DashboardCounts.jsx';
import LeadsFilter from './components/LeadsFilter.jsx';
import LeadsTable from './components/LeadsTable.jsx';
import LeadModal from './components/LeadModal.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';
import Toast from './components/Toast.jsx';
import { authApi, leadsApi } from './services/api.js';
import { AlertCircle } from 'lucide-react';

export default function App() {
  // Authentication state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Leads & Dashboard state
  const [leads, setLeads] = useState([]);
  const [counts, setCounts] = useState({ total: 0, new: 0, contacted: 0, qualified: 0, lost: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Pagination state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalLeads: 0,
    totalPages: 1,
  });

  // Modal state
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingLead, setDeletingLead] = useState(null);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Check auth session on startup
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('lead_manager_token');
      if (token) {
        try {
          const res = await authApi.getMe();
          setUser(res.user);
        } catch {
          localStorage.removeItem('lead_manager_token');
          setUser(null);
        }
      }
      setAuthLoading(false);
    }
    checkAuth();
  }, []);

  // Debounce search by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch status counts for the small dashboard
  const loadDashboardCounts = useCallback(async () => {
    if (!user) return;
    try {
      const res = await leadsApi.getDashboardCounts();
      if (res.success && res.data) {
        setCounts(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard counts:', err);
    }
  }, [user]);

  // Fetch paginated leads
  const loadLeads = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await leadsApi.getAll({
        page,
        limit: 10,
        search: debouncedSearch,
        status,
      });

      if (res.success) {
        setLeads(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
      if (err.status === 401) {
        handleLogout();
        showToast('Session expired. Please log in again.', 'error');
      } else {
        setError(err.message || 'Unable to connect to the server.');
        showToast(err.message || 'Error fetching leads', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [user, page, debouncedSearch, status]);

  // Reload data when filters, pagination, or user changes
  useEffect(() => {
    if (user) {
      loadLeads();
      loadDashboardCounts();
    }
  }, [user, loadLeads, loadDashboardCounts]);

  // Save Lead (Add or Edit)
  const handleSaveLead = async (formData, leadId) => {
    if (leadId) {
      await leadsApi.update(leadId, formData);
      showToast(`Lead "${formData.name}" updated successfully!`, 'success');
    } else {
      await leadsApi.create(formData);
      showToast(`Lead "${formData.name}" added successfully!`, 'success');
    }
    await loadLeads();
    await loadDashboardCounts();
  };

  // Delete Lead
  const handleDeleteConfirm = async (id) => {
    await leadsApi.delete(id);
    showToast('Lead deleted successfully', 'info');
    await loadLeads();
    await loadDashboardCounts();
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('lead_manager_token');
    setUser(null);
    setLeads([]);
    setCounts({ total: 0, new: 0, contacted: 0, qualified: 0, lost: 0 });
    showToast('Logged out successfully', 'info');
  };

  // Status Filter click (from Dashboard or Toolbar)
  const handleStatusSelect = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  // Loading initial auth session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xs font-medium text-slate-400">Loading...</div>
      </div>
    );
  }

  // Not logged in: Show minimalist Login / Signup
  if (!user) {
    return (
      <>
        <AuthView onAuthSuccess={(newUser) => setUser(newUser)} />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // Logged in: Main Leads Application
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Minimal Top Header */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Error notification if server is unreachable */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-800 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => {
                loadLeads();
                loadDashboardCounts();
              }}
              className="px-2.5 py-0.5 bg-white border border-rose-300 text-rose-700 rounded text-xs font-medium hover:bg-rose-50 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Minimal Dashboard Counters */}
        <DashboardCounts
          counts={counts}
          activeStatus={status}
          onSelectStatus={handleStatusSelect}
        />

        {/* Toolbar: Search by Name, Status Filter Pills & Add Lead Button */}
        <LeadsFilter
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={handleStatusSelect}
          onOpenAddModal={() => {
            setEditingLead(null);
            setLeadModalOpen(true);
          }}
        />

        {/* Leads Table with Pagination */}
        <LeadsTable
          leads={leads}
          loading={loading}
          pagination={pagination}
          onPageChange={setPage}
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

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-slate-400">
          <p>Lead Manager — Screening Assignment for Meru Technosoft</p>
          <p>React • Node.js / Express • MongoDB Atlas</p>
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

      {/* Feedback Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

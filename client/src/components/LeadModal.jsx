import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building2, Tag, CheckCircle, FileText } from 'lucide-react';

const SOURCES = ['Website', 'Referral', 'Cold Outreach', 'Social Media', 'Event', 'Other'];
const STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]{6,15}$/;

export default function LeadModal({ isOpen, onClose, onSave, lead }) {
  const isEditing = Boolean(lead);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'Website',
    status: 'New',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        source: lead.source || 'Website',
        status: lead.status || 'New',
        notes: lead.notes || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: 'Website',
        status: 'New',
        notes: '',
      });
    }
    setErrors({});
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone.trim()) {
      if (!PHONE_REGEX.test(formData.phone.trim())) {
        newErrors.phone = 'Please enter a valid phone number (e.g. +91 98765 43210)';
      }
    }

    if (formData.company.trim().length > 100) {
      newErrors.company = 'Company name cannot exceed 100 characters';
    }

    if (!formData.source) {
      newErrors.source = 'Lead source is required';
    }

    if (!formData.status) {
      newErrors.status = 'Lead status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSave(formData, lead?.id);
      onClose();
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: err.message || 'Failed to save lead' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Lead' : 'Add New Lead'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEditing ? 'Update lead information and pipeline status' : 'Capture a new sales prospect into the pipeline'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. John Doe"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-hidden transition-all ${
                  errors.name
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 bg-rose-50/30'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white'
                }`}
              />
            </div>
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="john@example.com"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-hidden transition-all ${
                    errors.email
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 bg-rose-50/30'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 555 123 4567"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-hidden transition-all ${
                    errors.phone
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 bg-rose-50/30'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Company Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Acme Corp"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white outline-hidden transition-all"
              />
            </div>
            {errors.company && <p className="text-xs text-rose-500 mt-1">{errors.company}</p>}
          </div>

          {/* Source & Status Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lead Source <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.source}
                  onChange={(e) => handleChange('source', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white outline-hidden transition-all cursor-pointer"
                >
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {errors.source && <p className="text-xs text-rose-500 mt-1">{errors.source}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <CheckCircle className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white outline-hidden transition-all cursor-pointer"
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
              {errors.status && <p className="text-xs text-rose-500 mt-1">{errors.status}</p>}
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes (Optional)</label>
            <div className="relative">
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any special remarks or follow-up details..."
                className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white outline-hidden transition-all resize-none"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 rounded-lg shadow-sm shadow-indigo-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Update Lead' : 'Create Lead'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

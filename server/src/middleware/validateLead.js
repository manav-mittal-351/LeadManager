const VALID_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'];
const VALID_SOURCES = ['Website', 'Referral', 'Cold Outreach', 'Social Media', 'Event', 'Other'];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]{6,15}$/;

export function validateLead(req, res, next) {
  const { name, email, phone, company, source, status } = req.body;
  const errors = {};

  // Validate Name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.name = 'Name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  } else if (name.trim().length > 100) {
    errors.name = 'Name cannot exceed 100 characters';
  }

  // Validate Email
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please provide a valid email address';
  } else if (email.trim().length > 120) {
    errors.email = 'Email cannot exceed 120 characters';
  }

  // Validate Phone (optional, but validated if present)
  if (phone !== undefined && phone !== null && phone.trim() !== '') {
    if (typeof phone !== 'string' || !PHONE_REGEX.test(phone.trim())) {
      errors.phone = 'Please provide a valid phone number format (e.g. +1 555 123 4567)';
    } else if (phone.trim().length > 25) {
      errors.phone = 'Phone number cannot exceed 25 characters';
    }
  }

  // Validate Company (optional)
  if (company !== undefined && company !== null && typeof company === 'string' && company.trim().length > 100) {
    errors.company = 'Company name cannot exceed 100 characters';
  }

  // Validate Source
  if (!source || typeof source !== 'string' || source.trim().length === 0) {
    errors.source = 'Source is required';
  } else if (!VALID_SOURCES.includes(source.trim())) {
    errors.source = `Source must be one of: ${VALID_SOURCES.join(', ')}`;
  }

  // Validate Status
  if (!status || typeof status !== 'string' || status.trim().length === 0) {
    errors.status = 'Status is required';
  } else if (!VALID_STATUSES.includes(status.trim())) {
    errors.status = `Status must be one of: ${VALID_STATUSES.join(', ')}`;
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the highlighted errors.',
      errors,
    });
  }

  // Sanitize trimmed fields
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.phone = phone ? phone.trim() : '';
  req.body.company = company ? company.trim() : '';
  req.body.source = source.trim();
  req.body.status = status.trim();

  next();
}

export { VALID_STATUSES, VALID_SOURCES };

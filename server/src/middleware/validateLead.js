const VALID_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'];
const VALID_SOURCES = ['Website', 'Referral', 'Cold Outreach', 'Social Media', 'Event', 'Other'];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLead(req, res, next) {
  const { name, email, phone, company, source, status } = req.body;
  const errors = {};

  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.name = 'Name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Email validation
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please provide a valid email address';
  }

  // Source validation
  if (!source || !VALID_SOURCES.includes(source.trim())) {
    errors.source = `Source must be one of: ${VALID_SOURCES.join(', ')}`;
  }

  // Status validation
  if (!status || !VALID_STATUSES.includes(status.trim())) {
    errors.status = `Status must be one of: ${VALID_STATUSES.join(', ')}`;
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Sanitize cleaned values
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.phone = phone ? phone.trim() : '';
  req.body.company = company ? company.trim() : '';
  req.body.source = source.trim();
  req.body.status = status.trim();

  next();
}

export { VALID_STATUSES, VALID_SOURCES };

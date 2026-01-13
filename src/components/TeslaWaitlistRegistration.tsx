/**
 * Tesla Seed Reentry Waitlist Registration
 * 
 * Captures user information and authorization for early access
 * to HHF-AI MRI seed archival and reentry services
 * 
 * @module TeslaWaitlistRegistration
 * @license CC BY-NC-SA 4.0
 */

import React, { useState, FormEvent } from 'react';
import './TeslaWaitlistRegistration.css';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface RegistrationData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  location: string;
  
  // Medical Information
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'prefer_not_to_say';
  medicalConditions: string;
  mriCompatible: 'yes' | 'no' | 'unknown';
  
  // Service Preferences
  interestedServices: string[];
  devicePreference: string[];
  theaterRole: string;
  budgetRange: string;
  
  // Authorization
  privacyPolicy: boolean;
  termsOfService: boolean;
  marketingOptIn: boolean;
  researchParticipation: boolean;
  
  // Waitlist Tier
  tier: 'beta' | 'early_access' | 'general';
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const TeslaWaitlistRegistration: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    location: '',
    healthStatus: 'good',
    medicalConditions: '',
    mriCompatible: 'unknown',
    interestedServices: [],
    devicePreference: [],
    theaterRole: 'aware_inner',
    budgetRange: '',
    privacyPolicy: false,
    termsOfService: false,
    marketingOptIn: false,
    researchParticipation: false,
    tier: 'general'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationData, string>>>({});

  // ============================================================================
  // FORM VALIDATION
  // ============================================================================

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof RegistrationData, string>> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
    }

    if (currentStep === 3) {
      if (formData.interestedServices.length === 0) {
        newErrors.interestedServices = 'Select at least one service';
      }
      if (!formData.budgetRange) {
        newErrors.budgetRange = 'Please select a budget range';
      }
    }

    if (currentStep === 4) {
      if (!formData.privacyPolicy) {
        newErrors.privacyPolicy = 'You must accept the Privacy Policy';
      }
      if (!formData.termsOfService) {
        newErrors.termsOfService = 'You must accept the Terms of Service';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================================
  // FORM HANDLERS
  // ============================================================================

  const handleChange = (field: keyof RegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCheckboxArray = (field: 'interestedServices' | 'devicePreference', value: string) => {
    setFormData(prev => {
      const current = prev[field] as string[];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;

    // Simulate API submission
    console.log('Submitting registration:', formData);
    
    // Generate registration number
    const regNumber = `TSR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setRegistrationNumber(regNumber);
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitted(true);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderProgressBar = () => (
    <div className="progress-bar-container">
      <div className="progress-steps">
        {[1, 2, 3, 4, 5].map(s => (
          <div 
            key={s} 
            className={`progress-step ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}
          >
            <div className="step-circle">{s}</div>
            <div className="step-label">
              {s === 1 && 'Personal'}
              {s === 2 && 'Medical'}
              {s === 3 && 'Preferences'}
              {s === 4 && 'Authorization'}
              {s === 5 && 'Tier'}
            </div>
          </div>
        ))}
      </div>
      <div className="progress-line">
        <div className="progress-fill" style={{ width: `${((step - 1) / 4) * 100}%` }} />
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="form-step">
      <h2>Personal Information</h2>
      <p className="step-description">Tell us about yourself to get started</p>

      <div className="form-group">
        <label>Full Name *</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="John Doe"
          className={errors.fullName ? 'error' : ''}
        />
        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
      </div>

      <div className="form-group">
        <label>Email Address *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john.doe@example.com"
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>Phone Number *</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
          className={errors.phone ? 'error' : ''}
        />
        {errors.phone && <span className="error-message">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label>Date of Birth *</label>
        <input
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          className={errors.dateOfBirth ? 'error' : ''}
        />
        {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
      </div>

      <div className="form-group">
        <label>Location (City, State/Country) *</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="San Francisco, CA"
          className={errors.location ? 'error' : ''}
        />
        {errors.location && <span className="error-message">{errors.location}</span>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <h2>Medical Information</h2>
      <p className="step-description">Help us ensure your safety and compatibility</p>

      <div className="form-group">
        <label>General Health Status</label>
        <select
          value={formData.healthStatus}
          onChange={(e) => handleChange('healthStatus', e.target.value)}
        >
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>

      <div className="form-group">
        <label>Medical Conditions (Optional)</label>
        <textarea
          value={formData.medicalConditions}
          onChange={(e) => handleChange('medicalConditions', e.target.value)}
          placeholder="List any relevant medical conditions, medications, or concerns..."
          rows={4}
        />
        <span className="hint">This helps us provide better service and safety recommendations</span>
      </div>

      <div className="form-group">
        <label>MRI Compatibility</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="mriCompatible"
              value="yes"
              checked={formData.mriCompatible === 'yes'}
              onChange={(e) => handleChange('mriCompatible', e.target.value)}
            />
            <span>Yes - I have no metal implants, pacemakers, or contraindications</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="mriCompatible"
              value="no"
              checked={formData.mriCompatible === 'no'}
              onChange={(e) => handleChange('mriCompatible', e.target.value)}
            />
            <span>No - I have metal implants or other contraindications</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="mriCompatible"
              value="unknown"
              checked={formData.mriCompatible === 'unknown'}
              onChange={(e) => handleChange('mriCompatible', e.target.value)}
            />
            <span>Unknown - I'm not sure</span>
          </label>
        </div>
        <span className="hint">Don't worry - smartphone and USB_RF options don't require MRI</span>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-step">
      <h2>Service Preferences</h2>
      <p className="step-description">What are you most interested in?</p>

      <div className="form-group">
        <label>Interested Services (Select all that apply) *</label>
        <div className="checkbox-group">
          {[
            { value: 'archival_human', label: '🧠 Human Consciousness Archival ($2,500)' },
            { value: 'archival_pet', label: '🐕 Pet Companion Archival ($500)' },
            { value: 'cloud_reentry', label: '☁️ Cloud Reentry / Retroactive Genesis ($50,000)' },
            { value: 'biogenesis', label: '🧬 Biological Reentry / Biogenesis ($500,000)' },
            { value: 'subscription', label: '📅 Subscription Plans ($49-999/month)' }
          ].map(service => (
            <label key={service.value} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.interestedServices.includes(service.value)}
                onChange={() => handleCheckboxArray('interestedServices', service.value)}
              />
              <span>{service.label}</span>
            </label>
          ))}
        </div>
        {errors.interestedServices && <span className="error-message">{errors.interestedServices}</span>}
      </div>

      <div className="form-group">
        <label>Device Preference (Select all that apply)</label>
        <div className="checkbox-group">
          {[
            { value: 'mri', label: '🏥 MRI (Clinical Grade - Highest Fidelity)' },
            { value: 'smartphone', label: '📱 Smartphone (Consumer - Most Accessible)' },
            { value: 'usb_rf', label: '🔌 USB_RF (Prosumer - Home-Based)' }
          ].map(device => (
            <label key={device.value} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.devicePreference.includes(device.value)}
                onChange={() => handleCheckboxArray('devicePreference', device.value)}
              />
              <span>{device.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Preferred Theater Role</label>
        <select
          value={formData.theaterRole}
          onChange={(e) => handleChange('theaterRole', e.target.value)}
        >
          <option value="aware_inner">🎭 Aware Inner - Full conscious participation</option>
          <option value="aware_outer">🎭 Aware Outer - Meta-cognitive observer</option>
          <option value="unaware_inner">🎭 Unaware Inner - Immersed participant</option>
          <option value="unaware_outer">🎭 Unaware Outer - External witness</option>
        </select>
        <span className="hint">Don't worry, you can change this later</span>
      </div>

      <div className="form-group">
        <label>Budget Range *</label>
        <select
          value={formData.budgetRange}
          onChange={(e) => handleChange('budgetRange', e.target.value)}
          className={errors.budgetRange ? 'error' : ''}
        >
          <option value="">Select a range...</option>
          <option value="0-1k">$0 - $1,000</option>
          <option value="1k-10k">$1,000 - $10,000</option>
          <option value="10k-50k">$10,000 - $50,000</option>
          <option value="50k-250k">$50,000 - $250,000</option>
          <option value="250k+">$250,000+</option>
        </select>
        {errors.budgetRange && <span className="error-message">{errors.budgetRange}</span>}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="form-step">
      <h2>Authorization & Consent</h2>
      <p className="step-description">Please review and accept our policies</p>

      <div className="form-group">
        <label className="checkbox-label large">
          <input
            type="checkbox"
            checked={formData.privacyPolicy}
            onChange={(e) => handleChange('privacyPolicy', e.target.checked)}
          />
          <span>
            I have read and accept the <a href="#" target="_blank">Privacy Policy</a> *
          </span>
        </label>
        {errors.privacyPolicy && <span className="error-message">{errors.privacyPolicy}</span>}
        <div className="policy-summary">
          <strong>Summary:</strong> Your data is encrypted, blockchain-secured, and you maintain full ownership. 
          We collect only necessary information for service delivery and never sell your data.
        </div>
      </div>

      <div className="form-group">
        <label className="checkbox-label large">
          <input
            type="checkbox"
            checked={formData.termsOfService}
            onChange={(e) => handleChange('termsOfService', e.target.checked)}
          />
          <span>
            I have read and accept the <a href="#" target="_blank">Terms of Service</a> *
          </span>
        </label>
        {errors.termsOfService && <span className="error-message">{errors.termsOfService}</span>}
        <div className="policy-summary">
          <strong>Summary:</strong> You're joining a waitlist with no obligation. Services are subject to availability, 
          medical clearance, and regulatory approval. Pricing subject to change (early registrants locked in).
        </div>
      </div>

      <div className="form-group">
        <label className="checkbox-label large">
          <input
            type="checkbox"
            checked={formData.marketingOptIn}
            onChange={(e) => handleChange('marketingOptIn', e.target.checked)}
          />
          <span>
            Yes, I'd like to receive updates about Syntheverse HHF-AI MRI, new features, and special offers
          </span>
        </label>
        <span className="hint">You can unsubscribe anytime</span>
      </div>

      <div className="form-group">
        <label className="checkbox-label large">
          <input
            type="checkbox"
            checked={formData.researchParticipation}
            onChange={(e) => handleChange('researchParticipation', e.target.checked)}
          />
          <span>
            I'm interested in participating in clinical trials and research studies
          </span>
        </label>
        <span className="hint">
          Research participants may receive FREE or discounted services. Completely optional.
        </span>
      </div>

      <div className="info-box">
        <strong>🔐 Your Privacy Matters</strong>
        <p>
          All data is HIPAA compliant, encrypted end-to-end, and stored on secure blockchain infrastructure. 
          You maintain full control and can request deletion at any time (except blockchain-archived seeds, 
          which are immutable by design).
        </p>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="form-step">
      <h2>Choose Your Waitlist Tier</h2>
      <p className="step-description">Select your level of commitment</p>

      <div className="tier-cards">
        <div 
          className={`tier-card ${formData.tier === 'general' ? 'selected' : ''}`}
          onClick={() => handleChange('tier', 'general')}
        >
          <div className="tier-badge">General</div>
          <div className="tier-price">FREE</div>
          <h3>General Waitlist</h3>
          <ul className="tier-features">
            <li>✅ Launch notification (Q3 2026)</li>
            <li>✅ Standard pricing</li>
            <li>✅ No commitment required</li>
            <li>✅ Open to all</li>
          </ul>
          <button className={`tier-button ${formData.tier === 'general' ? 'selected' : ''}`}>
            {formData.tier === 'general' ? '✓ Selected' : 'Select'}
          </button>
        </div>

        <div 
          className={`tier-card ${formData.tier === 'early_access' ? 'selected' : ''}`}
          onClick={() => handleChange('tier', 'early_access')}
        >
          <div className="tier-badge popular">Early Access</div>
          <div className="tier-price">FREE</div>
          <h3>Early Access</h3>
          <ul className="tier-features">
            <li>✅ Priority scheduling</li>
            <li>✅ 25% discount on all services</li>
            <li>✅ First 1,000 people</li>
            <li>✅ Beta feature access</li>
            <li>✅ Exclusive updates</li>
          </ul>
          <button className={`tier-button ${formData.tier === 'early_access' ? 'selected' : ''}`}>
            {formData.tier === 'early_access' ? '✓ Selected' : 'Select'}
          </button>
        </div>

        <div 
          className={`tier-card ${formData.tier === 'beta' ? 'selected' : ''}`}
          onClick={() => handleChange('tier', 'beta')}
        >
          <div className="tier-badge premium">Beta Applicant</div>
          <div className="tier-price">$100</div>
          <div className="tier-subtitle">(Fully refundable & credited)</div>
          <h3>Beta Program</h3>
          <ul className="tier-features">
            <li>✅ First access (Q2 2026)</li>
            <li>✅ 50% discount on all services</li>
            <li>✅ Lifetime FREE subscription</li>
            <li>✅ Founder status NFT</li>
            <li>✅ Advisory board input</li>
            <li>✅ Phase II trial guarantee</li>
            <li>⚠️ Limited to 100 participants</li>
            <li>⚠️ Interview required</li>
          </ul>
          <button className={`tier-button ${formData.tier === 'beta' ? 'selected' : ''}`}>
            {formData.tier === 'beta' ? '✓ Selected' : 'Apply'}
          </button>
        </div>
      </div>

      <div className="info-box">
        <strong>💡 Not sure which tier to choose?</strong>
        <p>
          Start with <strong>General Waitlist</strong> (FREE) and upgrade anytime. 
          Early Access fills up fast (first 1,000), and Beta is highly competitive (only 100 spots).
        </p>
      </div>
    </div>
  );

  const renderSuccessScreen = () => (
    <div className="success-screen">
      <div className="success-icon">✨</div>
      <h1>Welcome to the Future!</h1>
      <p className="success-message">
        You're now on the Tesla Seed Reentry waitlist
      </p>

      <div className="registration-details">
        <h3>Your Registration</h3>
        <div className="detail-row">
          <span className="label">Registration Number:</span>
          <span className="value code">{registrationNumber}</span>
        </div>
        <div className="detail-row">
          <span className="label">Name:</span>
          <span className="value">{formData.fullName}</span>
        </div>
        <div className="detail-row">
          <span className="label">Email:</span>
          <span className="value">{formData.email}</span>
        </div>
        <div className="detail-row">
          <span className="label">Tier:</span>
          <span className="value tier-badge-small">{formData.tier.replace('_', ' ').toUpperCase()}</span>
        </div>
        <div className="detail-row">
          <span className="label">Expected Access:</span>
          <span className="value">
            {formData.tier === 'beta' ? 'Q2 2026 (pending interview)' : 
             formData.tier === 'early_access' ? 'Q3 2026' : 
             'Q3 2026+'}
          </span>
        </div>
      </div>

      <div className="next-steps">
        <h3>What Happens Next?</h3>
        <ol>
          <li>
            <strong>Confirmation Email:</strong> Check your inbox for detailed information 
            and your unique registration link
          </li>
          <li>
            <strong>Updates:</strong> We'll keep you informed on development progress, 
            beta program announcements, and launch dates
          </li>
          {formData.tier === 'beta' && (
            <li>
              <strong>Interview:</strong> Our team will reach out within 7 days to schedule 
              your beta program interview
            </li>
          )}
          <li>
            <strong>Early Access:</strong> When your tier opens, you'll receive priority 
            scheduling and discount codes
          </li>
        </ol>
      </div>

      {formData.tier === 'beta' && (
        <div className="payment-info">
          <h3>💳 Beta Application Fee: $100</h3>
          <p>
            A confirmation email with payment instructions has been sent. 
            Fee is fully refundable and credited to your first service.
          </p>
          <button className="btn-primary">Complete Payment</button>
        </div>
      )}

      <div className="social-share">
        <h3>Spread the Word</h3>
        <p>Help us build the future of consciousness</p>
        <div className="share-buttons">
          <button className="share-btn twitter">Share on Twitter</button>
          <button className="share-btn facebook">Share on Facebook</button>
          <button className="share-btn linkedin">Share on LinkedIn</button>
        </div>
      </div>

      <div className="cta-buttons">
        <button className="btn-secondary" onClick={() => window.location.href = '/'}>
          Return to Homepage
        </button>
        <button className="btn-primary" onClick={() => window.location.href = '/dashboard'}>
          View Your Dashboard
        </button>
      </div>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  if (submitted) {
    return (
      <div className="waitlist-registration">
        {renderSuccessScreen()}
      </div>
    );
  }

  return (
    <div className="waitlist-registration">
      <div className="registration-header">
        <h1>⚡ Join the Tesla Seed Reentry Waitlist</h1>
        <p className="subtitle">
          Be among the first to experience blockchain-verified consciousness archival 
          and immersive awareness reentry
        </p>
        <div className="status-badge">COMING SOON • Q2 2026</div>
      </div>

      {renderProgressBar()}

      <form onSubmit={handleSubmit} className="registration-form">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}

        <div className="form-navigation">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="btn-secondary">
              ← Previous
            </button>
          )}
          {step < 5 && (
            <button type="button" onClick={nextStep} className="btn-primary">
              Next →
            </button>
          )}
          {step === 5 && (
            <button type="submit" className="btn-primary large">
              🚀 Join Waitlist
            </button>
          )}
        </div>
      </form>

      <div className="registration-footer">
        <p>
          Questions? Contact us at <a href="mailto:info@fractiai.com">info@fractiai.com</a>
        </p>
        <p className="fine-print">
          By registering, you agree to receive communications about Syntheverse HHF-AI MRI. 
          No purchase necessary. Registration does not guarantee service availability.
        </p>
      </div>
    </div>
  );
};

export default TeslaWaitlistRegistration;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PricingPage.css';

const PLANS = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    desc: 'Try HuliMagic risk-free',
    badge: null,
    features: [
      '3 videos/month',
      'Auto captions (watermark)',
      '720p export',
      '5 caption styles',
      'B-roll search',
      '1 language',
      'Community support'
    ],
    cta: 'Get Started Free',
    ctaLink: '/editor',
    highlight: false
  },
  {
    name: 'Starter',
    price: { monthly: 9, yearly: 7 },
    desc: 'For solo creators',
    badge: 'Most Popular',
    features: [
      '30 videos/month',
      'Auto captions (no watermark)',
      '1080p export',
      'All caption styles',
      'B-roll library',
      '5 languages',
      'Silence remover',
      'Background music',
      'Email support'
    ],
    cta: 'Start Starter',
    ctaLink: '/editor',
    highlight: true
  },
  {
    name: 'Pro',
    price: { monthly: 19, yearly: 15 },
    desc: 'For serious creators',
    badge: null,
    features: [
      'Unlimited videos',
      'Auto captions (no watermark)',
      '4K export',
      'All caption styles',
      'B-roll library',
      '30+ languages',
      'Silence remover',
      'Background music',
      'Auto clip generation',
      'Multi-platform export',
      'Priority support'
    ],
    cta: 'Start Pro',
    ctaLink: '/editor',
    highlight: false
  },
  {
    name: 'Agency',
    price: { monthly: 49, yearly: 39 },
    desc: 'For teams & agencies',
    badge: null,
    features: [
      'Unlimited videos',
      'Everything in Pro',
      '5 team members',
      'White-label exports',
      'API access',
      'Batch processing',
      'Analytics dashboard',
      'Dedicated support',
      'Custom branding'
    ],
    cta: 'Start Agency',
    ctaLink: '/editor',
    highlight: false
  }
];

const FAQ = [
  { q: 'Is there a free trial?', a: 'Yes! The Free plan gives you 3 videos per month forever — no credit card required.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel anytime from your dashboard. No questions asked.' },
  { q: 'What video formats are supported?', a: 'We support MP4, MOV, AVI, MKV, WebM, and M4V.' },
  { q: 'How accurate are the captions?', a: 'We use AssemblyAI which delivers 95-99% accuracy across 30+ languages.' },
  { q: 'Do you offer refunds?', a: 'Yes, we offer a 7-day money-back guarantee on all paid plans.' },
  { q: 'Can I upgrade or downgrade?', a: 'Yes, you can change plans at any time. Changes take effect immediately.' }
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="pricing-page">
      <div className="pricing-hero">
        <div className="section-eyebrow">Pricing</div>
        <h1 className="section-title">Simple, honest pricing</h1>
        <p className="section-subtitle">Cheaper than hiring an editor. Faster than doing it yourself.</p>

        <div className="billing-toggle">
          <span className={!yearly ? 'active' : ''}>Monthly</span>
          <button
            className={`toggle-btn ${yearly ? 'yearly' : ''}`}
            onClick={() => setYearly(!yearly)}
          >
            <span className="toggle-knob" />
          </button>
          <span className={yearly ? 'active' : ''}>
            Yearly <span className="save-badge">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="plans-grid">
        {PLANS.map((plan) => (
          <div key={plan.name} className={`plan-card ${plan.highlight ? 'plan-highlight' : ''}`}>
            {plan.badge && <div className="plan-badge">{plan.badge}</div>}
            <div className="plan-header">
              <h2 className="plan-name">{plan.name}</h2>
              <p className="plan-desc">{plan.desc}</p>
              <div className="plan-price">
                <span className="price-currency">$</span>
                <span className="price-amount">
                  {yearly ? plan.price.yearly : plan.price.monthly}
                </span>
                <span className="price-period">/mo</span>
              </div>
              {yearly && plan.price.monthly > 0 && (
                <p className="price-save">
                  Save ${(plan.price.monthly - plan.price.yearly) * 12}/year
                </p>
              )}
            </div>

            <div className="plan-divider" />

            <ul className="plan-features">
              {plan.features.map((f, i) => (
                <li key={i} className="plan-feature">
                  <span className="feature-check">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              to={plan.ctaLink}
              className={`btn btn-xl plan-cta ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Comparison note */}
      <div className="pricing-note">
        <p>💡 Submagic starts at $20/month. HuliMagic gives you more features starting at <strong>$9/month</strong>.</p>
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '48px' }}>
          Frequently asked questions
        </h2>
        <div className="faq-grid">
          {FAQ.map((f, i) => (
            <div key={i} className="faq-card">
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

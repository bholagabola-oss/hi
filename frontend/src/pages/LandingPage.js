import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';

const FEATURES = [
  { icon: '🎯', title: 'Auto Captions', desc: '99% accurate AI captions in 30+ languages. Viral styles that boost retention.' },
  { icon: '✂️', title: 'Smart Clips', desc: 'Turn long videos into 10+ viral shorts automatically. AI finds the best moments.' },
  { icon: '🎬', title: 'B-Roll Magic', desc: 'Auto-suggest and overlay relevant B-roll footage from millions of free videos.' },
  { icon: '🔇', title: 'Silence Remover', desc: 'Cut awkward pauses and dead air instantly. Keep viewers hooked.' },
  { icon: '🎵', title: 'Music Library', desc: 'Add royalty-free background music matched to your video\'s mood.' },
  { icon: '🌍', title: 'Translate & Dub', desc: 'Translate captions into 30+ languages. Reach a global audience.' },
  { icon: '📐', title: 'Auto Reframe', desc: 'Convert landscape to vertical for TikTok, Reels, Shorts in one click.' },
  { icon: '📤', title: 'Multi-Platform Export', desc: 'Export optimized for TikTok, Instagram, YouTube Shorts simultaneously.' }
];

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Content Creator', text: 'HuliMagic saved me 4 hours every week. My views went up 300% after switching.', avatar: '👩‍💻' },
  { name: 'Marcus T.', role: 'Marketing Agency', text: 'We produce 50+ videos a month for clients. HuliMagic made that possible with a small team.', avatar: '👨‍💼' },
  { name: 'Aisha R.', role: 'Podcast Host', text: 'The auto-clip feature is insane. It found highlights I would have missed completely.', avatar: '🎙️' },
  { name: 'Dev P.', role: 'YouTube Creator', text: 'Best caption tool I\'ve used. The viral styles actually work — my retention improved by 45%.', avatar: '🎥' }
];

const PLATFORMS = ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Twitter/X', 'LinkedIn', 'Facebook'];

export default function LandingPage() {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing">
      <Navbar />

      {/* Hero */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid" />
        </div>

        <div className="hero-content">
          <div className="hero-badge animate-fade-in">
            <span>✦</span>
            <span>AI-Powered Video Editing</span>
            <span className="badge-dot" />
            <span>Free to Start</span>
          </div>

          <h1 className="hero-title animate-fade-in">
            Turn Any Video Into<br />
            <span className="gradient-text">Viral Shorts</span><br />
            In Seconds
          </h1>

          <p className="hero-subtitle animate-fade-in">
            HuliMagic uses AI to auto-caption, clip, reframe, and export your videos<br />
            for TikTok, Reels, and Shorts — faster than ever before.
          </p>

          <div className="hero-actions animate-fade-in">
            <Link to="/editor" className="btn btn-primary btn-xl">
              ✦ Start Creating Free
            </Link>
            <Link to="/pricing" className="btn btn-secondary btn-xl">
              View Pricing
            </Link>
          </div>

          <div className="hero-social-proof animate-fade-in">
            <div className="avatars">
              {['👩', '👨', '👩‍🦰', '👨‍🦱', '👩‍🦳'].map((a, i) => (
                <div key={i} className="avatar">{a}</div>
              ))}
            </div>
            <span><strong>12,000+</strong> creators trust HuliMagic</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-phone-mockup">
            <div className="phone-screen">
              <div className="phone-video">
                <div className="phone-caption-demo">
                  <span className="caption-word c1">Turn</span>
                  <span className="caption-word c2">your</span>
                  <span className="caption-word c3">videos</span>
                </div>
                <div className="phone-caption-demo-2">
                  <span className="caption-word c4">VIRAL</span>
                  <span className="caption-word c5">🔥</span>
                </div>
              </div>
              <div className="phone-ui">
                <div className="phone-stat">
                  <span className="stat-label">Views</span>
                  <span className="stat-value">2.4M</span>
                </div>
                <div className="phone-stat">
                  <span className="stat-label">Likes</span>
                  <span className="stat-value">48K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="platforms reveal">
        <p className="platforms-label">Export optimized for</p>
        <div className="platforms-list">
          {PLATFORMS.map(p => (
            <div key={p} className="platform-chip">{p}</div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features reveal" id="features">
        <div className="section-header">
          <div className="section-eyebrow">Everything You Need</div>
          <h2 className="section-title">All tools. One platform.</h2>
          <p className="section-subtitle">Stop juggling 5 different apps. HuliMagic does it all.</p>
        </div>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works reveal">
        <div className="section-header">
          <div className="section-eyebrow">Simple as 1-2-3</div>
          <h2 className="section-title">From raw footage to viral clip</h2>
        </div>

        <div className="steps">
          {[
            { num: '01', title: 'Upload your video', desc: 'Drop in any video — podcast, interview, talking head, vlog. Any format works.' },
            { num: '02', title: 'AI does the magic', desc: 'HuliMagic transcribes, finds highlights, generates captions and clips automatically.' },
            { num: '03', title: 'Export & publish', desc: 'Download your optimized shorts and post directly to your platforms.' }
          ].map((s, i) => (
            <div key={i} className="step reveal">
              <div className="step-num">{s.num}</div>
              <div className="step-content">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              {i < 2 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials reveal">
        <div className="section-header">
          <div className="section-eyebrow">Loved by Creators</div>
          <h2 className="section-title">Real results, real people</h2>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card reveal">
              <div className="testimonial-stars">{'★'.repeat(5)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta reveal">
        <div className="cta-card">
          <div className="cta-orb" />
          <h2 className="cta-title">Start creating viral content today</h2>
          <p className="cta-subtitle">No credit card required. 3 free videos every month.</p>
          <Link to="/editor" className="btn btn-primary btn-xl">
            ✦ Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <span>✦</span>
            <span>Huli<span>magic</span></span>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <Link to="/pricing">Pricing</Link>
            <a href="mailto:hello@hulimagic.com">Contact</a>
          </div>
          <p className="footer-copy">© 2025 HuliMagic. Built with ❤️ for creators.</p>
        </div>
      </footer>
    </div>
  );
}

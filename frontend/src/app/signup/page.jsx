"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

/* ─── SVG Icons ─── */
const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.09 24.09 0 0 0 0 21.56l7.98-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const CheckCircleIcon = ({ checked }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={checked ? "#22c55e" : "#cbd5e1"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {checked ? <path d="M20 6 9 17l-5-5"/> : <circle cx="12" cy="12" r="10" stroke="#cbd5e1"/>}
  </svg>
);


/* ─── Password strength helper ─── */
function checkRequirements(pw) {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw)
  };
}

function getStrength(reqs) {
  const score = Object.values(reqs).filter(Boolean).length;
  if (score === 0) return { label: "", color: "" };
  if (score <= 2) return { label: "Weak", color: "#ef4444" };
  if (score <= 4) return { label: "Medium", color: "#eab308" };
  return { label: "Strong", color: "#22c55e" };
}

/* ─── Floating illustration (same as login) ─── */
function Illustration() {
  return (
    <div className="sp-illustration" aria-hidden>
      <div className="sp-glow" />
      <div className="sp-dash-card sp-float-a">
        <div className="sp-dash-bar sp-bar--wide" />
        <div className="sp-dash-bar sp-bar--mid" />
        <div style={{ display:"flex", gap:8, marginTop:10 }}>
          <div className="sp-dash-mini sp-mini--blue" />
          <div className="sp-dash-mini sp-mini--purple" />
          <div className="sp-dash-mini sp-mini--green" />
        </div>
      </div>
      <div className="sp-file-badge sp-badge--pdf sp-float-b">
        <span style={{fontSize:18}}>📄</span>
        <span style={{fontSize:11, fontWeight:700, color:"#ef4444"}}>PDF</span>
      </div>
      <div className="sp-file-badge sp-badge--img sp-float-c">
        <span style={{fontSize:18}}>🖼️</span>
        <span style={{fontSize:11, fontWeight:700, color:"#f97316"}}>IMG</span>
      </div>
      <div className="sp-file-badge sp-badge--doc sp-float-d">
        <span style={{fontSize:18}}>📝</span>
        <span style={{fontSize:11, fontWeight:700, color:"#3b82f6"}}>DOC</span>
      </div>
      <div className="sp-file-badge sp-badge--zip sp-float-e">
        <span style={{fontSize:18}}>🗜️</span>
        <span style={{fontSize:11, fontWeight:700, color:"#8b5cf6"}}>ZIP</span>
      </div>
      <div className="sp-progress-pill sp-float-f">
        <div style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",flexShrink:0}} />
        <div>
          <div style={{fontSize:11,fontWeight:700,color:"#fff",lineHeight:1}}>Processing...</div>
          <div className="sp-progress-bar"><div className="sp-progress-fill" /></div>
        </div>
      </div>
      <div className="sp-stat-pill sp-float-g">
        <span style={{fontSize:16}}>✨</span>
        <div>
          <div style={{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1}}>Free</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.7)"}}>Forever</div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [showCf,   setShowCf]   = useState(false);
  const [agreed,   setAgreed]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  const reqs = useMemo(() => checkRequirements(password), [password]);
  const strength = useMemo(() => getStrength(reqs), [reqs]);
  const pwMatch   = confirm.length > 0 && confirm === password;
  const pwNoMatch = confirm.length > 0 && confirm !== password;

  function handleSubmit(e) {
    e.preventDefault();
    if (!agreed || pwNoMatch) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  }

  return (
    <div className="sp-root">

      {/* ══════════ LEFT — Brand Panel ══════════ */}
      <div className="sp-left">
        <div className="sp-bg-shape sp-shape--1" />
        <div className="sp-bg-shape sp-shape--2" />
        <div className="sp-bg-shape sp-shape--3" />
        <div className="sp-bg-grid" />

        <div className="sp-left-inner">
          <Link href="/" className="sp-brand-logo">
            <div className="sp-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            AllTools
          </Link>

          <div className="sp-headline-block">
            <h1 className="sp-headline">
              Join thousands of<br />
              <span className="sp-headline-accent">productive teams</span>
            </h1>
            <p className="sp-tagline">
              Convert, edit, optimize and manage your files easily with powerful online tools.
            </p>
          </div>

          <Illustration />

          <div className="sp-features">
            <div className="sp-feat-card">
              <span className="sp-feat-icon">🚀</span>
              <div>
                <div className="sp-feat-title">100+ Powerful Tools</div>
                <div className="sp-feat-desc">PDF, Image, Document and Career tools</div>
              </div>
            </div>
            <div className="sp-feat-card">
              <span className="sp-feat-icon">⚡</span>
              <div>
                <div className="sp-feat-title">Fast Processing</div>
                <div className="sp-feat-desc">Browser-based tools with instant results</div>
              </div>
            </div>
            <div className="sp-feat-card">
              <span className="sp-feat-icon">🔒</span>
              <div>
                <div className="sp-feat-title">Secure &amp; Private</div>
                <div className="sp-feat-desc">Your files are processed safely</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ RIGHT — Auth Panel ══════════ */}
      <div className="sp-right">
        <Link href="/" className="sp-mobile-logo">
          <div className="sp-mobile-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          AllTools
        </Link>

        <div className="sp-auth-card sp-auth-card--signup" id="signup-card">
          <div className="sp-auth-head">
            <h2 className="sp-auth-title">Create your AllTools account</h2>
            <p className="sp-auth-sub">Start for free — no credit card required</p>
          </div>

          {/* Social first on signup */}
          <div className="sp-socials">
            <button type="button" className="sp-social-btn" id="signup-google">
              <GoogleIcon /> Continue with Google
            </button>
            <button type="button" className="sp-social-btn" id="signup-github">
              <GitHubIcon /> Continue with GitHub
            </button>
          </div>

          <div className="sp-divider"><span>OR</span></div>

          <form onSubmit={handleSubmit} className="sp-form" id="signup-form">
            {/* Name */}
            <div className="sp-field">
              <label htmlFor="signup-name" className="sp-label">Full name</label>
              <input
                id="signup-name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="sp-input"
                placeholder="Jane Smith"
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className="sp-field">
              <label htmlFor="signup-email" className="sp-label">Email address</label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="sp-input"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="sp-field">
              <label htmlFor="signup-password" className="sp-label">Password</label>
              <div className="sp-input-wrap">
                <input
                  id="signup-password"
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="sp-input sp-input--pw"
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                />
                <button type="button" className="sp-eye" onClick={() => setShowPw(v => !v)} aria-label="Toggle" tabIndex={-1}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
              
              {/* Detailed Strength Checklist */}
              <div className="sp-reqs-box">
                  <div className="sp-reqs-head">
                     <span className="sp-reqs-title">Password requirements:</span>
                     {password.length > 0 && <span className="sp-strength-lbl" style={{ color: strength.color }}>{strength.label}</span>}
                  </div>
                  <div className="sp-reqs-grid">
                      <div className={`sp-req-item ${reqs.length ? 'sp-req-ok' : ''}`}>
                          <CheckCircleIcon checked={reqs.length} /> Minimum 8 characters
                      </div>
                      <div className={`sp-req-item ${reqs.upper ? 'sp-req-ok' : ''}`}>
                          <CheckCircleIcon checked={reqs.upper} /> One uppercase letter
                      </div>
                      <div className={`sp-req-item ${reqs.lower ? 'sp-req-ok' : ''}`}>
                          <CheckCircleIcon checked={reqs.lower} /> One lowercase letter
                      </div>
                      <div className={`sp-req-item ${reqs.number ? 'sp-req-ok' : ''}`}>
                          <CheckCircleIcon checked={reqs.number} /> One number
                      </div>
                      <div className={`sp-req-item ${reqs.special ? 'sp-req-ok' : ''}`}>
                          <CheckCircleIcon checked={reqs.special} /> One special character
                      </div>
                  </div>
              </div>
            </div>

            {/* Confirm */}
            <div className="sp-field">
              <label htmlFor="signup-confirm" className="sp-label">Confirm password</label>
              <div className="sp-input-wrap">
                <input
                  id="signup-confirm"
                  type={showCf ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className={`sp-input sp-input--pw${pwNoMatch ? " sp-input--err" : ""}${pwMatch ? " sp-input--ok" : ""}`}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
                <button type="button" className="sp-eye" onClick={() => setShowCf(v => !v)} aria-label="Toggle" tabIndex={-1}>
                  <EyeIcon open={showCf} />
                </button>
              </div>
              {pwNoMatch && <p className="sp-field-err" id="signup-pw-mismatch">Passwords don&apos;t match</p>}
            </div>

            {/* Terms */}
            <label className="sp-check" id="signup-terms">
              <input type="checkbox" checked={agreed} onChange={() => setAgreed(v => !v)} id="signup-agree" required />
              <span className="sp-checkmark" />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="sp-ilink">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" className="sp-ilink">Privacy Policy</Link>
              </span>
            </label>

            <button
              type="submit"
              id="signup-submit"
              className={`sp-submit${loading ? " sp-submit--loading" : ""}`}
              disabled={loading || !agreed || pwNoMatch}
            >
              {loading ? <span className="sp-spinner" /> : "Create Account"}
            </button>
          </form>

          <p className="sp-switch">
            Already have an account?{" "}
            <Link href="/login" className="sp-switch-link" id="signup-login-link">Login</Link>
          </p>
        </div>
      </div>

    </div>
  );
}

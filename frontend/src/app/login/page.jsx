"use client";

import Link from "next/link";
import { useState } from "react";

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

/* ─── Floating file icons illustration ─── */
function Illustration() {
  return (
    <div className="sp-illustration" aria-hidden>
      {/* Central glow */}
      <div className="sp-glow" />

      {/* Dashboard card */}
      <div className="sp-dash-card sp-float-a">
        <div className="sp-dash-bar sp-bar--wide" />
        <div className="sp-dash-bar sp-bar--mid" />
        <div style={{ display:"flex", gap:8, marginTop:10 }}>
          <div className="sp-dash-mini sp-mini--blue" />
          <div className="sp-dash-mini sp-mini--purple" />
          <div className="sp-dash-mini sp-mini--green" />
        </div>
      </div>

      {/* Floating file badges */}
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

      {/* Progress pill */}
      <div className="sp-progress-pill sp-float-f">
        <div style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",flexShrink:0}} />
        <div>
          <div style={{fontSize:11,fontWeight:700,color:"#fff",lineHeight:1}}>Converting...</div>
          <div className="sp-progress-bar">
            <div className="sp-progress-fill" />
          </div>
        </div>
      </div>

      {/* Stat pill */}
      <div className="sp-stat-pill sp-float-g">
        <span style={{fontSize:16}}>⚡</span>
        <div>
          <div style={{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1}}>100+</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.7)"}}>Tools</div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading,  setLoading]  = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  }

  return (
    <div className="sp-root">

      {/* ══════════ LEFT — Brand Panel ══════════ */}
      <div className="sp-left">
        {/* Background shapes */}
        <div className="sp-bg-shape sp-shape--1" />
        <div className="sp-bg-shape sp-shape--2" />
        <div className="sp-bg-shape sp-shape--3" />
        <div className="sp-bg-grid" />

        <div className="sp-left-inner">
          {/* Logo */}
          <Link href="/" className="sp-brand-logo">
            <div className="sp-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            AllTools
          </Link>

          {/* Headline */}
          <div className="sp-headline-block">
            <h1 className="sp-headline">
              All your digital tools<br />
              <span className="sp-headline-accent">in one place</span>
            </h1>
            <p className="sp-tagline">
              Convert, edit, optimize and manage your files easily with powerful online tools.
            </p>
          </div>

          {/* Illustration */}
          <Illustration />

          {/* Feature cards */}
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
        {/* Mobile-only logo */}
        <Link href="/" className="sp-mobile-logo">
          <div className="sp-mobile-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          AllTools
        </Link>

        <div className="sp-auth-card" id="login-card">
          <div className="sp-auth-head">
            <h2 className="sp-auth-title">Welcome Back</h2>
            <p className="sp-auth-sub">Login to continue to AllTools</p>
          </div>

          <form onSubmit={handleSubmit} className="sp-form" id="login-form">
            {/* Email */}
            <div className="sp-field">
              <label htmlFor="login-email" className="sp-label">Email address</label>
              <input
                id="login-email"
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
              <div className="sp-label-row">
                <label htmlFor="login-password" className="sp-label">Password</label>
                <Link href="/forgot-password" className="sp-forgot" id="login-forgot">Forgot password?</Link>
              </div>
              <div className="sp-input-wrap">
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="sp-input sp-input--pw"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button type="button" className="sp-eye" onClick={() => setShowPw(v => !v)} aria-label="Toggle password" tabIndex={-1}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="sp-check" id="login-remember-label">
              <input type="checkbox" checked={remember} onChange={() => setRemember(v => !v)} id="login-remember" />
              <span className="sp-checkmark" />
              Keep me signed in
            </label>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              className={`sp-submit${loading ? " sp-submit--loading" : ""}`}
              disabled={loading}
            >
              {loading ? <span className="sp-spinner" /> : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="sp-divider"><span>OR</span></div>

          {/* Social */}
          <div className="sp-socials">
            <button type="button" className="sp-social-btn" id="login-google">
              <GoogleIcon /> Continue with Google
            </button>
            <button type="button" className="sp-social-btn" id="login-github">
              <GitHubIcon /> Continue with GitHub
            </button>
          </div>

          {/* Switch */}
          <p className="sp-switch">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="sp-switch-link" id="login-create-account">Create Account</Link>
          </p>
        </div>
      </div>

    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/signin.css";

export default function SignInPage() {
    const [isSignUp, setIsSignUp] = useState(false);

    return (
        <div className="signin-layout">
            <div className="signin-card">
                <div className="signin-left">
                    <div className="signin-logo">
                        <span className="logo-mark"></span>
                        <span>ChatVerse</span>
                    </div>

                    <div className="signin-form-wrap">
                        <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
                        <p className="subtitle">
                            {isSignUp ? "Create an account to start chatting" : "Welcome back! Please enter your details to continue"}
                        </p>

                        <div className="account-type">
                            <label className="radio-label">
                                <input type="radio" name="type" defaultChecked />
                                <span className="custom-radio"></span>
                                As a User
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="type" />
                                <span className="custom-radio"></span>
                                As a Developer
                            </label>
                        </div>

                        <div className="social-login">
                            <button className="social-btn">
                                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                {isSignUp ? "Sign up with Google" : "Sign in with Google"}
                            </button>
                            <button className="social-btn">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" width="18" />
                                {isSignUp ? "Sign up with Apple" : "Sign in with Apple"}
                            </button>
                        </div>

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <form className="signin-form">
                            <div className="form-group">
                                <label>Email <span className="req">*</span></label>
                                <div className="input-wrap">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" ry="2" /><polyline points="3 7 12 13 21 7" /></svg>
                                    <input type="email" placeholder="hello@chatverse.com" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="flex-label">
                                    <span>Password <span className="req">*</span></span>
                                    <a href="#" className="forgot-link">Forgot password?</a>
                                </label>
                                <div className="input-wrap">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                    <input type="password" placeholder="Enter password" />
                                    <svg className="input-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                </div>
                            </div>
                            <Link to="/app" className="submit-btn" style={{ textDecoration: 'none' }}>
                                {isSignUp ? "Sign up" : "Sign in"}
                            </Link>
                        </form>

                        <p className="signup-text">
                            {isSignUp ? (
                                <>Already have an account? <span style={{ cursor: "pointer", color: "#273F32", fontWeight: 600 }} onClick={() => setIsSignUp(false)}>Sign In</span></>
                            ) : (
                                <>Don't have an account? <span style={{ cursor: "pointer", color: "#273F32", fontWeight: 600 }} onClick={() => setIsSignUp(true)}>Sign Up</span></>
                            )}
                        </p>
                    </div>
                </div>

                <div className="signin-right">
                    <div className="quote-box">
                        <div className="quote-marks">❝</div>
                        <p>
                            ChatVerse is the ultimate multi-mode RAG platform. Uncover insights instantly across your PDFs, code repositories, videos, and emails with exact line-level traceability.
                        </p>
                        <div className="quote-marks right">❞</div>

                        <div className="author">
                            <span className="logo-mark" style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #00b96b, #6c5ce7)' }}></span>
                            <div>
                                <strong>ChatVerse Platform</strong>
                                <span>Multi-source Engine</span>
                            </div>
                        </div>
                    </div>

                    <div className="illustration">
                        <img src="/signin-illustration.png" alt="Buildings Illustration" />
                    </div>
                </div>
            </div>
        </div>
    );
}

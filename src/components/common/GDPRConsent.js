"use client";
import React, { useState, useEffect } from 'react';

const GDPRConsent = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [preferences, setPreferences] = useState({
        essential: true, // Always required
        functional: false,
        analytics: false
    });

    useEffect(() => {
        // Check if user has already given consent
        const consent = localStorage.getItem('gdpr-consent');
        if (!consent) {
            setShowBanner(true);
        }

        // Check screen size for mobile responsiveness
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleAcceptAll = () => {
        const consent = {
            essential: true,
            functional: true,
            analytics: true,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('gdpr-consent', JSON.stringify(consent));
        setShowBanner(false);
    };

    const handleAcceptSelected = () => {
        const consent = {
            ...preferences,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('gdpr-consent', JSON.stringify(consent));
        setShowBanner(false);
    };

    const handleDecline = () => {
        const consent = {
            essential: true, // Essential cookies are always required
            functional: false,
            analytics: false,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('gdpr-consent', JSON.stringify(consent));
        setShowBanner(false);
    };

    const handlePreferenceChange = (type) => {
        if (type === 'essential') return; // Essential cannot be disabled
        setPreferences(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    // Modern Toggle Switch Component
    const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
        <div 
            onClick={() => !disabled && onChange()}
            style={{
                position: 'relative',
                width: isMobile ? '44px' : '48px',
                height: isMobile ? '24px' : '26px',
                backgroundColor: disabled ? '#E5E7EB' : (checked ? 'var(--color-white)' : 'rgba(255,255,255,0.3)'),
                borderRadius: isMobile ? '12px' : '13px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'var(--transition)',
                display: 'flex',
                alignItems: 'center',
                padding: isMobile ? '2px' : '3px',
                border: disabled ? 'none' : '1px solid rgba(255,255,255,0.2)',
                flexShrink: 0
            }}
        >
            <div
                style={{
                    width: isMobile ? '18px' : '20px',
                    height: isMobile ? '18px' : '20px',
                    backgroundColor: disabled ? '#9CA3AF' : (checked ? 'var(--color-primary)' : 'rgba(255,255,255,0.8)'),
                    borderRadius: '50%',
                    transform: checked ? `translateX(${isMobile ? '20px' : '22px'})` : 'translateX(0)',
                    transition: 'var(--transition)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
            />
        </div>
    );

    if (!showBanner) return null;

    return (
        <div className="gdpr-consent-banner" style={{
            position: 'fixed',
            bottom: isMobile ? '10px' : '20px',
            left: isMobile ? '10px' : '20px',
            right: isMobile ? '10px' : '20px',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #1E40AF 100%)',
            color: 'var(--color-white)',
            padding: isMobile ? '20px' : '30px',
            zIndex: 9999,
            borderRadius: isMobile ? '12px' : '16px',
            boxShadow: '0 25px 80px rgba(9, 99, 211, 0.3), 0 12px 40px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255,255,255,0.15)',
            fontFamily: 'var(--font-primary)',
            fontSize: isMobile ? '14px' : 'var(--font-size-b1)',
            lineHeight: 'var(--line-height-b1)',
            backdropFilter: 'blur(20px)'
        }}>
            <div className="gdpr-content" style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'space-between', 
                flexWrap: 'wrap', 
                gap: isMobile ? '16px' : '24px' 
            }}>
                <div className="gdpr-text" style={{ 
                    flex: '1', 
                    minWidth: isMobile ? '280px' : '400px' 
                }}>
                    <h3 style={{ 
                        margin: '0 0 12px 0', 
                        fontSize: isMobile ? 'var(--h5)' : 'var(--h4)', 
                        fontWeight: 'var(--p-bold)',
                        color: 'var(--color-white)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: isMobile ? '8px' : '12px',
                        letterSpacing: '-0.02em'
                    }}>
                        🍪 Cookie & Privacy Settings
                    </h3>
                    <p style={{ 
                        margin: '0', 
                        fontSize: isMobile ? '14px' : 'var(--font-size-b1)', 
                        color: 'rgba(255,255,255,0.95)',
                        lineHeight: '1.6',
                        fontWeight: 'var(--p-regular)',
                        textAlign: 'center'
                    }}>
                        {isMobile 
                            ? "We use cookies to enhance your experience and save preferences. Our website remembers your login, saves resume drafts, and provides job recommendations."
                            : "We use cookies and local storage to enhance your experience, save your preferences, and provide personalized content. Our website uses these technologies to remember your login status, save your resume drafts, bookmark your favorite jobs, and provide you with relevant job recommendations based on your preferences."
                        }
                        {!showDetails && (
                            <button 
                                onClick={() => setShowDetails(true)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.9)',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    marginLeft: '8px',
                                    fontSize: isMobile ? '14px' : 'var(--font-size-b1)',
                                    fontFamily: 'var(--font-primary)',
                                    fontWeight: 'var(--p-medium)',
                                    transition: 'var(--transition)'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.color = 'var(--color-white)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.color = 'rgba(255,255,255,0.9)';
                                }}
                            >
                                Learn more
                            </button>
                        )}
                    </p>
                </div>

                <div className="gdpr-actions" style={{ 
                    display: 'flex', 
                    gap: isMobile ? '8px' : '12px', 
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    minWidth: 'fit-content',
                    width: isMobile ? '100%' : 'auto',
                    justifyContent: isMobile ? 'center' : 'flex-end'
                }}>
                    <button 
                        onClick={handleDecline}
                        style={{
                            height: isMobile ? '40px' : '44px',
                            padding: isMobile ? '0 16px' : '0 20px',
                            fontSize: isMobile ? '14px' : 'var(--font-size-b1)',
                            fontWeight: 'var(--p-medium)',
                            color: 'rgba(255,255,255,0.9)',
                            border: '2px solid rgba(255,255,255,0.25)',
                            borderRadius: isMobile ? '10px' : '12px',
                            background: 'rgba(255,255,255,0.08)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontFamily: 'var(--font-primary)',
                            backdropFilter: 'blur(10px)',
                            minWidth: isMobile ? '80px' : '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: isMobile ? '1' : 'none'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.15)';
                            e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                            e.target.style.color = 'var(--color-white)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.08)';
                            e.target.style.borderColor = 'rgba(255,255,255,0.25)';
                            e.target.style.color = 'rgba(255,255,255,0.9)';
                        }}
                    >
                        Decline
                    </button>
                    <button 
                        onClick={handleAcceptSelected}
                        style={{
                            height: isMobile ? '40px' : '44px',
                            padding: isMobile ? '0 16px' : '0 20px',
                            fontSize: isMobile ? '14px' : 'var(--font-size-b1)',
                            fontWeight: 'var(--p-medium)',
                            color: 'rgba(255,255,255,0.9)',
                            border: '2px solid rgba(255,255,255,0.25)',
                            borderRadius: isMobile ? '10px' : '12px',
                            background: 'rgba(255,255,255,0.12)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontFamily: 'var(--font-primary)',
                            backdropFilter: 'blur(10px)',
                            minWidth: isMobile ? '100px' : '120px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: isMobile ? '1' : 'none'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.2)';
                            e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                            e.target.style.color = 'var(--color-white)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.12)';
                            e.target.style.borderColor = 'rgba(255,255,255,0.25)';
                            e.target.style.color = 'rgba(255,255,255,0.9)';
                        }}
                    >
                        {isMobile ? 'Selected' : 'Accept Selected'}
                    </button>
                    <button 
                        onClick={handleAcceptAll}
                        style={{
                            height: isMobile ? '40px' : '44px',
                            padding: isMobile ? '0 20px' : '0 24px',
                            fontSize: isMobile ? '14px' : 'var(--font-size-b1)',
                            fontWeight: 'var(--p-semi-bold)',
                            color: 'var(--color-primary)',
                            border: 'none',
                            borderRadius: isMobile ? '10px' : '12px',
                            background: 'var(--color-white)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontFamily: 'var(--font-primary)',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                            minWidth: isMobile ? '90px' : '110px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            letterSpacing: '0.01em',
                            flex: isMobile ? '1' : 'none'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                        }}
                    >
                        {isMobile ? 'Accept All' : 'Accept All'}
                    </button>
                </div>
            </div>

            {showDetails && (
                <div className="gdpr-details" style={{ 
                    marginTop: isMobile ? '20px' : '30px', 
                    padding: isMobile ? '20px' : '30px', 
                    background: 'rgba(255,255,255,0.12)', 
                    borderRadius: isMobile ? '12px' : '16px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(15px)'
                }}>
                    <h4 style={{ 
                        margin: '0 0 20px 0', 
                        fontSize: isMobile ? 'var(--h6)' : 'var(--h5)', 
                        fontWeight: 'var(--p-semi-bold)',
                        color: 'var(--color-white)',
                        letterSpacing: '-0.01em',
                        textAlign: 'center'
                    }}>
                        Cookie Preferences
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '12px' : '20px' }}>
                            <div style={{ marginTop: '2px' }}>
                                <ToggleSwitch 
                                    checked={preferences.essential} 
                                    onChange={() => {}} 
                                    disabled={true}
                                />
                            </div>
                            <div style={{ flex: '1' }}>
                                <strong style={{ 
                                    fontSize: isMobile ? '14px' : 'var(--font-size-b1)', 
                                    fontWeight: 'var(--p-semi-bold)',
                                    color: 'var(--color-white)',
                                    display: 'block',
                                    marginBottom: '6px',
                                    letterSpacing: '0.01em'
                                }}>
                                    Essential Cookies
                                </strong>
                                <p style={{ 
                                    margin: '0', 
                                    fontSize: isMobile ? '13px' : 'var(--font-size-b1)', 
                                    color: 'rgba(255,255,255,0.85)',
                                    lineHeight: '1.6',
                                    fontWeight: 'var(--p-regular)'
                                }}>
                                    {isMobile 
                                        ? "Required for basic site functionality, authentication, and security. Cannot be disabled."
                                        : "Required for basic site functionality, authentication, and security. These cookies enable core features like user login, session management, and security measures. They cannot be disabled as they are necessary for the website to function properly."
                                    }
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '12px' : '20px' }}>
                            <div style={{ marginTop: '2px' }}>
                                <ToggleSwitch 
                                    checked={preferences.functional} 
                                    onChange={() => handlePreferenceChange('functional')}
                                />
                            </div>
                            <div style={{ flex: '1' }}>
                                <strong style={{ 
                                    fontSize: isMobile ? '14px' : 'var(--font-size-b1)', 
                                    fontWeight: 'var(--p-semi-bold)',
                                    color: 'var(--color-white)',
                                    display: 'block',
                                    marginBottom: '6px',
                                    letterSpacing: '0.01em'
                                }}>
                                    Functional Cookies
                                </strong>
                                <p style={{ 
                                    margin: '0', 
                                    fontSize: isMobile ? '13px' : 'var(--font-size-b1)', 
                                    color: 'rgba(255,255,255,0.85)',
                                    lineHeight: '1.6',
                                    fontWeight: 'var(--p-regular)'
                                }}>
                                    {isMobile 
                                        ? "Enable resume saving, job bookmarks, and personalized preferences."
                                        : "Enable enhanced functionality and personalization. These cookies allow us to save your resume drafts, remember your job bookmarks, store your application preferences, and provide a more personalized experience tailored to your needs."
                                    }
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '12px' : '20px' }}>
                            <div style={{ marginTop: '2px' }}>
                                <ToggleSwitch 
                                    checked={preferences.analytics} 
                                    onChange={() => handlePreferenceChange('analytics')}
                                />
                            </div>
                            <div style={{ flex: '1' }}>
                                <strong style={{ 
                                    fontSize: isMobile ? '14px' : 'var(--font-size-b1)', 
                                    fontWeight: 'var(--p-semi-bold)',
                                    color: 'var(--color-white)',
                                    display: 'block',
                                    marginBottom: '6px',
                                    letterSpacing: '0.01em'
                                }}>
                                    Analytics Cookies
                                </strong>
                                <p style={{ 
                                    margin: '0', 
                                    fontSize: isMobile ? '13px' : 'var(--font-size-b1)', 
                                    color: 'rgba(255,255,255,0.85)',
                                    lineHeight: '1.6',
                                    fontWeight: 'var(--p-regular)'
                                }}>
                                    {isMobile 
                                        ? "Help us improve our services by collecting anonymous usage data."
                                        : "Help us improve our services by collecting anonymous usage data. These cookies provide insights into how users interact with our platform, helping us optimize performance, identify popular features, and enhance the overall user experience. No personal information is collected."
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowDetails(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255,255,255,0.8)',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            marginTop: '20px',
                            fontSize: isMobile ? '13px' : 'var(--font-size-b1)',
                            fontFamily: 'var(--font-primary)',
                            fontWeight: 'var(--p-medium)',
                            transition: 'var(--transition)',
                            padding: '8px 0',
                            width: '100%',
                            textAlign: 'center'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.color = 'var(--color-white)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.color = 'rgba(255,255,255,0.8)';
                        }}
                    >
                        Hide details
                    </button>
                </div>
            )}
        </div>
    );
};

export default GDPRConsent; 
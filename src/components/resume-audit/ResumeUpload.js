import React, { useState, useRef, useEffect } from 'react';
import { CVAuditService } from '@/utils/cvAuditService';
import { useAuth } from '@/contexts/AuthContext';

export default function ResumeUpload({ onFileUploaded, isProcessing }) {
    const { user } = useAuth();
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState('');
    const [selectedFileInfo, setSelectedFileInfo] = useState(null);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);

    // Resume tips that rotate every 5 seconds
    const resumeTips = [
        "💡 Tip: Use action verbs like 'achieved', 'developed', 'implemented' to make your experience stand out",
        "📊 Tip: Include quantifiable achievements with numbers and percentages to show impact",
        "🎯 Tip: Tailor your resume summary to match the specific job requirements",
        "📝 Tip: Keep your resume concise - aim for 1-2 pages maximum",
        "🔍 Tip: Use keywords from the job description to pass ATS screening",
        "📈 Tip: Show career progression by highlighting promotions and increased responsibilities",
        "🎨 Tip: Use consistent formatting and professional fonts for better readability",
        "⚡ Tip: Focus on recent and relevant experience - older roles can be summarized"
    ];

    // Progress simulation and tip rotation
    useEffect(() => {
        if (isProcessing) {
            // Reset progress when processing starts
            setProgress(0);
            setCurrentTipIndex(0);

            // Simulate progress
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev; // Stop at 90% until completion
                    return prev + Math.random() * 15;
                });
            }, 1000);

            // Rotate tips every 5 seconds
            const tipInterval = setInterval(() => {
                setCurrentTipIndex(prev => (prev + 1) % resumeTips.length);
            }, 5000);

            return () => {
                clearInterval(progressInterval);
                clearInterval(tipInterval);
            };
        } else {
            // Reset when not processing
            setProgress(0);
            setCurrentTipIndex(0);
        }
    }, [isProcessing]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleFile = (file) => {
        setError('');
        setSelectedFileInfo(null);
        
        // Use utility service for validation
        const validationErrors = CVAuditService.validateFile(file);
        
        if (validationErrors.length > 0) {
            setError(validationErrors[0]);
            return;
        }

        // Get file information using utility service
        const fileInfo = CVAuditService.getFileInfo(file);
        setSelectedFileInfo(fileInfo);

        // Show estimated processing time and method
        const estimatedTime = CVAuditService.getEstimatedProcessingTime(file.size, file.type);
        const processingMethod = CVAuditService.getProcessingMethod(file.type);
        
        // Call the parent's callback with file data
        onFileUploaded({
            name: file.name,
            size: file.size,
            type: file.type,
            file: file,
            estimatedTime: estimatedTime,
            processingMethod: processingMethod
        });
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragOver(false);
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const clearFile = () => {
        setSelectedFileInfo(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="upload-section">
            {!isProcessing ? (
                <div className="upload-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
                    <div className="upload-content">
                        <h2 className="upload-main-title">
                            Enhance Your Resume with Confidence
                        </h2>
                        <p className="upload-description">
                            Submit your resume and receive personalized feedback on optimizing it for success. Stand out from the competition and land your dream job with our resume audit tool.
                        </p>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div
                            className={`upload-area-integrated ${isDragOver ? 'drag-over' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            style={{
                                border: '1px dashed #d1d5db',
                                borderRadius: 16,
                                background: '#fcfcff',
                                minHeight: 260,
                                minWidth: 420,
                                maxWidth: 520,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '48px 32px',
                                margin: '0 auto',
                                boxSizing: 'border-box',
                                position: 'relative',
                            }}
                        >
                            <svg width="48" height="56" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 20 }}>
                                <rect x="8" y="4" width="32" height="48" rx="6" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="2" />
                                <path d="M24 20V40M24 40L17 33M24 40L31 33" stroke="#A3A3A3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <button
                                className="choose-file-btn"
                                onClick={handleButtonClick}
                                style={{
                                    background: 'none',
                                    color: '#4F46E5',
                                    fontWeight: 700,
                                    fontSize: '1.18rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    marginBottom: 6,
                                }}
                            >
                                Upload your resume
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="file-input"
                                accept=".docx"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <div style={{ color: '#6B7280', fontSize: 16, marginTop: 4, fontWeight: 500 }}>DOCX only, up to 5MB</div>
                            {error && (
                                <div className="upload-error" style={{ marginTop: 16, fontSize: 16 }}>
                                    ⚠️ {error}
                                </div>
                            )}
                            {selectedFileInfo && !error && (
                                <div className="file-info" style={{
                                    background: 'rgba(62, 183, 94, 0.1)',
                                    color: '#198754',
                                    padding: '16px 24px',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(62, 183, 94, 0.2)',
                                    marginTop: '20px',
                                    fontSize: '16px',
                                    width: '100%',
                                    textAlign: 'center',
                                }}>
                                    <strong>✓ File Selected:</strong> {selectedFileInfo.name}<br />
                                    <span style={{ fontSize: '13px', opacity: 0.8 }}>
                                        Size: {selectedFileInfo.sizeFormatted} | Type: {selectedFileInfo.extension.toUpperCase()}
                                    </span>
                                    <button
                                        onClick={clearFile}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#198754',
                                            cursor: 'pointer',
                                            fontSize: '18px',
                                            padding: '5px',
                                            marginLeft: 10,
                                        }}
                                        title="Remove file"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="processing-state">
                    <div className="processing-spinner"></div>
                    <h3 className="processing-title">Analyzing Your Resume</h3>
                    <p className="processing-subtitle">
                        Our AI is reviewing your resume and generating personalized feedback. This may take a few moments...
                    </p>
                    {/* Progress Bar */}
                    <div style={{
                        width: '100%',
                        maxWidth: '400px',
                        margin: '30px auto',
                        background: '#f0f0f0',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{
                            width: `${Math.min(progress, 100)}%`,
                            height: '12px',
                            background: 'linear-gradient(90deg, var(--color-primary), #0856c7)',
                            borderRadius: '10px',
                            transition: 'width 0.5s ease',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                right: '0',
                                bottom: '0',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                animation: 'shimmer 2s infinite'
                            }}></div>
                        </div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '20px' }}>
                        Progress: {Math.round(progress)}%
                    </p>
                    {selectedFileInfo && (
                        <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '30px' }}>
                            Processing: {selectedFileInfo.name} ({selectedFileInfo.sizeFormatted})
                        </p>
                    )}
                    {/* Rotating Tips */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(9, 99, 211, 0.05), rgba(9, 99, 211, 0.02))',
                        border: '1px solid rgba(9, 99, 211, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        marginTop: '20px',
                        maxWidth: '500px',
                        margin: '20px auto 0'
                    }}>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--color-primary)',
                            marginBottom: '8px',
                            textAlign: 'center'
                        }}>
                            💡 Resume Tip
                        </div>
                        <p style={{
                            fontSize: '14px',
                            color: 'var(--color-body)',
                            textAlign: 'center',
                            margin: '0',
                            lineHeight: '1.5',
                            minHeight: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {resumeTips[currentTipIndex]}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
} 
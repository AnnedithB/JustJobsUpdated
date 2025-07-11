import { NextResponse } from 'next/server';
import { getClientIP } from '@/utils/spamProtection';

// In-memory map for guest rate limiting (per IP)
const guestAuditMap = new Map();
// In-memory map for authenticated user rate limiting (per user ID)
const userAuditMap = new Map();

// Firebase Admin SDK for token verification
let admin;
try {
  admin = require('firebase-admin');
} catch (error) {
  console.warn('Firebase Admin SDK not available - using basic token check');
}

// Rate limiting configuration
const RATE_LIMITS = {
  GUEST: { maxAudits: 1, windowMs: 24 * 60 * 60 * 1000 }, // 1 audit per 24 hours
  AUTHENTICATED: { maxAudits: 10, windowMs: 60 * 60 * 1000 } // 10 audits per hour
};

// Helper function to check rate limit
function checkRateLimit(identifier, isAuthenticated = false) {
  const now = Date.now();
  const limits = isAuthenticated ? RATE_LIMITS.AUTHENTICATED : RATE_LIMITS.GUEST;
  const map = isAuthenticated ? userAuditMap : guestAuditMap;
  
  if (!map.has(identifier)) {
    map.set(identifier, { count: 1, firstAudit: now, lastAudit: now });
    return { allowed: true, remaining: limits.maxAudits - 1 };
  }
  
  const record = map.get(identifier);
  
  // Reset if window has passed
  if (now - record.firstAudit > limits.windowMs) {
    map.set(identifier, { count: 1, firstAudit: now, lastAudit: now });
    return { allowed: true, remaining: limits.maxAudits - 1 };
  }
  
  // Check if limit exceeded
  if (record.count >= limits.maxAudits) {
    const timeRemaining = limits.windowMs - (now - record.firstAudit);
    return { 
      allowed: false, 
      timeRemaining: Math.ceil(timeRemaining / 60000), // minutes
      message: isAuthenticated 
        ? `Rate limit exceeded. You can audit ${limits.maxAudits} resumes per hour. Please try again in ${Math.ceil(timeRemaining / 60000)} minutes.`
        : `You can only audit ${limits.maxAudits} resume as a guest per day. Please log in to audit more resumes.`
    };
  }
  
  // Increment count
  record.count++;
  record.lastAudit = now;
  return { allowed: true, remaining: limits.maxAudits - record.count };
}

export async function GET() {
  return NextResponse.json({ message: 'CV API Working' });
}

export async function POST(request) {
  try {
    console.log('🚀 CV API POST called');

    // --- ENHANCED AUTH CHECK ---
    let isAuthenticated = false;
    let userId = null;
    const authHeader = request.headers.get('authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.replace('Bearer ', '').trim();
      
      if (admin) {
        try {
          // Verify the Firebase ID token with additional checks
          const decodedToken = await admin.auth().verifyIdToken(idToken, true); // Check if token is revoked
          
          // Additional validation
          if (!decodedToken.uid || !decodedToken.email_verified) {
            throw new Error('Invalid token: missing UID or email not verified');
          }
          
          // Check if token is not too old (optional, Firebase handles this but extra security)
          const tokenAge = Date.now() - (decodedToken.iat * 1000);
          if (tokenAge > 3600000) { // 1 hour
            throw new Error('Token too old');
          }
          
          isAuthenticated = true;
          userId = decodedToken.uid;
          console.log(`✅ Authenticated user: ${userId}`);
        } catch (tokenError) {
          console.warn('❌ Invalid Firebase token:', tokenError.message);
          // Continue as unauthenticated user
        }
      } else {
        // Fallback: treat any Bearer token as authenticated (for development)
        isAuthenticated = true;
        userId = 'dev-user';
        console.log('⚠️ Using development mode authentication');
      }
    }

    // --- ENHANCED RATE LIMITING ---
    const clientIP = getClientIP(request);
    const identifier = isAuthenticated ? userId : clientIP;
    
    const rateLimitCheck = checkRateLimit(identifier, isAuthenticated);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json({
        success: false,
        error: rateLimitCheck.message
      }, { status: 429 });
    }
    
    console.log(`${isAuthenticated ? '✅' : '📝'} ${isAuthenticated ? 'Authenticated user' : 'Guest'} ${identifier} - ${rateLimitCheck.remaining} audits remaining`);
    
    // Step 1: Parse form data
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      console.log('❌ No file uploaded');
      return NextResponse.json({ 
        success: false, 
        error: 'No file uploaded' 
      }, { status: 400 });
    }

    console.log(`📁 File received: ${file.name}, Size: ${file.size}, Type: ${file.type}`);

    // Step 2: File validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.log('❌ File too large:', file.size);
      return NextResponse.json({ 
        success: false, 
        error: 'File size must be less than 5MB' 
      }, { status: 400 });
    }

    // Only allow DOCX files
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Invalid file type:', file.type);
      return NextResponse.json({ 
        success: false, 
        error: 'Please upload a DOCX file only. PDF and DOC files are not supported.' 
      }, { status: 400 });
    }

    console.log('✅ File validation passed');

    // Step 3: Text extraction
    let extractedText = '';
    
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.log('📝 Processing DOCX file...');
      try {
        const arrayBuffer = await file.arrayBuffer();
        
        // Use mammoth for DOCX parsing
        const mammoth = await import('mammoth');
        
        console.log('🔄 Extracting text from DOCX...');
        const result = await mammoth.extractRawText({ buffer: Buffer.from(arrayBuffer) });
        
        extractedText = result.value.trim();
        console.log(`✅ DOCX text extraction complete. Length: ${extractedText.length} characters`);
        
        if (result.messages.length > 0) {
          console.log('⚠️ DOCX parsing warnings:', result.messages);
        }
        
      } catch (docxError) {
        console.error('❌ DOCX parsing error:', docxError);
        extractedText = 'DOCX file detected but text extraction failed: ' + docxError.message;
      }
    }

    console.log(`📊 Extracted text length: ${extractedText.length}`);
    console.log(`📖 Text preview: ${extractedText.substring(0, 200)}...`);

    // Step 4: OpenAI Analysis
    // CV-ness check before OpenAI
    const cvKeywords = [
      'experience', 'education', 'skills', 'summary', 'profile', 'responsibilities', 'achievements', 'certifications', 'projects', 'employment', 'work history', 'professional', 'contact', 'objective', 'references', 'languages', 'interests', 'resume', 'cv'
    ];
    const isLikelyCV = extractedText.length > 400 && cvKeywords.some(k => extractedText.toLowerCase().includes(k));
    if (!isLikelyCV) {
      // Not a CV/resume
      return NextResponse.json({
        success: true,
        message: 'This document does not appear to be a CV/resume.',
        data: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          extractedTextLength: extractedText.length,
          textPreview: extractedText.substring(0, 300) + '...',
          processedAt: new Date().toISOString(),
          score: 0,
          overallAssessment: 'This document does not appear to be a CV/resume.',
          strengths: [],
          weaknesses: [],
          improvements: [],
          atsCompatibility: ['This document is not a CV/resume and cannot be evaluated for ATS compatibility.'],
          fullAnalysis: '',
          step: 'not-a-cv'
        }
      });
    }

    // Step 4: OpenAI Analysis
    console.log('🤖 Starting OpenAI analysis...');
    let aiAnalysis = null;
    let structuredData = null;
    
    try {
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
      }

      // Import OpenAI dynamically
      const OpenAI = await import('openai');
      const openai = new OpenAI.default({
        apiKey: process.env.OPENAI_API_KEY,
      });

      console.log('🔄 Sending to OpenAI for analysis...');
      
      const prompt = `Please analyze this CV/resume and provide a comprehensive assessment in exactly 4 categories plus an overall score. Please structure your response as follows:

**SCORE: [X]/100**
[Provide a strict score from 0-100 based on overall CV quality, content, and presentation. Be critical and realistic - most CVs should score between 30-85. Only exceptional CVs should score 90+. Poor CVs should score below 40. Consider: formatting (20%), content quality (30%), relevance (25%), and professionalism (25%)]

**STRENGTHS**
• [List 5-8 key strengths with bullet points]
• [Each strength should be specific and actionable]
• [Focus on what the candidate does well]
• [Be diverse and specific to this particular CV]

**WEAKNESSES** 
• [List 5-8 areas for improvement with bullet points]
• [Be constructive and specific]
• [Focus on actionable feedback]
• [Identify unique issues specific to this CV]

**RECOMMENDATIONS**
• [List 8-12 specific recommendations with bullet points]
• [Provide concrete steps to improve]
• [Be practical and actionable]
• [Give unique suggestions tailored to this CV]
• [Include formatting, content, and presentation improvements]
• [Cover different aspects: structure, language, achievements, skills, etc.]

**ATS COMPATIBILITY**
• [List 3-6 bullet points on how well this resume would perform in Applicant Tracking Systems (ATS)]
• [Mention any issues with formatting, keywords, or structure that could affect ATS parsing]
• [Give specific suggestions for improving ATS compatibility]

CV Content:
${extractedText}

Please ensure your response follows this exact format with the score first, followed by the 4 categories. Use bullet points (•) for each item. Be professional, constructive, and specific. Provide unique insights that are tailored to this specific CV rather than generic advice. Be strict and realistic with scoring - don't inflate scores.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a strict and professional CV/resume analyst. Provide a realistic score (0-100) first, then exactly 4 categories: STRENGTHS, WEAKNESSES, RECOMMENDATIONS, and ATS COMPATIBILITY. Use bullet points (•) for each item. Be specific, constructive, and actionable. Provide unique, tailored feedback for each CV rather than generic responses. Vary your analysis based on the specific content and context of each resume. Be critical and realistic with scoring - most CVs should score between 30-85. Only exceptional CVs should score 90+. Poor CVs should score below 40. Consider formatting (20%), content quality (30%), relevance (25%), and professionalism (25%) in your scoring."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2500,
        temperature: 0.8,
      });

      aiAnalysis = completion.choices[0].message.content;
      console.log(`✅ OpenAI analysis complete. Length: ${aiAnalysis.length} characters`);
      
      // Step 5: Parse AI response into structured data
      console.log('🔄 Parsing AI response into structured format...');
      structuredData = parseAIResponse(aiAnalysis);
      console.log('✅ Structured data parsing complete');
      
    } catch (aiError) {
      console.error('❌ OpenAI analysis error:', aiError);
      aiAnalysis = 'AI analysis failed: ' + aiError.message;
      structuredData = createFallbackData();
    }

    // Step 6: Calculate final score
    const score = structuredData?.score || calculateScore(structuredData);

    // Step 7: Prepare final response
    const responseData = {
      success: true,
      message: 'CV analysis completed successfully',
      data: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        extractedTextLength: extractedText.length,
        textPreview: extractedText.substring(0, 300) + '...',
        processedAt: new Date().toISOString(),
        score: score,
        overallAssessment: structuredData?.overallAssessment || 'Analysis not available',
        strengths: structuredData?.strengths || [],
        weaknesses: structuredData?.weaknesses || [],
        improvements: structuredData?.recommendations || [],
        atsCompatibility: structuredData?.atsCompatibility || [],
        skillsAnalysis: structuredData?.skillsAnalysis || '',
        experienceSummary: structuredData?.experienceSummary || '',
        fullAnalysis: aiAnalysis,
        step: 'analysis-complete'
      }
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('❌ CV API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Processing failed'
    }, { status: 500 });
  }
}

// Helper function to parse AI response into structured data
function parseAIResponse(aiResponse) {
  try {
    const sections = {
      overallAssessment: '',
      strengths: [],
      weaknesses: [],
      skillsAnalysis: '',
      experienceSummary: '',
      recommendations: [],
      atsCompatibility: []
    };

    let extractedScore = 50; // Default score

    // Split the response into lines and clean up
    const lines = aiResponse.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    let currentSection = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Extract score first
      if (line.toUpperCase().includes('SCORE:') || line.toUpperCase().includes('SCORE')) {
        const scoreMatch = line.match(/(\d+)\/100/);
        if (scoreMatch) {
          extractedScore = parseInt(scoreMatch[1]);
          console.log(`📊 Extracted score: ${extractedScore}/100`);
        }
        continue;
      }
      
      // Detect section headers (case insensitive)
      if (line.toUpperCase().includes('STRENGTHS')) {
        currentSection = 'strengths';
        continue;
      } else if (line.toUpperCase().includes('WEAKNESSES') || line.toUpperCase().includes('AREAS FOR IMPROVEMENT')) {
        currentSection = 'weaknesses';
        continue;
      } else if (line.toUpperCase().includes('RECOMMENDATIONS')) {
        currentSection = 'recommendations';
        continue;
      } else if (line.toUpperCase().includes('ATS COMPATIBILITY')) {
        currentSection = 'atsCompatibility';
        continue;
      }

      // Process content based on current section
      if (currentSection === 'strengths') {
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)) {
          const strength = line.replace(/^[•\-*\d\.\s]+/, '').trim();
          if (strength && strength.length > 5) {
            sections.strengths.push(strength);
          }
        }
      } else if (currentSection === 'weaknesses') {
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)) {
          const weakness = line.replace(/^[•\-*\d\.\s]+/, '').trim();
          if (weakness && weakness.length > 5) {
            sections.weaknesses.push(weakness);
          }
        }
      } else if (currentSection === 'recommendations') {
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)) {
          const recommendation = line.replace(/^[•\-*\d\.\s]+/, '').trim();
          if (recommendation && recommendation.length > 5) {
            sections.recommendations.push(recommendation);
          }
        }
      } else if (currentSection === 'atsCompatibility') {
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)) {
          const ats = line.replace(/^[•\-*\d\.\s]+/, '').trim();
          if (ats && ats.length > 5) {
            sections.atsCompatibility.push(ats);
          }
        }
      }
    }

    // Create overall assessment from the analysis
    const totalItems = sections.strengths.length + sections.weaknesses.length + sections.recommendations.length;
    if (totalItems > 0) {
      sections.overallAssessment = `Analysis completed with ${sections.strengths.length} strengths, ${sections.weaknesses.length} areas for improvement, and ${sections.recommendations.length} recommendations identified. Overall score: ${extractedScore}/100.`;
    } else {
      sections.overallAssessment = `Analysis completed successfully. Overall score: ${extractedScore}/100.`;
    }

    // Clean up and ensure minimum items
    if (sections.strengths.length === 0) {
      sections.strengths = ['Strong educational background', 'Relevant technical skills'];
    }
    if (sections.weaknesses.length === 0) {
      sections.weaknesses = ['Could benefit from more specific achievements', 'Formatting could be improved'];
    }
    if (sections.recommendations.length === 0) {
      sections.recommendations = ['Add quantifiable achievements', 'Improve summary section'];
    }
    if (sections.atsCompatibility.length === 0) {
      sections.atsCompatibility = ['Resume format appears to be ATS-friendly', 'Consider adding more industry-specific keywords'];
    }

    // Limit to reasonable number of items per category
    sections.strengths = sections.strengths.slice(0, 8);
    sections.weaknesses = sections.weaknesses.slice(0, 8);
    sections.recommendations = sections.recommendations.slice(0, 12);
    sections.atsCompatibility = sections.atsCompatibility.slice(0, 6);

    // Add the extracted score to the sections
    sections.score = extractedScore;

    return sections;
  } catch (error) {
    console.error('❌ Error parsing AI response:', error);
    return createFallbackData();
  }
}

// Helper function to create fallback data
function createFallbackData() {
  return {
    overallAssessment: 'Analysis completed with 3 strengths, 3 areas for improvement, and 5 recommendations identified.',
    strengths: ['File was successfully uploaded and processed', 'Document format is supported', 'Text extraction completed successfully'],
    weaknesses: ['AI analysis encountered an error', 'Could not complete full analysis', 'Limited insights available'],
    skillsAnalysis: '',
    experienceSummary: '',
    recommendations: [
      'Please try uploading the file again',
      'Ensure the file is not corrupted',
      'Add quantifiable achievements to your experience',
      'Improve the summary section with key highlights',
      'Consider adding a skills section with proficiency levels'
    ],
    atsCompatibility: [
      'Resume format appears to be ATS-friendly',
      'Consider adding more industry-specific keywords'
    ]
  };
}

// Helper function to calculate overall score
function calculateScore(structuredData) {
  if (!structuredData) return 45; // Default to middle-low score
  
  let score = 40; // Start with a lower base score
  
  // Add points based on content quality
  if (structuredData.strengths && structuredData.strengths.length > 0) {
    score += Math.min(structuredData.strengths.length * 2, 10);
  }
  
  if (structuredData.recommendations && structuredData.recommendations.length > 0) {
    score += Math.min(structuredData.recommendations.length, 8);
  }
  
  // Deduct points for weaknesses
  if (structuredData.weaknesses && structuredData.weaknesses.length > 0) {
    score -= Math.min(structuredData.weaknesses.length * 1.5, 15);
  }
  
  // Ensure score is within bounds
  return Math.max(0, Math.min(100, Math.round(score)));
} 
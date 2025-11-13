import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, XCircle, Eye, FileText, Zap, Loader2 } from 'lucide-react';

const ATSChecker = ({ resumeData, className = "" }) => {
  const [atsScore, setAtsScore] = useState(0);
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(false);

  const runATSAnalysis = () => {
    setLoading(true);
    
    setTimeout(() => {
      const analysisResults = performATSChecks(resumeData);
      setChecks(analysisResults.checks);
      setAtsScore(analysisResults.score);
      setLoading(false);
    }, 2000);
  };

  const performATSChecks = (data) => {
    const checks = [];
    let score = 0;
    const maxScore = 100;

    // 1. Contact Information (15 points)
    const contactComplete = Object.values(data.personalInfo).filter(v => v?.trim()).length;
    if (contactComplete >= 3) {
      score += 15;
      checks.push({
        category: 'Contact Info',
        status: 'pass',
        message: 'Complete contact information provided',
        impact: 'high'
      });
    } else {
      checks.push({
        category: 'Contact Info',
        status: 'fail',
        message: `Missing ${4 - contactComplete} contact field(s)`,
        impact: 'high',
        suggestion: 'Add missing contact information (name, email, phone, location)'
      });
    }

    // 2. Professional Email (10 points)
    const email = data.personalInfo.email;
    if (email && !email.includes('gmail') && !email.includes('yahoo') && !email.includes('hotmail')) {
      score += 10;
      checks.push({
        category: 'Email',
        status: 'pass',
        message: 'Professional email address detected',
        impact: 'medium'
      });
    } else if (email) {
      score += 5;
      checks.push({
        category: 'Email',
        status: 'warning',
        message: 'Consider using a professional email domain',
        impact: 'medium',
        suggestion: 'Use firstname.lastname@professionaldomain.com format'
      });
    } else {
      checks.push({
        category: 'Email',
        status: 'fail',
        message: 'No email address provided',
        impact: 'high',
        suggestion: 'Add a professional email address'
      });
    }

    // 3. Work Experience Analysis (25 points)
    if (data.experience.length > 0) {
      score += 10;
      checks.push({
        category: 'Experience',
        status: 'pass',
        message: `${data.experience.length} work experience entries found`,
        impact: 'high'
      });

      // Check for quantifiable achievements
      const hasMetrics = data.experience.some(exp => 
        exp.description && /\d+%|\d+\+|\$\d+|increased|improved|reduced|saved/i.test(exp.description)
      );
      
      if (hasMetrics) {
        score += 10;
        checks.push({
          category: 'Achievements',
          status: 'pass',
          message: 'Quantifiable achievements detected',
          impact: 'high'
        });
      } else {
        checks.push({
          category: 'Achievements',
          status: 'warning',
          message: 'No quantifiable achievements found',
          impact: 'high',
          suggestion: 'Add numbers, percentages, and metrics to show impact'
        });
      }

      // Check for action verbs
      const actionVerbs = ['developed', 'implemented', 'managed', 'created', 'improved', 'optimized', 'designed', 'built', 'led', 'achieved'];
      const hasActionVerbs = data.experience.some(exp =>
        actionVerbs.some(verb => exp.description?.toLowerCase().includes(verb))
      );

      if (hasActionVerbs) {
        score += 5;
        checks.push({
          category: 'Action Verbs',
          status: 'pass',
          message: 'Strong action verbs used',
          impact: 'medium'
        });
      } else {
        checks.push({
          category: 'Action Verbs',
          status: 'warning',
          message: 'Use more action verbs to start bullet points',
          impact: 'medium',
          suggestion: 'Start descriptions with: Developed, Implemented, Managed, etc.'
        });
      }
    } else {
      checks.push({
        category: 'Experience',
        status: 'fail',
        message: 'No work experience provided',
        impact: 'critical',
        suggestion: 'Add at least one work experience entry'
      });
    }

    // 4. Education Section (10 points)
    if (data.education.length > 0) {
      score += 10;
      checks.push({
        category: 'Education',
        status: 'pass',
        message: 'Education information provided',
        impact: 'medium'
      });
    } else {
      checks.push({
        category: 'Education',
        status: 'warning',
        message: 'No education information provided',
        impact: 'medium',
        suggestion: 'Add your educational background'
      });
    }

    // 5. Skills Section (15 points)
    const totalSkills = Object.values(data.skills).flat().filter(skill => skill?.trim()).length;
    if (totalSkills >= 8) {
      score += 15;
      checks.push({
        category: 'Skills',
        status: 'pass',
        message: `${totalSkills} skills listed across categories`,
        impact: 'high'
      });
    } else if (totalSkills >= 4) {
      score += 10;
      checks.push({
        category: 'Skills',
        status: 'warning',
        message: `${totalSkills} skills listed - consider adding more`,
        impact: 'medium',
        suggestion: 'Add 8-12 relevant skills for better ATS matching'
      });
    } else {
      checks.push({
        category: 'Skills',
        status: 'fail',
        message: 'Insufficient skills listed',
        impact: 'high',
        suggestion: 'Add technical and soft skills relevant to your field'
      });
    }

    // 6. Formatting Checks (15 points)
    let formatScore = 0;

    // Check for bullet points
    const hasBulletPoints = data.experience.some(exp => 
      exp.description && (exp.description.includes('•') || exp.description.includes('-'))
    );
    
    if (hasBulletPoints) {
      formatScore += 5;
      checks.push({
        category: 'Formatting',
        status: 'pass',
        message: 'Proper bullet point formatting used',
        impact: 'medium'
      });
    } else {
      checks.push({
        category: 'Formatting',
        status: 'warning',
        message: 'Use bullet points for better readability',
        impact: 'medium',
        suggestion: 'Format job descriptions with bullet points'
      });
    }

    // Check for consistent date formatting
    const hasConsistentDates = data.experience.every(exp => 
      !exp.duration || /\d{4}/.test(exp.duration)
    );
    
    if (hasConsistentDates) {
      formatScore += 5;
      checks.push({
        category: 'Date Format',
        status: 'pass',
        message: 'Consistent date formatting',
        impact: 'low'
      });
    } else {
      checks.push({
        category: 'Date Format',
        status: 'warning',
        message: 'Inconsistent date formatting detected',
        impact: 'low',
        suggestion: 'Use consistent format: "Jan 2020 - Present"'
      });
    }

    // Length check
    const totalLength = JSON.stringify(data).length;
    if (totalLength > 1000 && totalLength < 8000) {
      formatScore += 5;
      checks.push({
        category: 'Length',
        status: 'pass',
        message: 'Appropriate resume length',
        impact: 'medium'
      });
    } else if (totalLength <= 1000) {
      checks.push({
        category: 'Length',
        status: 'warning',
        message: 'Resume may be too short',
        impact: 'medium',
        suggestion: 'Add more detailed descriptions and achievements'
      });
    } else {
      checks.push({
        category: 'Length',
        status: 'warning',
        message: 'Resume may be too long',
        impact: 'medium',
        suggestion: 'Consider condensing content to 1-2 pages'
      });
    }

    score += formatScore;

    // 7. Keyword Density (10 points)
    const resumeText = JSON.stringify(data).toLowerCase();
    const commonKeywords = ['javascript', 'react', 'node', 'python', 'aws', 'docker', 'git', 'agile', 'scrum', 'api'];
    const foundKeywords = commonKeywords.filter(keyword => resumeText.includes(keyword));
    
    if (foundKeywords.length >= 5) {
      score += 10;
      checks.push({
        category: 'Keywords',
        status: 'pass',
        message: `${foundKeywords.length} relevant keywords found`,
        impact: 'high'
      });
    } else {
      checks.push({
        category: 'Keywords',
        status: 'warning',
        message: `Only ${foundKeywords.length} relevant keywords found`,
        impact: 'high',
        suggestion: 'Include more industry-specific keywords and technologies'
      });
    }

    return {
      score: Math.min(score, maxScore),
      checks: checks.sort((a, b) => {
        const impactOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return impactOrder[a.impact] - impactOrder[b.impact];
      })
    };
  };

  useEffect(() => {
    if (Object.keys(resumeData).length > 0) {
      runATSAnalysis();
    }
  }, [resumeData]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getImpactBadge = (impact) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[impact]}`}>
        {impact.toUpperCase()}
      </span>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}
    >
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">ATS Compatibility</h3>
              <p className="text-sm text-gray-600">Applicant Tracking System Analysis</p>
            </div>
          </div>
          <motion.button
            onClick={runATSAnalysis}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            <span>{loading ? 'Analyzing...' : 'Re-scan'}</span>
          </motion.button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Analyzing ATS compatibility...</p>
          </div>
        ) : (
          <>
            {/* ATS Score */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#ats-gradient)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: atsScore / 100 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    style={{
                      strokeDasharray: `${2 * Math.PI * 40}`,
                      strokeDashoffset: `${2 * Math.PI * 40 * (1 - atsScore / 100)}`
                    }}
                  />
                  <defs>
                    <linearGradient id="ats-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(atsScore)}`}>
                      {atsScore}%
                    </div>
                    <div className="text-xs text-gray-500 font-medium">ATS SCORE</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${getScoreBgColor(atsScore)} text-white text-sm font-medium`}>
                  <Shield className="h-4 w-4" />
                  <span>
                    {atsScore >= 80 ? 'ATS Optimized' : atsScore >= 60 ? 'Needs Improvement' : 'Poor ATS Compatibility'}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Checks */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-4">Detailed Analysis</h4>
              
              {checks.map((check, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {getStatusIcon(check.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-gray-900">{check.category}</h5>
                      {getImpactBadge(check.impact)}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{check.message}</p>
                    {check.suggestion && (
                      <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                        💡 {check.suggestion}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ATS Tips */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">ATS Optimization Tips</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Use standard section headings (Experience, Education, Skills)</li>
                <li>• Include relevant keywords from job descriptions</li>
                <li>• Use simple, clean formatting without complex layouts</li>
                <li>• Quantify achievements with numbers and percentages</li>
                <li>• Save and submit as PDF or DOCX format</li>
                <li>• Avoid images, graphics, and unusual fonts</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ATSChecker;

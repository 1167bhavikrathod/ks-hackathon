import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, AlertCircle, XCircle, TrendingUp, Award, Zap, Eye } from 'lucide-react';

const EnhancedScoreCard = ({ resumeData, className = "" }) => {
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDetails, setShowDetails] = useState(false);

  const calculateDetailedScore = () => {
    let totalScore = 0;
    let detailedFeedback = [];
    let categories = {
      personal: { score: 0, weight: 15, items: [] },
      experience: { score: 0, weight: 40, items: [] },
      content: { score: 0, weight: 25, items: [] },
      formatting: { score: 0, weight: 20, items: [] }
    };

    // Personal Information Analysis (15%)
    const personalFields = Object.values(resumeData.personalInfo).filter(field => field?.trim());
    const personalCompleteness = (personalFields.length / 4) * 100;
    categories.personal.score = personalCompleteness;
    
    if (personalCompleteness === 100) {
      categories.personal.items.push({ type: 'success', message: 'All contact information complete', points: 15 });
    } else {
      categories.personal.items.push({ 
        type: 'warning', 
        message: `Complete ${4 - personalFields.length} missing contact field(s)`, 
        points: Math.round(personalCompleteness * 0.15) 
      });
    }

    // Experience Analysis (40%)
    let experienceScore = 0;
    if (resumeData.experience.length === 0) {
      categories.experience.items.push({ type: 'error', message: 'Add at least one work experience', points: 0 });
    } else {
      // Base points for having experience
      experienceScore += 50;
      categories.experience.items.push({ type: 'success', message: 'Work experience section exists', points: 20 });

      // Completeness check
      const completeExperiences = resumeData.experience.filter(exp => 
        exp.company?.trim() && exp.position?.trim() && exp.duration?.trim() && exp.description?.trim()
      );
      
      const completenessRatio = completeExperiences.length / resumeData.experience.length;
      experienceScore += completenessRatio * 30;
      
      if (completenessRatio === 1) {
        categories.experience.items.push({ type: 'success', message: 'All experience entries complete', points: 12 });
      } else {
        categories.experience.items.push({ 
          type: 'warning', 
          message: `${resumeData.experience.length - completeExperiences.length} incomplete experience entries`, 
          points: Math.round(completenessRatio * 12) 
        });
      }

      // Content quality checks
      const hasQuantifiableResults = resumeData.experience.some(exp => 
        exp.description && /\d+%|\d+\+|\$\d+|increased|improved|reduced|saved/i.test(exp.description)
      );
      
      if (hasQuantifiableResults) {
        experienceScore += 20;
        categories.experience.items.push({ type: 'success', message: 'Includes quantifiable achievements', points: 8 });
      } else {
        categories.experience.items.push({ type: 'warning', message: 'Add numbers and metrics to achievements', points: 0 });
      }
    }
    
    categories.experience.score = Math.min(experienceScore, 100);

    // Content Quality Analysis (25%)
    let contentScore = 0;
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    
    // Action words check
    const actionWords = ['developed', 'implemented', 'managed', 'created', 'improved', 'optimized', 'designed', 'built', 'led', 'achieved', 'delivered', 'collaborated'];
    const foundActionWords = actionWords.filter(word => resumeText.includes(word));
    const actionWordScore = (foundActionWords.length / actionWords.length) * 100;
    contentScore += actionWordScore * 0.4;
    
    if (foundActionWords.length >= 5) {
      categories.content.items.push({ type: 'success', message: `Strong action words (${foundActionWords.length} found)`, points: 10 });
    } else {
      categories.content.items.push({ type: 'warning', message: 'Use more action words (developed, managed, etc.)', points: Math.round(actionWordScore * 0.1) });
    }

    // Length and detail check
    const totalLength = JSON.stringify(resumeData).length;
    if (totalLength > 800) {
      contentScore += 60;
      categories.content.items.push({ type: 'success', message: 'Sufficient detail and content', points: 15 });
    } else {
      categories.content.items.push({ type: 'warning', message: 'Add more detailed content', points: Math.round((totalLength / 800) * 15) });
    }

    categories.content.score = Math.min(contentScore, 100);

    // Formatting and Structure (20%)
    let formattingScore = 0;
    
    // Bullet point usage
    const hasBulletPoints = resumeData.experience.some(exp => 
      exp.description && (exp.description.includes('•') || exp.description.includes('-') || exp.description.includes('*'))
    );
    
    if (hasBulletPoints) {
      formattingScore += 50;
      categories.formatting.items.push({ type: 'success', message: 'Good use of bullet points', points: 10 });
    } else {
      categories.formatting.items.push({ type: 'warning', message: 'Use bullet points for better readability', points: 0 });
    }

    // Consistent formatting
    const hasConsistentDuration = resumeData.experience.every(exp => 
      !exp.duration || /\d{4}/.test(exp.duration)
    );
    
    if (hasConsistentDuration) {
      formattingScore += 50;
      categories.formatting.items.push({ type: 'success', message: 'Consistent date formatting', points: 10 });
    } else {
      categories.formatting.items.push({ type: 'warning', message: 'Use consistent date format (e.g., Jan 2020)', points: 5 });
    }

    categories.formatting.score = Math.min(formattingScore, 100);

    // Calculate weighted total
    totalScore = Object.values(categories).reduce((sum, category) => 
      sum + (category.score * category.weight / 100), 0
    );

    // Compile all feedback
    detailedFeedback = Object.values(categories).flatMap(category => category.items);

    return { 
      score: Math.round(totalScore), 
      feedback: detailedFeedback, 
      categories,
      insights: generateInsights(totalScore, categories)
    };
  };

  const generateInsights = (score, categories) => {
    const insights = [];
    
    if (score >= 90) {
      insights.push({ type: 'success', message: 'Excellent! Your resume is ready to impress recruiters.' });
    } else if (score >= 75) {
      insights.push({ type: 'success', message: 'Great job! A few tweaks will make it perfect.' });
    } else if (score >= 60) {
      insights.push({ type: 'warning', message: 'Good progress! Focus on the highlighted areas.' });
    } else {
      insights.push({ type: 'error', message: 'Needs improvement. Follow the suggestions below.' });
    }

    // Category-specific insights
    const weakestCategory = Object.entries(categories).reduce((min, [key, cat]) => 
      cat.score < categories[min].score ? key : min, 'personal'
    );

    const categoryNames = {
      personal: 'personal information',
      experience: 'work experience',
      content: 'content quality',
      formatting: 'formatting'
    };

    if (categories[weakestCategory].score < 70) {
      insights.push({ 
        type: 'warning', 
        message: `Focus on improving your ${categoryNames[weakestCategory]} section.` 
      });
    }

    return insights;
  };

  useEffect(() => {
    const result = calculateDetailedScore();
    setScore(result.score);
    setFeedback(result.feedback);
    
    // Animate score counter
    let start = 0;
    const end = result.score;
    const duration = 1500;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [resumeData]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreTextColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'details', label: 'Details', icon: Eye },
    { id: 'insights', label: 'Insights', icon: TrendingUp }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}
    >
      {/* Header with Tabs */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Resume Score</h3>
              <p className="text-sm text-gray-600">AI-powered analysis</p>
            </div>
          </div>
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Award className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Professional</span>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/50 p-1 rounded-lg">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Score Display */}
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
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: animatedScore / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{
                        strokeDasharray: `${2 * Math.PI * 40}`,
                        strokeDashoffset: `${2 * Math.PI * 40 * (1 - animatedScore / 100)}`
                      }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreTextColor(score)}`}>
                        {animatedScore}%
                      </div>
                      <div className="text-xs text-gray-500 font-medium">SCORE</div>
                    </div>
                  </div>
                </div>
                
                <motion.div 
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${getScoreColor(score)} text-white text-sm font-medium`}>
                    <Zap className="h-4 w-4" />
                    <span>
                      {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {resumeData.experience.length}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">Experiences</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Object.values(resumeData.personalInfo).filter(v => v?.trim()).length}/4
                  </div>
                  <div className="text-sm text-purple-600 font-medium">Contact Info</div>
                </div>
              </div>

              {/* Top Feedback */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 mb-3">Priority Actions</h4>
                {feedback.slice(0, 3).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    {getIcon(item.type)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{item.message}</p>
                      {item.points && (
                        <p className="text-xs text-gray-500 mt-1">+{item.points} points</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h4 className="font-semibold text-gray-900 mb-4">Detailed Feedback</h4>
              {feedback.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {getIcon(item.type)}
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{item.message}</p>
                    {item.points && (
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          +{item.points} points
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-semibold text-gray-900 mb-4">AI Insights</h4>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <h5 className="font-medium text-gray-900 mb-2">Resume Strength</h5>
                  <p className="text-sm text-gray-600">
                    {score >= 80 
                      ? "Your resume demonstrates strong professional presentation with comprehensive content and good structure."
                      : score >= 60
                      ? "Your resume shows good potential with room for strategic improvements in key areas."
                      : "Your resume needs significant enhancement to meet professional standards and ATS requirements."
                    }
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-xl">
                  <h5 className="font-medium text-gray-900 mb-2">Next Steps</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Focus on quantifiable achievements with numbers and percentages</li>
                    <li>• Use strong action verbs to start each bullet point</li>
                    <li>• Ensure consistent formatting throughout all sections</li>
                    <li>• Tailor content to match job requirements</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EnhancedScoreCard;

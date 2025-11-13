import React from 'react';
import { Target, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const ScoreCard = ({ resumeData }) => {
  
  const calculateScore = () => {
    let score = 0;
    let feedback = [];

    // Personal info completeness (20 points)
    const personalFields = Object.values(resumeData.personalInfo).filter(field => field.trim());
    score += (personalFields.length / 4) * 20;
    
    if (personalFields.length < 4) {
      feedback.push({
        type: 'warning',
        message: 'Complete all personal information fields'
      });
    } else {
      feedback.push({
        type: 'success',
        message: 'Personal information is complete'
      });
    }

    // Experience section (40 points)
    if (resumeData.experience.length === 0) {
      feedback.push({
        type: 'error',
        message: 'Add at least one work experience entry'
      });
    } else {
      score += 20; // Base points for having experience
      
      const completeExperiences = resumeData.experience.filter(exp => 
        exp.company && exp.position && exp.duration && exp.description
      );
      
      score += (completeExperiences.length / resumeData.experience.length) * 20;
      
      if (completeExperiences.length === resumeData.experience.length) {
        feedback.push({
          type: 'success',
          message: 'All experience entries are complete'
        });
      } else {
        feedback.push({
          type: 'warning',
          message: 'Complete all fields in experience entries'
        });
      }

      // Check for bullet points in descriptions
      const hasGoodDescriptions = resumeData.experience.some(exp => 
        exp.description && (exp.description.includes('•') || exp.description.includes('-'))
      );
      
      if (hasGoodDescriptions) {
        score += 10;
        feedback.push({
          type: 'success',
          message: 'Good use of bullet points in descriptions'
        });
      } else {
        feedback.push({
          type: 'warning',
          message: 'Use bullet points to structure job descriptions'
        });
      }
    }

    // Length check (10 points)
    const totalText = JSON.stringify(resumeData).length;
    if (totalText > 500) {
      score += 10;
      feedback.push({
        type: 'success',
        message: 'Resume has sufficient content'
      });
    } else {
      feedback.push({
        type: 'warning',
        message: 'Add more detailed content to your resume'
      });
    }

    // Action words check (20 points)
    const actionWords = ['developed', 'implemented', 'managed', 'created', 'improved', 'optimized', 'designed', 'built', 'led', 'achieved'];
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    const foundActionWords = actionWords.filter(word => resumeText.includes(word));
    
    score += (foundActionWords.length / actionWords.length) * 20;
    
    if (foundActionWords.length >= 3) {
      feedback.push({
        type: 'success',
        message: 'Good use of action words'
      });
    } else {
      feedback.push({
        type: 'warning',
        message: 'Use more action words (developed, implemented, managed, etc.)'
      });
    }

    return { score: Math.round(score), feedback };
  };

  const { score, feedback } = calculateScore();

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-6">
      
      {/* Score Display */}
      <div className={`text-center p-6 rounded-lg mb-6 ${getScoreBgColor(score)}`}>
        <div className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}>
          {score}%
        </div>
        <p className="text-sm text-gray-600">Resume Completeness Score</p>
        
        {/* Score Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              score >= 80 ? 'bg-green-500' : 
              score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 mb-3">Improvement Tips</h4>
        
        {feedback.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-md bg-gray-50">
            {getIcon(item.type)}
            <p className="text-sm text-gray-700 flex-1">{item.message}</p>
          </div>
        ))}

        {score === 100 && (
          <div className="text-center p-4 bg-green-50 rounded-md">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-green-800 font-medium">Perfect Score! 🎉</p>
            <p className="text-sm text-green-600">Your resume is ready to impress!</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-blue-50 rounded-md">
          <div className="text-lg font-semibold text-blue-600">
            {resumeData.experience.length}
          </div>
          <div className="text-xs text-blue-600">Experience Entries</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-md">
          <div className="text-lg font-semibold text-purple-600">
            {JSON.stringify(resumeData).length}
          </div>
          <div className="text-xs text-purple-600">Total Characters</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;

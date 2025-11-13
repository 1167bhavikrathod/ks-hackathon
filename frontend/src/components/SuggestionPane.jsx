import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Plus, Loader2, Target, Lightbulb, Zap } from 'lucide-react';

const SuggestionPane = ({ selectedText, resumeData, setResumeData }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('rewrite');

  const API_BASE = 'http://localhost:4002/api/suggest';

  // Enhanced AI suggestions based on context
  const getContextualSuggestions = (text, type) => {
    const contextSuggestions = {
      rewrite: {
        default: [
          "Spearheaded development of scalable web applications serving 10,000+ users",
          "Architected and implemented robust backend systems with 99.9% uptime",
          "Led cross-functional team of 5 engineers to deliver critical features ahead of schedule",
          "Optimized application performance, resulting in 45% faster load times and improved user experience"
        ],
        technical: [
          "Engineered full-stack solutions using React, Node.js, and PostgreSQL",
          "Built RESTful APIs handling 1M+ requests daily with sub-200ms response times",
          "Implemented CI/CD pipelines reducing deployment time by 60%",
          "Developed microservices architecture supporting horizontal scaling"
        ],
        leadership: [
          "Mentored 3 junior developers, accelerating their onboarding by 40%",
          "Established code review processes improving code quality by 30%",
          "Coordinated with product and design teams to define technical requirements",
          "Led technical interviews and contributed to hiring 5 new team members"
        ]
      },
      enhance: {
        metrics: [
          "Add specific numbers: users served, performance improvements, team size",
          "Include percentage improvements: '40% faster', '25% reduction in bugs'",
          "Mention timeline achievements: 'delivered 2 weeks ahead of schedule'",
          "Quantify impact: 'increased user engagement by 35%'"
        ],
        action: [
          "Start with strong action verbs: 'Spearheaded', 'Architected', 'Pioneered'",
          "Use present tense for current roles, past tense for previous positions",
          "Be specific about your role vs. team contributions",
          "Focus on outcomes and business impact, not just tasks"
        ],
        technical: [
          "Specify exact technologies and versions used",
          "Mention relevant methodologies: Agile, Scrum, DevOps",
          "Include certifications and relevant training",
          "Highlight problem-solving and innovation"
        ]
      },
      keywords: {
        technical: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "Kubernetes", "MongoDB", "PostgreSQL", "Git"],
        soft: ["Leadership", "Communication", "Problem-solving", "Team collaboration", "Project management", "Mentoring"],
        industry: ["Agile", "Scrum", "DevOps", "CI/CD", "Microservices", "API Development", "Full-stack", "Frontend", "Backend"]
      }
    };

    if (type === 'keywords') {
      return [...contextSuggestions.keywords.technical, ...contextSuggestions.keywords.soft, ...contextSuggestions.keywords.industry];
    }

    if (type === 'enhance') {
      return [...contextSuggestions.enhance.metrics, ...contextSuggestions.enhance.action, ...contextSuggestions.enhance.technical];
    }

    // For rewrite, analyze text context
    if (text) {
      const lowerText = text.toLowerCase();
      if (lowerText.includes('lead') || lowerText.includes('manage') || lowerText.includes('mentor')) {
        return contextSuggestions.rewrite.leadership;
      }
      if (lowerText.includes('develop') || lowerText.includes('code') || lowerText.includes('api')) {
        return contextSuggestions.rewrite.technical;
      }
    }
    
    return contextSuggestions.rewrite.default;
  };

  const getSuggestions = async (type) => {
    setLoading(true);
    try {
      const endpoint = `${API_BASE}/${type}`;
      const body = type === 'keywords' 
        ? { jobDescription: selectedText || 'Software Developer' }
        : { text: selectedText || 'Developed web applications and maintained systems' };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to fetch suggestions');
      
      const data = await response.json();
      setSuggestions(data.suggestions || data.keywords || []);
      
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      // Use enhanced contextual suggestions as fallback
      const contextualSuggestions = getContextualSuggestions(selectedText, type);
      setSuggestions(contextualSuggestions);
    } finally {
      setLoading(false);
    }
  };

  const insertSuggestion = (suggestion) => {
    if (activeTab === 'keywords') {
      // Insert keywords into skills section
      const keywordArray = suggestion.split(', ');
      setResumeData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          technical: [...(prev.skills.technical || []), ...keywordArray.filter(k => 
            !prev.skills.technical?.includes(k) && 
            ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Git'].some(tech => k.includes(tech))
          )],
          soft: [...(prev.skills.soft || []), ...keywordArray.filter(k => 
            !prev.skills.soft?.includes(k) && 
            ['Leadership', 'Communication', 'Problem-solving'].some(soft => k.includes(soft))
          )]
        }
      }));
      return;
    }

    if (!resumeData.experience.length) {
      alert('Please add a work experience entry first!');
      return;
    }

    if (activeTab === 'rewrite' && selectedText) {
      // Replace selected text with suggestion
      const lastExpIndex = resumeData.experience.length - 1;
      setResumeData(prev => ({
        ...prev,
        experience: prev.experience.map((exp, index) => 
          index === lastExpIndex 
            ? { 
                ...exp, 
                description: exp.description.replace(selectedText, `• ${suggestion}`)
              }
            : exp
        )
      }));
    } else {
      // Insert as new bullet point
      const lastExpIndex = resumeData.experience.length - 1;
      setResumeData(prev => ({
        ...prev,
        experience: prev.experience.map((exp, index) => 
          index === lastExpIndex 
            ? { 
                ...exp, 
                description: exp.description 
                  ? `${exp.description}\n• ${suggestion}`
                  : `• ${suggestion}`
              }
            : exp
        )
      }));
    }
  };

  const tabs = [
    { id: 'rewrite', label: 'Rewrite', icon: RefreshCw, color: 'blue' },
    { id: 'enhance', label: 'Enhance', icon: Lightbulb, color: 'yellow' },
    { id: 'keywords', label: 'Keywords', icon: Target, color: 'green' }
  ];

  return (
    <div className="p-6">
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Text Display */}
      {selectedText && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Selected:</strong> "{selectedText}"
          </p>
        </div>
      )}

      {/* Get Suggestions Button */}
      <button
        onClick={() => getSuggestions(activeTab)}
        disabled={loading}
        className="w-full mb-4 flex items-center justify-center space-x-2 py-2.5 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Getting suggestions...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Get {tabs.find(t => t.id === activeTab)?.label} Suggestions</span>
          </>
        )}
      </button>

      {/* Suggestions List */}
      <div className="space-y-3">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 border border-gray-200 rounded-md hover:border-purple-300 transition-colors group"
            >
              <p className="text-sm text-gray-700 mb-2">{suggestion}</p>
              <button
                onClick={() => insertSuggestion(suggestion)}
                className="flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-800 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Plus className="h-3 w-3" />
                <span>Insert</span>
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No suggestions yet.</p>
            <p className="text-xs">Select text and click "Get Suggestions"</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-3 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-600">
          <strong>Tip:</strong> Select text in your resume, then click "Get Suggestions" to improve it with AI.
        </p>
      </div>
    </div>
  );
};

export default SuggestionPane;

import React, { useState } from 'react';
import SimpleLandingPage from './components/SimpleLandingPage';
import TemplateSelection from './components/TemplateSelection';
import EnhancedResumeEditor from './components/EnhancedResumeEditor';
import SuggestionPane from './components/SuggestionPane';
import EnhancedScoreCard from './components/EnhancedScoreCard';
import ExportButton from './components/ExportButton';
import ImportResume from './components/ImportResume';
import ATSChecker from './components/ATSChecker';
import TemplateRenderer from './components/TemplateRenderer';
import { FileText, Sparkles, Target, Download, ArrowLeft, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'templates', 'builder'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: ''
    },
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
      tools: []
    }
  });

  const [selectedText, setSelectedText] = useState('');

  const handleGetStarted = () => {
    setCurrentPage('templates');
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setCurrentPage('builder');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  const handleBackToTemplates = () => {
    setCurrentPage('templates');
  };

  const handleImportResume = (importedData) => {
    setResumeData(importedData);
  };

  return (
    <AnimatePresence mode="wait">
      {currentPage === 'landing' && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SimpleLandingPage onGetStarted={handleGetStarted} />
        </motion.div>
      )}

      {currentPage === 'templates' && (
        <motion.div
          key="templates"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <TemplateSelection 
            onSelectTemplate={handleSelectTemplate}
            onBack={handleBackToLanding}
          />
        </motion.div>
      )}

      {currentPage === 'builder' && (
        <motion.div
          key="app"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
        >
          {/* Enhanced Header */}
          <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.button
                    onClick={handleBackToTemplates}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Templates</span>
                  </motion.button>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                      <Layout className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Resume Builder</h1>
                      <p className="text-sm text-gray-600">
                        {selectedTemplate ? `Using ${selectedTemplate.name} template` : 'Create your professional resume'}
                      </p>
                    </div>
                  </div>
                </div>
                <ExportButton resumeData={resumeData} selectedTemplate={selectedTemplate} />
              </div>
            </div>
          </header>

          {/* Clean Layout - No Status Cards */}
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column - Resume Editor */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Resume Builder</h2>
                          <p className="text-gray-600">Create your professional resume</p>
                        </div>
                      </div>
                      {selectedTemplate && (
                        <div className="text-right bg-white px-4 py-2 rounded-lg shadow-sm">
                          <p className="text-sm font-bold text-gray-900">{selectedTemplate.name}</p>
                          <p className="text-xs text-gray-500">{selectedTemplate.category}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="max-h-[600px] overflow-y-auto">
                    <EnhancedResumeEditor 
                      resumeData={resumeData} 
                      setResumeData={setResumeData}
                      setSelectedText={setSelectedText}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Tools & Preview */}
              <div className="space-y-6">
                
                {/* Template Preview */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-green-600 rounded-lg shadow-lg">
                        <Layout className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Live Preview</h3>
                        <p className="text-xs text-gray-600">Real-time template</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50">
                    <div className="transform scale-[0.35] origin-top-left w-[285%] h-[400px] overflow-hidden bg-white rounded shadow-lg">
                      <TemplateRenderer 
                        template={selectedTemplate}
                        resumeData={resumeData}
                        className="pointer-events-none"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Import Resume */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <ImportResume onImport={handleImportResume} />
                </motion.div>

              </div>
            </div>

            {/* Bottom Row - Analysis Tools Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              
              {/* AI Suggestions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-purple-600 rounded-lg shadow-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">AI Suggestions</h3>
                      <p className="text-xs text-gray-600">Smart content enhancement</p>
                    </div>
                  </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  <SuggestionPane 
                    selectedText={selectedText}
                    resumeData={resumeData}
                    setResumeData={setResumeData}
                  />
                </div>
              </motion.div>

              {/* Score Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Resume Score</h3>
                      <p className="text-xs text-gray-600">Quality analysis</p>
                    </div>
                  </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  <EnhancedScoreCard resumeData={resumeData} />
                </div>
              </motion.div>

              {/* ATS Checker */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-green-600 rounded-lg shadow-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">ATS Checker</h3>
                      <p className="text-xs text-gray-600">Compatibility analysis</p>
                    </div>
                  </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  <ATSChecker resumeData={resumeData} />
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;

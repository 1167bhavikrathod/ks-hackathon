import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Star, Briefcase, GraduationCap, Award, Zap, Eye, Download, FileText } from 'lucide-react';

const TemplateSelection = ({ onSelectTemplate, onBack }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const templates = [
    {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      category: 'Professional',
      description: 'Clean, minimalist design perfect for tech and creative roles',
      color: 'blue',
      features: ['ATS-Friendly', 'Clean Layout', 'Modern Typography'],
      preview: '/templates/modern-minimal.jpg',
      popular: true
    },
    {
      id: 'executive-classic',
      name: 'Executive Classic',
      category: 'Corporate',
      description: 'Traditional professional layout for senior positions',
      color: 'gray',
      features: ['Corporate Style', 'Professional', 'Traditional'],
      preview: '/templates/executive-classic.jpg',
      popular: false
    },
    {
      id: 'creative-bold',
      name: 'Creative Bold',
      category: 'Creative',
      description: 'Eye-catching design for creative professionals',
      color: 'purple',
      features: ['Creative Design', 'Color Accents', 'Unique Layout'],
      preview: '/templates/creative-bold.jpg',
      popular: true
    },
    {
      id: 'tech-focused',
      name: 'Tech Focused',
      category: 'Technology',
      description: 'Optimized for software developers and engineers',
      color: 'green',
      features: ['Tech-Optimized', 'Skills Highlight', 'Project Focus'],
      preview: '/templates/tech-focused.jpg',
      popular: true
    },
    {
      id: 'academic-research',
      name: 'Academic Research',
      category: 'Academic',
      description: 'Designed for researchers and academic positions',
      color: 'indigo',
      features: ['Publication Focus', 'Research Oriented', 'Academic Style'],
      preview: '/templates/academic-research.jpg',
      popular: false
    },
    {
      id: 'sales-marketing',
      name: 'Sales & Marketing',
      category: 'Sales',
      description: 'Dynamic layout for sales and marketing professionals',
      color: 'red',
      features: ['Results Focused', 'Achievement Highlight', 'Dynamic'],
      preview: '/templates/sales-marketing.jpg',
      popular: true
    },
    {
      id: 'healthcare-medical',
      name: 'Healthcare Medical',
      category: 'Healthcare',
      description: 'Professional design for medical professionals',
      color: 'teal',
      features: ['Medical Focus', 'Certification Highlight', 'Clean'],
      preview: '/templates/healthcare-medical.jpg',
      popular: false
    },
    {
      id: 'finance-banking',
      name: 'Finance & Banking',
      category: 'Finance',
      description: 'Conservative design for financial sector',
      color: 'blue',
      features: ['Conservative', 'Numbers Focus', 'Professional'],
      preview: '/templates/finance-banking.jpg',
      popular: false
    },
    {
      id: 'startup-entrepreneur',
      name: 'Startup Entrepreneur',
      category: 'Startup',
      description: 'Modern design for startup founders and entrepreneurs',
      color: 'orange',
      features: ['Innovative', 'Leadership Focus', 'Modern'],
      preview: '/templates/startup-entrepreneur.jpg',
      popular: true
    },
    {
      id: 'consulting-strategy',
      name: 'Consulting Strategy',
      category: 'Consulting',
      description: 'Strategic layout for consultants and analysts',
      color: 'slate',
      features: ['Strategic Focus', 'Problem Solving', 'Analytical'],
      preview: '/templates/consulting-strategy.jpg',
      popular: false
    },
    {
      id: 'education-teaching',
      name: 'Education & Teaching',
      category: 'Education',
      description: 'Warm design for educators and trainers',
      color: 'amber',
      features: ['Education Focus', 'Warm Design', 'Experience Highlight'],
      preview: '/templates/education-teaching.jpg',
      popular: false
    },
    {
      id: 'design-portfolio',
      name: 'Design Portfolio',
      category: 'Design',
      description: 'Visual-first layout for designers and artists',
      color: 'pink',
      features: ['Visual Focus', 'Portfolio Style', 'Creative Layout'],
      preview: '/templates/design-portfolio.jpg',
      popular: true
    },
    {
      id: 'operations-logistics',
      name: 'Operations & Logistics',
      category: 'Operations',
      description: 'Efficient layout for operations professionals',
      color: 'emerald',
      features: ['Efficiency Focus', 'Process Oriented', 'Clear Structure'],
      preview: '/templates/operations-logistics.jpg',
      popular: false
    },
    {
      id: 'international-global',
      name: 'International Global',
      category: 'International',
      description: 'Multicultural design for global professionals',
      color: 'cyan',
      features: ['Global Appeal', 'Cultural Sensitivity', 'International'],
      preview: '/templates/international-global.jpg',
      popular: false
    },
    {
      id: 'entry-level-fresh',
      name: 'Entry Level Fresh',
      category: 'Entry Level',
      description: 'Perfect for new graduates and career starters',
      color: 'lime',
      features: ['Fresh Graduate', 'Potential Focus', 'Modern Appeal'],
      preview: '/templates/entry-level-fresh.jpg',
      popular: true
    }
  ];

  const categories = ['All', 'Professional', 'Creative', 'Technology', 'Corporate', 'Academic', 'Sales', 'Healthcare', 'Finance', 'Startup', 'Consulting', 'Education', 'Design', 'Operations', 'International', 'Entry Level'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTemplates = activeCategory === 'All' 
    ? templates 
    : templates.filter(template => template.category === activeCategory);

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'from-blue-500 to-blue-600 border-blue-200 bg-blue-50',
      gray: 'from-gray-500 to-gray-600 border-gray-200 bg-gray-50',
      purple: 'from-purple-500 to-purple-600 border-purple-200 bg-purple-50',
      green: 'from-green-500 to-green-600 border-green-200 bg-green-50',
      indigo: 'from-indigo-500 to-indigo-600 border-indigo-200 bg-indigo-50',
      red: 'from-red-500 to-red-600 border-red-200 bg-red-50',
      teal: 'from-teal-500 to-teal-600 border-teal-200 bg-teal-50',
      orange: 'from-orange-500 to-orange-600 border-orange-200 bg-orange-50',
      slate: 'from-slate-500 to-slate-600 border-slate-200 bg-slate-50',
      amber: 'from-amber-500 to-amber-600 border-amber-200 bg-amber-50',
      pink: 'from-pink-500 to-pink-600 border-pink-200 bg-pink-50',
      emerald: 'from-emerald-500 to-emerald-600 border-emerald-200 bg-emerald-50',
      cyan: 'from-cyan-500 to-cyan-600 border-cyan-200 bg-cyan-50',
      lime: 'from-lime-500 to-lime-600 border-lime-200 bg-lime-50'
    };
    return colorMap[color] || colorMap.blue;
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template.id);
    onSelectTemplate(template);
  };

  const TemplatePreview = ({ template }) => (
    <div className={`w-full h-48 rounded-lg border-2 ${getColorClasses(template.color).split(' ')[2]} bg-gradient-to-br ${getColorClasses(template.color).split(' ')[0]} ${getColorClasses(template.color).split(' ')[1]} p-4 text-white relative overflow-hidden`}>
      {/* Template Preview Mockup */}
      <div className="space-y-2">
        <div className="h-3 bg-white/30 rounded w-2/3"></div>
        <div className="h-2 bg-white/20 rounded w-1/2"></div>
        <div className="h-2 bg-white/20 rounded w-3/4"></div>
        
        <div className="mt-4 space-y-1">
          <div className="h-2 bg-white/25 rounded w-full"></div>
          <div className="h-2 bg-white/25 rounded w-5/6"></div>
          <div className="h-2 bg-white/25 rounded w-4/5"></div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="h-2 bg-white/20 rounded"></div>
          <div className="h-2 bg-white/20 rounded"></div>
        </div>
      </div>
      
      {template.popular && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
          <Star className="h-3 w-3 mr-1" />
          Popular
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={onBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </motion.button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Choose Your Template</h1>
                <p className="text-gray-600">Select a professional template that matches your career</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {filteredTemplates.length} templates available
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
                  selectedTemplate === template.id ? 'border-blue-500 ring-4 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                {/* Template Preview */}
                <div className="p-4">
                  <TemplatePreview template={template} />
                </div>

                {/* Template Info */}
                <div className="p-6 pt-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.category}</p>
                    </div>
                    
                    {selectedTemplate === template.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-blue-600 text-white p-2 rounded-full"
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    )}
                  </div>

                  <p className="text-gray-700 text-sm mb-4">{template.description}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.features.map(feature => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplate(template);
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(template);
                      }}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        selectedTemplate === template.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      <Download className="h-4 w-4" />
                      <span>Select</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Continue Button */}
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6"
          >
            <motion.button
              onClick={() => {
                const template = templates.find(t => t.id === selectedTemplate);
                onSelectTemplate(template);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold text-lg flex items-center space-x-3 hover:shadow-3xl transition-all"
            >
              <span>Continue with {templates.find(t => t.id === selectedTemplate)?.name}</span>
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{previewTemplate.name}</h2>
                  <p className="text-gray-600">{previewTemplate.description}</p>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {/* Large Preview */}
              <div className="aspect-[8.5/11] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">
                  <FileText className="h-24 w-24 mx-auto mb-4" />
                  <p className="text-center">Template Preview</p>
                  <p className="text-center text-sm">{previewTemplate.name}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleSelectTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                >
                  Select This Template
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateSelection;

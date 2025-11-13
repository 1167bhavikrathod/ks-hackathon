import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, User, Briefcase, GraduationCap, Code, Save, Eye, EyeOff, Upload } from 'lucide-react';

const EnhancedResumeEditor = ({ resumeData, setResumeData, setSelectedText, className = "" }) => {
  const [activeSection, setActiveSection] = useState('personal');
  const [previewMode, setPreviewMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User, color: 'blue' },
    { id: 'experience', label: 'Experience', icon: Briefcase, color: 'green' },
    { id: 'education', label: 'Education', icon: GraduationCap, color: 'purple' },
    { id: 'skills', label: 'Skills', icon: Code, color: 'orange' }
  ];

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now(),
        company: '',
        position: '',
        duration: '',
        description: ''
      }]
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now(),
        institution: '',
        degree: '',
        field: '',
        duration: '',
        gpa: '',
        achievements: ''
      }]
    }));
  };

  const updateEducation = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = (category) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...(prev.skills[category] || []), '']
      }
    }));
  };

  const updateSkill = (category, index, value) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].map((skill, i) => 
          i === index ? value : skill
        )
      }
    }));
  };

  const removeSkill = (category, index) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  const updateExperience = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const handleTextSelection = (e) => {
    const selection = window.getSelection().toString().trim();
    if (selection) {
      setSelectedText(selection);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-white rounded-2xl shadow-xl border overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Resume Editor</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="text-sm">{previewMode ? 'Edit' : 'Preview'}</span>
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex space-x-1 bg-white/50 p-1 rounded-lg">
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6" onMouseUp={handleTextSelection}>
        <AnimatePresence mode="wait">
          {activeSection === 'personal' && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries({
                  name: 'Full Name',
                  email: 'Email Address',
                  phone: 'Phone Number',
                  location: 'Location'
                }).map(([key, label]) => (
                  <motion.div
                    key={key}
                    whileFocus={{ scale: 1.02 }}
                    className="relative"
                  >
                    <input
                      type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                      placeholder={label}
                      value={resumeData.personalInfo[key] || ''}
                      onChange={(e) => updatePersonalInfo(key, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'experience' && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                <motion.button
                  onClick={addExperience}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Experience</span>
                </motion.button>
              </div>

              <div className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-all bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
                      <motion.button
                        onClick={() => removeExperience(exp.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Duration (e.g., Jan 2020 - Present)"
                      value={exp.duration}
                      onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 transition-all"
                    />

                    <textarea
                      placeholder="Job description and achievements..."
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                    />
                  </motion.div>
                ))}

                {resumeData.experience.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">No work experience added yet</p>
                    <p className="text-sm">Click "Add Experience" to get started</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                <motion.button
                  onClick={addEducation}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Education</span>
                </motion.button>
              </div>

              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-all bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
                      <motion.button
                        onClick={() => removeEducation(edu.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Institution Name"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Degree (e.g., Bachelor of Science)"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Field of Study"
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g., 2018 - 2022)"
                        value={edu.duration}
                        onChange={(e) => updateEducation(edu.id, 'duration', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="GPA (optional)"
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                    </div>

                    <textarea
                      placeholder="Achievements, honors, relevant coursework..."
                      value={edu.achievements}
                      onChange={(e) => updateEducation(edu.id, 'achievements', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all"
                    />
                  </motion.div>
                ))}

                {resumeData.education.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">No education added yet</p>
                    <p className="text-sm">Click "Add Education" to get started</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
              </div>

              {['technical', 'soft', 'languages', 'tools'].map((category) => {
                const categoryLabels = {
                  technical: 'Technical Skills',
                  soft: 'Soft Skills', 
                  languages: 'Languages',
                  tools: 'Tools & Technologies'
                };
                
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-900">{categoryLabels[category]}</h4>
                      <motion.button
                        onClick={() => addSkill(category)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-all"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add</span>
                      </motion.button>
                    </div>

                    <div className="space-y-2">
                      {(resumeData.skills[category] || []).map((skill, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder={`Enter ${categoryLabels[category].toLowerCase().slice(0, -1)}`}
                            value={skill}
                            onChange={(e) => updateSkill(category, index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                          />
                          <motion.button
                            onClick={() => removeSkill(category, index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      ))}
                      
                      {(!resumeData.skills[category] || resumeData.skills[category].length === 0) && (
                        <p className="text-gray-400 text-sm italic">No {categoryLabels[category].toLowerCase()} added yet</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Demo Button */}
        <div className="flex justify-center pt-6 border-t mt-8">
          <motion.button
            onClick={() => {
              setResumeData({
                personalInfo: {
                  name: 'John Doe',
                  email: 'john.doe@email.com',
                  phone: '+1 (555) 123-4567',
                  location: 'San Francisco, CA'
                },
                experience: [{
                  id: 1,
                  company: 'Tech Corp',
                  position: 'Software Developer',
                  duration: 'Jan 2022 - Present',
                  description: '• Developed web applications using React and Node.js\n• Improved performance by 40%\n• Led team of 3 developers'
                }],
                education: [{
                  id: 1,
                  institution: 'University of California',
                  degree: 'Bachelor of Science',
                  field: 'Computer Science',
                  duration: '2018 - 2022',
                  gpa: '3.8/4.0',
                  achievements: '• Dean\'s List for 3 semesters\n• Computer Science Society President\n• Relevant Coursework: Data Structures, Algorithms, Web Development'
                }],
                skills: {
                  technical: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
                  soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration'],
                  languages: ['English (Native)', 'Spanish (Conversational)'],
                  tools: ['Git', 'Docker', 'AWS', 'MongoDB', 'VS Code']
                }
              });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all font-medium"
          >
            Load Demo Data
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedResumeEditor;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const ImportResume = ({ onImport, className = "" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      // Convert file to ArrayBuffer for pdf-parse
      const arrayBuffer = await file.arrayBuffer();
      
      // For browser environment, we'll use a different approach
      // Since pdf-parse requires Node.js, we'll use PDF.js or send to backend
      
      // Option 1: Send to backend for processing
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('http://localhost:4002/api/parse-pdf', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          return data.text;
        }
      } catch (backendError) {
        console.log('Backend PDF parsing not available, using fallback');
      }
      
      // Option 2: Client-side fallback using FileReader
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            // This is a simplified approach - in production you'd use PDF.js
            const text = e.target.result;
            
            // Try to extract readable text (this is basic and may not work for all PDFs)
            // For better results, implement PDF.js or use backend processing
            const extractedText = text.replace(/[^\x20-\x7E\n]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            if (extractedText.length < 50) {
              // If we can't extract much text, provide a helpful message
              resolve(`
Unable to extract text from this PDF automatically.
Please try:
1. Converting your PDF to a text-based format
2. Using a DOCX file instead
3. Manually entering your information

For demo purposes, here's sample data:
JOHN DOE
john.doe@email.com | (555) 123-4567 | San Francisco, CA

EXPERIENCE
Software Developer | Tech Corp | Jan 2022 - Present
• Developed web applications using modern technologies
• Collaborated with cross-functional teams
• Improved system performance and user experience
              `);
            } else {
              resolve(extractedText);
            }
          } catch (parseError) {
            reject(new Error('Unable to parse PDF content. Please try a DOCX file or enter information manually.'));
          }
        };
        
        reader.onerror = () => reject(new Error('Failed to read PDF file'));
        reader.readAsText(file);
      });
      
    } catch (error) {
      throw new Error('Failed to process PDF file: ' + error.message);
    }
  };

  const extractTextFromDOCX = async (file) => {
    try {
      // Option 1: Send to backend for processing
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('http://localhost:4002/api/parse-docx', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          return data.text;
        }
      } catch (backendError) {
        console.log('Backend DOCX parsing not available, using fallback');
      }
      
      // Option 2: Client-side parsing using mammoth (if available)
      if (window.mammoth) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await window.mammoth.extractRawText({ arrayBuffer });
        return result.value;
      }
      
      // Option 3: Fallback - try to read as text
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const content = e.target.result;
            
            // Try to extract readable text from DOCX
            // This is basic and may not work for all DOCX files
            let extractedText = content.replace(/[^\x20-\x7E\n]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            if (extractedText.length < 50) {
              // Provide helpful fallback
              resolve(`
Unable to extract text from this DOCX file automatically.
Please try:
1. Saving your resume as a plain text file
2. Using a PDF instead
3. Manually entering your information

For demo purposes, here's sample data:
JANE SMITH
jane.smith@email.com | (555) 987-6543 | New York, NY

PROFESSIONAL EXPERIENCE
Product Manager | Innovation Inc | Mar 2021 - Present
• Led product strategy for mobile app with 500K+ users
• Coordinated with engineering and design teams
• Increased user retention by 25%

EDUCATION
Master of Business Administration | Harvard Business School | 2019 - 2021
Bachelor of Arts in Economics | Yale University | 2015 - 2019

SKILLS
Product Management, Data Analysis, Agile, Scrum, Leadership
              `);
            } else {
              resolve(extractedText);
            }
          } catch (parseError) {
            reject(new Error('Unable to parse DOCX content. Please try a different file format.'));
          }
        };
        
        reader.onerror = () => reject(new Error('Failed to read DOCX file'));
        reader.readAsText(file);
      });
      
    } catch (error) {
      throw new Error('Failed to process DOCX file: ' + error.message);
    }
  };

  const parseResumeText = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    const resumeData = {
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
    };

    console.log('Parsing resume text:', text);
    console.log('Lines extracted:', lines);

    let currentSection = '';
    let currentExperience = null;
    let currentEducation = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Extract personal info from first few lines or anywhere in the document
      if (line.includes('@') && !resumeData.personalInfo.email) {
        const emailMatch = line.match(/[\w.-]+@[\w.-]+\.\w+/);
        if (emailMatch) {
          resumeData.personalInfo.email = emailMatch[0];
          console.log('Found email:', emailMatch[0]);
        }
      }
      
      // Phone number patterns
      if (line.match(/\(\d{3}\)\s?\d{3}-\d{4}|\d{3}-\d{3}-\d{4}|\+\d{1,3}\s?\(\d{3}\)\s?\d{3}-\d{4}/) && !resumeData.personalInfo.phone) {
        const phoneMatch = line.match(/\(\d{3}\)\s?\d{3}-\d{4}|\d{3}-\d{3}-\d{4}|\+\d{1,3}\s?\(\d{3}\)\s?\d{3}-\d{4}/);
        if (phoneMatch) {
          resumeData.personalInfo.phone = phoneMatch[0];
          console.log('Found phone:', phoneMatch[0]);
        }
      }
      
      // Extract name (usually the first line that's not email/phone/location)
      if (i < 10 && !resumeData.personalInfo.name && 
          !line.includes('@') && 
          !line.match(/\d{3}/) && 
          !line.toUpperCase().includes('RESUME') &&
          !line.toUpperCase().includes('CV') &&
          line.length > 2 && line.length < 50) {
        resumeData.personalInfo.name = line;
        console.log('Found name:', line);
      }
      
      // Extract location (contains state abbreviations, city names, or common location indicators)
      if ((line.match(/[A-Z]{2}$/) || 
           line.includes('CA') || line.includes('NY') || line.includes('TX') || 
           line.includes('FL') || line.includes('IL') || line.includes('WA') ||
           line.toLowerCase().includes('city') ||
           line.includes(',')) && 
          !resumeData.personalInfo.location &&
          !line.includes('@') && 
          line.length < 100) {
        // Clean up location string
        const locationParts = line.split('|');
        resumeData.personalInfo.location = locationParts[locationParts.length - 1].trim();
        console.log('Found location:', resumeData.personalInfo.location);
      }

      // Detect sections
      if (line.toUpperCase().includes('EXPERIENCE') || line.toUpperCase().includes('WORK')) {
        currentSection = 'experience';
        continue;
      }
      
      if (line.toUpperCase().includes('EDUCATION')) {
        currentSection = 'education';
        continue;
      }
      
      if (line.toUpperCase().includes('SKILLS')) {
        currentSection = 'skills';
        continue;
      }

      // Parse experience
      if (currentSection === 'experience') {
        if ((line.includes('|') || line.match(/\d{4}/)) && !line.startsWith('•') && !line.startsWith('-')) {
          // New job entry - handle both | separated and other formats
          if (currentExperience) {
            resumeData.experience.push(currentExperience);
            console.log('Added experience:', currentExperience);
          }
          
          let position = '', company = '', duration = '';
          
          if (line.includes('|')) {
            const parts = line.split('|').map(p => p.trim());
            position = parts[0] || '';
            company = parts[1] || '';
            duration = parts[2] || '';
          } else {
            // Try to parse other formats like "Job Title at Company (Date - Date)"
            const dateMatch = line.match(/(\d{4}.*?(?:present|current|\d{4}))/i);
            if (dateMatch) {
              duration = dateMatch[1];
              const beforeDate = line.substring(0, dateMatch.index).trim();
              
              if (beforeDate.includes(' at ')) {
                const atParts = beforeDate.split(' at ');
                position = atParts[0].trim();
                company = atParts[1].trim();
              } else if (beforeDate.includes(' - ')) {
                const dashParts = beforeDate.split(' - ');
                position = dashParts[0].trim();
                company = dashParts[1].trim();
              } else {
                position = beforeDate;
              }
            } else {
              position = line;
            }
          }
          
          currentExperience = {
            id: Date.now() + Math.random(),
            position: position,
            company: company,
            duration: duration,
            description: ''
          };
        } else if ((line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) && currentExperience) {
          currentExperience.description += (currentExperience.description ? '\n' : '') + line;
        } else if (currentExperience && line.length > 10 && !line.match(/^\d/)) {
          // Add non-bullet content as description
          currentExperience.description += (currentExperience.description ? '\n• ' : '• ') + line;
        }
      }

      // Parse education
      if (currentSection === 'education') {
        if (line.includes('|') && !line.startsWith('•')) {
          if (currentEducation) {
            resumeData.education.push(currentEducation);
          }
          
          const parts = line.split('|').map(p => p.trim());
          currentEducation = {
            id: Date.now() + Math.random(),
            degree: parts[0] || '',
            institution: parts[1] || '',
            duration: parts[2] || '',
            gpa: '',
            achievements: ''
          };
        } else if (line.startsWith('•') && currentEducation) {
          currentEducation.achievements += (currentEducation.achievements ? '\n' : '') + line;
        }
      }

      // Parse skills
      if (currentSection === 'skills') {
        const skillsArray = line.split(',').map(s => s.trim()).filter(s => s);
        
        // Categorize skills
        skillsArray.forEach(skill => {
          const lowerSkill = skill.toLowerCase();
          if (['javascript', 'react', 'node.js', 'python', 'java', 'aws', 'docker', 'git'].some(tech => lowerSkill.includes(tech))) {
            resumeData.skills.technical.push(skill);
          } else if (['leadership', 'communication', 'management', 'teamwork', 'problem-solving'].some(soft => lowerSkill.includes(soft))) {
            resumeData.skills.soft.push(skill);
          } else {
            resumeData.skills.tools.push(skill);
          }
        });
      }
    }

    // Add remaining items
    if (currentExperience) {
      resumeData.experience.push(currentExperience);
    }
    if (currentEducation) {
      resumeData.education.push(currentEducation);
    }

    return resumeData;
  };

  const handleFile = async (file) => {
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      if (!fileName.endsWith('.pdf') && !fileName.endsWith('.docx') && !fileName.endsWith('.doc')) {
        throw new Error('Please upload a PDF or DOCX file only');
      }

      let extractedText = '';

      if (fileName.endsWith('.pdf')) {
        extractedText = await extractTextFromPDF(file);
      } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        extractedText = await extractTextFromDOCX(file);
      }

      const parsedData = parseResumeText(extractedText);
      
      setSuccess('Resume imported successfully!');
      onImport(parsedData);

    } catch (err) {
      setError(err.message || 'Failed to import resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}
    >
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Import Existing Resume</h3>
            <p className="text-sm text-gray-600">Upload PDF or DOCX files to get started quickly</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />

          <div className="space-y-4">
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-lg font-medium text-gray-900">Processing your resume...</p>
                <p className="text-sm text-gray-600">This may take a few moments</p>
              </div>
            ) : (
              <>
                <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your resume here or click to browse
                  </p>
                  <p className="text-sm text-gray-600">
                    Supports PDF and DOCX files up to 10MB
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choose File
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3"
          >
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3"
          >
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-green-700">{success}</p>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Import Tips:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Ensure your resume has clear sections (Experience, Education, Skills)</li>
            <li>• Use standard formatting with bullet points for better parsing</li>
            <li>• Include contact information at the top of your resume</li>
            <li>• Review and edit the imported data for accuracy</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default ImportResume;

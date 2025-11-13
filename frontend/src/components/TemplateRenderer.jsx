import React from 'react';
import { Mail, Phone, MapPin, Calendar, Award, Briefcase, GraduationCap, Code } from 'lucide-react';

const TemplateRenderer = ({ template, resumeData, className = "" }) => {
  const renderModernMinimal = () => (
    <div className="bg-white p-8 shadow-lg rounded-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-blue-500 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{resumeData.personalInfo.name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          {resumeData.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{resumeData.personalInfo.email}</span>
            </div>
          )}
          {resumeData.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{resumeData.personalInfo.phone}</span>
            </div>
          )}
          {resumeData.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{resumeData.personalInfo.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-blue-500" />
            Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                </div>
                <span className="text-gray-500 text-sm">{exp.duration}</span>
              </div>
              <div className="text-gray-700 whitespace-pre-line">{exp.description}</div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-500" />
            Education
          </h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-blue-600 font-medium">{edu.institution}</p>
                  {edu.field && <p className="text-gray-600">{edu.field}</p>}
                </div>
                <span className="text-gray-500 text-sm">{edu.duration}</span>
              </div>
              {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
              {edu.achievements && <div className="text-gray-700 whitespace-pre-line">{edu.achievements}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {Object.values(resumeData.skills).some(skillArray => skillArray.length > 0) && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Code className="h-6 w-6 text-blue-500" />
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(resumeData.skills).map(([category, skills]) => 
              skills.length > 0 && (
                <div key={category}>
                  <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderExecutiveClassic = () => (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center border-b border-gray-300 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{resumeData.personalInfo.name || 'Your Name'}</h1>
        <div className="text-gray-600 space-y-1">
          {resumeData.personalInfo.email && <div>{resumeData.personalInfo.email}</div>}
          {resumeData.personalInfo.phone && <div>{resumeData.personalInfo.phone}</div>}
          {resumeData.personalInfo.location && <div>{resumeData.personalInfo.location}</div>}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-2">
          {/* Experience */}
          {resumeData.experience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                Professional Experience
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                    <p className="text-gray-500 text-sm">{exp.duration}</p>
                  </div>
                  <div className="text-gray-700 whitespace-pre-line">{exp.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Education */}
          {resumeData.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                Education
              </h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700">{edu.institution}</p>
                  <p className="text-gray-500 text-sm">{edu.duration}</p>
                  {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {Object.values(resumeData.skills).some(skillArray => skillArray.length > 0) && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                Skills
              </h2>
              {Object.entries(resumeData.skills).map(([category, skills]) => 
                skills.length > 0 && (
                  <div key={category} className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <ul className="text-gray-700 text-sm space-y-1">
                      {skills.map((skill, index) => (
                        <li key={index}>• {skill}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCreativeBold = () => (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-4xl font-bold mb-2">{resumeData.personalInfo.name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-4 text-purple-100">
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Experience */}
        {resumeData.experience.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">Experience</h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-purple-600 font-medium">{exp.company}</p>
                  </div>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    {exp.duration}
                  </span>
                </div>
                <div className="text-gray-700 whitespace-pre-line">{exp.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Education & Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          {resumeData.education.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-purple-600 mb-4">Education</h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-purple-600">{edu.institution}</p>
                  <p className="text-gray-500 text-sm">{edu.duration}</p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {Object.values(resumeData.skills).some(skillArray => skillArray.length > 0) && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-purple-600 mb-4">Skills</h2>
              {Object.entries(resumeData.skills).map(([category, skills]) => 
                skills.length > 0 && (
                  <div key={category} className="mb-4 last:mb-0">
                    <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTechFocused = () => (
    <div className="bg-gray-900 text-white p-8 shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-l-4 border-green-500 pl-6 mb-8">
        <h1 className="text-4xl font-bold text-green-400 mb-2">{resumeData.personalInfo.name || 'Your Name'}</h1>
        <div className="text-gray-300 space-y-1">
          {resumeData.personalInfo.email && <div>{resumeData.personalInfo.email}</div>}
          {resumeData.personalInfo.phone && <div>{resumeData.personalInfo.phone}</div>}
          {resumeData.personalInfo.location && <div>{resumeData.personalInfo.location}</div>}
        </div>
      </div>

      {/* Skills First */}
      {Object.values(resumeData.skills).some(skillArray => skillArray.length > 0) && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-4">// Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(resumeData.skills).map(([category, skills]) => 
              skills.length > 0 && (
                <div key={category} className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-bold text-green-400 mb-3 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div className="space-y-2">
                    {skills.map((skill, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">▶</span>
                        <span className="text-gray-300">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-4">// Experience</h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg mb-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">{exp.position}</h3>
                  <p className="text-green-400">{exp.company}</p>
                </div>
                <span className="text-gray-400 font-mono text-sm">{exp.duration}</span>
              </div>
              <div className="text-gray-300 whitespace-pre-line font-mono text-sm">{exp.description}</div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-4">// Education</h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg mb-4">
              <h3 className="font-bold text-white">{edu.degree}</h3>
              <p className="text-green-400">{edu.institution}</p>
              <p className="text-gray-400 text-sm">{edu.duration}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDefaultTemplate = () => (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{resumeData.personalInfo.name || 'Your Name'}</h1>
        <div className="text-gray-600 space-y-1">
          {resumeData.personalInfo.email && <div>{resumeData.personalInfo.email}</div>}
          {resumeData.personalInfo.phone && <div>{resumeData.personalInfo.phone}</div>}
          {resumeData.personalInfo.location && <div>{resumeData.personalInfo.location}</div>}
        </div>
      </div>

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-700">{exp.company}</p>
                </div>
                <span className="text-gray-500 text-sm">{exp.duration}</span>
              </div>
              <div className="text-gray-700 whitespace-pre-line">{exp.description}</div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
              <p className="text-gray-700">{edu.institution}</p>
              <p className="text-gray-500 text-sm">{edu.duration}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {Object.values(resumeData.skills).some(skillArray => skillArray.length > 0) && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
          {Object.entries(resumeData.skills).map(([category, skills]) => 
            skills.length > 0 && (
              <div key={category} className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );

  const getTemplateRenderer = () => {
    if (!template) return renderDefaultTemplate();
    
    switch (template.id) {
      case 'modern-minimal':
        return renderModernMinimal();
      case 'executive-classic':
        return renderExecutiveClassic();
      case 'creative-bold':
        return renderCreativeBold();
      case 'tech-focused':
        return renderTechFocused();
      default:
        return renderDefaultTemplate();
    }
  };

  return (
    <div className={`${className}`}>
      {getTemplateRenderer()}
    </div>
  );
};

export default TemplateRenderer;

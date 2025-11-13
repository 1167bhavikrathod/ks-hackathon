import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import TemplateRenderer from './TemplateRenderer';

const ExportButton = ({ resumeData, selectedTemplate }) => {
  const [isExporting, setIsExporting] = useState(false);
  
  const exportToPDF = async () => {
    console.log('=== MAIN PDF EXPORT START ===');
    console.log('Resume data:', JSON.stringify(resumeData, null, 2));
    
    setIsExporting(true);

    try {
      // Use the enhanced fallback method directly for reliability
      console.log('Using enhanced direct PDF generation...');
      await exportEnhancedPDF();
      console.log('PDF export completed successfully');
      
    } catch (error) {
      console.error('PDF Export Error:', error);
      console.error('Error stack:', error.stack);
      alert(`PDF export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
      console.log('=== MAIN PDF EXPORT END ===');
    }
  };

  const exportEnhancedPDF = async () => {
    console.log('=== ENHANCED PDF GENERATION ===');
    console.log('Full resume data:', JSON.stringify(resumeData, null, 2));
    
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Set up fonts and colors
    doc.setFont('helvetica');
    let yPos = 30;
    
    // Header - Name
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235); // Blue color
    const name = resumeData.personalInfo?.name || 'Your Name';
    doc.text(name, 105, yPos, { align: 'center' });
    yPos += 20;
    
    // Contact Information
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0); // Black
    const contactInfo = [];
    if (resumeData.personalInfo?.email) contactInfo.push(`Email: ${resumeData.personalInfo.email}`);
    if (resumeData.personalInfo?.phone) contactInfo.push(`Phone: ${resumeData.personalInfo.phone}`);
    if (resumeData.personalInfo?.location) contactInfo.push(`Location: ${resumeData.personalInfo.location}`);
    
    if (contactInfo.length > 0) {
      const contactText = contactInfo.join(' | ');
      doc.text(contactText, 105, yPos, { align: 'center' });
      yPos += 15;
    }
    
    // Horizontal line
    doc.setDrawColor(229, 231, 235);
    doc.line(20, yPos, 190, yPos);
    yPos += 15;
    
    // Professional Experience
    if (resumeData.experience?.length > 0) {
      console.log('Adding experience section, count:', resumeData.experience.length);
      
      // Section header
      doc.setFontSize(16);
      doc.setTextColor(31, 41, 55); // Dark gray
      doc.setFont('helvetica', 'bold');
      doc.text('PROFESSIONAL EXPERIENCE', 20, yPos);
      yPos += 5;
      
      // Underline
      doc.setDrawColor(229, 231, 235);
      doc.line(20, yPos, 190, yPos);
      yPos += 15;
      
      doc.setFont('helvetica', 'normal');
      resumeData.experience.forEach((exp, index) => {
        console.log(`Processing experience ${index}:`, exp);
        
        if (yPos > 250) {
          doc.addPage();
          yPos = 30;
        }
        
        // Position and Company
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text(`${exp.position || 'Position'}`, 20, yPos);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text(`${exp.company || 'Company'}`, 20, yPos + 7);
        
        // Duration
        if (exp.duration) {
          doc.setFontSize(11);
          doc.setTextColor(156, 163, 175);
          doc.text(exp.duration, 20, yPos + 14);
        }
        
        yPos += 22;
        
        // Description
        if (exp.description) {
          doc.setFontSize(11);
          doc.setTextColor(55, 65, 81);
          const lines = doc.splitTextToSize(exp.description, 170);
          doc.text(lines, 20, yPos);
          yPos += lines.length * 5 + 10;
        }
        
        yPos += 5;
      });
    }
    
    // Education
    if (resumeData.education?.length > 0) {
      console.log('Adding education section, count:', resumeData.education.length);
      
      if (yPos > 220) {
        doc.addPage();
        yPos = 30;
      }
      
      // Section header
      doc.setFontSize(16);
      doc.setTextColor(31, 41, 55);
      doc.setFont('helvetica', 'bold');
      doc.text('EDUCATION', 20, yPos);
      yPos += 5;
      
      // Underline
      doc.setDrawColor(229, 231, 235);
      doc.line(20, yPos, 190, yPos);
      yPos += 15;
      
      doc.setFont('helvetica', 'normal');
      resumeData.education.forEach((edu, index) => {
        console.log(`Processing education ${index}:`, edu);
        
        if (yPos > 250) {
          doc.addPage();
          yPos = 30;
        }
        
        // Degree
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text(`${edu.degree || 'Degree'}`, 20, yPos);
        
        // Institution
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text(`${edu.institution || 'Institution'}`, 20, yPos + 7);
        
        // Duration
        if (edu.duration) {
          doc.setFontSize(11);
          doc.setTextColor(156, 163, 175);
          doc.text(edu.duration, 20, yPos + 14);
        }
        
        yPos += 22;
        
        // Additional details
        doc.setFontSize(11);
        doc.setTextColor(55, 65, 81);
        if (edu.field) {
          doc.text(`Field of Study: ${edu.field}`, 20, yPos);
          yPos += 6;
        }
        if (edu.gpa) {
          doc.text(`GPA: ${edu.gpa}`, 20, yPos);
          yPos += 6;
        }
        if (edu.achievements) {
          const lines = doc.splitTextToSize(edu.achievements, 170);
          doc.text(lines, 20, yPos);
          yPos += lines.length * 5 + 5;
        }
        
        yPos += 10;
      });
    }
    
    // Skills
    if (resumeData.skills && Object.keys(resumeData.skills).length > 0) {
      console.log('Adding skills section:', resumeData.skills);
      
      if (yPos > 200) {
        doc.addPage();
        yPos = 30;
      }
      
      // Section header
      doc.setFontSize(16);
      doc.setTextColor(31, 41, 55);
      doc.setFont('helvetica', 'bold');
      doc.text('SKILLS', 20, yPos);
      yPos += 5;
      
      // Underline
      doc.setDrawColor(229, 231, 235);
      doc.line(20, yPos, 190, yPos);
      yPos += 15;
      
      doc.setFont('helvetica', 'normal');
      Object.entries(resumeData.skills).forEach(([category, skills]) => {
        if (Array.isArray(skills) && skills.length > 0) {
          console.log(`Processing skills category ${category}:`, skills);
          
          if (yPos > 260) {
            doc.addPage();
            yPos = 30;
          }
          
          // Category name
          const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1').trim();
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(55, 65, 81);
          doc.text(`${categoryName}:`, 20, yPos);
          yPos += 8;
          
          // Skills list
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(75, 85, 99);
          const skillsText = skills.join(' • ');
          const lines = doc.splitTextToSize(skillsText, 170);
          doc.text(lines, 25, yPos);
          yPos += lines.length * 5 + 12;
        }
      });
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(156, 163, 175);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 285, { align: 'center' });
      if (selectedTemplate) {
        doc.text(`Template: ${selectedTemplate.name}`, 105, 290, { align: 'center' });
      }
    }
    
    console.log('PDF generation complete, saving...');
    doc.save(`${resumeData.personalInfo?.name || 'Resume'}.pdf`);
  };

  const exportFallbackPDF = async () => {
    console.log('=== FALLBACK PDF GENERATION ===');
    console.log('Full resume data:', JSON.stringify(resumeData, null, 2));
    
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Add content directly to PDF
    doc.setFontSize(20);
    doc.text(resumeData.personalInfo?.name || 'Resume', 20, 30);
    
    doc.setFontSize(12);
    let yPos = 50;
    
    // Contact info
    if (resumeData.personalInfo?.email) {
      doc.text(`Email: ${resumeData.personalInfo.email}`, 20, yPos);
      yPos += 10;
    }
    if (resumeData.personalInfo?.phone) {
      doc.text(`Phone: ${resumeData.personalInfo.phone}`, 20, yPos);
      yPos += 10;
    }
    if (resumeData.personalInfo?.location) {
      doc.text(`Location: ${resumeData.personalInfo.location}`, 20, yPos);
      yPos += 20;
    }
    
    // Experience
    if (resumeData.experience?.length > 0) {
      console.log('Adding experience section, count:', resumeData.experience.length);
      doc.setFontSize(16);
      doc.text('Professional Experience', 20, yPos);
      yPos += 15;
      
      doc.setFontSize(12);
      resumeData.experience.forEach((exp, index) => {
        console.log(`Processing experience ${index}:`, exp);
        if (yPos > 250) {
          doc.addPage();
          yPos = 30;
        }
        doc.text(`${exp.position || ''} at ${exp.company || ''}`, 20, yPos);
        yPos += 8;
        if (exp.duration) {
          doc.text(exp.duration, 20, yPos);
          yPos += 8;
        }
        if (exp.description) {
          const lines = doc.splitTextToSize(exp.description, 170);
          doc.text(lines, 20, yPos);
          yPos += lines.length * 6 + 10;
        }
        yPos += 10;
      });
    }
    
    // Education
    if (resumeData.education?.length > 0) {
      console.log('Adding education section, count:', resumeData.education.length);
      if (yPos > 220) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.setFontSize(16);
      doc.text('Education', 20, yPos);
      yPos += 15;
      
      doc.setFontSize(12);
      resumeData.education.forEach((edu, index) => {
        console.log(`Processing education ${index}:`, edu);
        if (yPos > 250) {
          doc.addPage();
          yPos = 30;
        }
        
        doc.text(`${edu.degree || 'Degree'}`, 20, yPos);
        yPos += 8;
        doc.text(`${edu.institution || 'Institution'}`, 20, yPos);
        yPos += 8;
        if (edu.duration) {
          doc.text(edu.duration, 20, yPos);
          yPos += 8;
        }
        if (edu.field) {
          doc.text(`Field: ${edu.field}`, 20, yPos);
          yPos += 8;
        }
        if (edu.gpa) {
          doc.text(`GPA: ${edu.gpa}`, 20, yPos);
          yPos += 8;
        }
        if (edu.achievements) {
          const lines = doc.splitTextToSize(edu.achievements, 170);
          doc.text(lines, 20, yPos);
          yPos += lines.length * 6 + 10;
        }
        yPos += 10;
      });
    }
    
    // Skills
    if (resumeData.skills && Object.keys(resumeData.skills).length > 0) {
      console.log('Adding skills section:', resumeData.skills);
      if (yPos > 220) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.setFontSize(16);
      doc.text('Skills', 20, yPos);
      yPos += 15;
      
      doc.setFontSize(12);
      Object.entries(resumeData.skills).forEach(([category, skills]) => {
        if (Array.isArray(skills) && skills.length > 0) {
          console.log(`Processing skills category ${category}:`, skills);
          if (yPos > 250) {
            doc.addPage();
            yPos = 30;
          }
          
          const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1').trim();
          doc.text(`${categoryName}:`, 20, yPos);
          yPos += 8;
          
          const skillsText = skills.join(', ');
          const lines = doc.splitTextToSize(skillsText, 170);
          doc.text(lines, 25, yPos);
          yPos += lines.length * 6 + 15;
        }
      });
    }
    
    console.log('PDF generation complete, saving...');
    doc.save(`${resumeData.personalInfo?.name || 'Resume'}.pdf`);
  };

  const createSimplePDFContent = () => {
    console.log('Creating simple PDF content');
    
    const data = resumeData || {};
    const personal = data.personalInfo || {};
    const experience = data.experience || [];
    const education = data.education || [];
    const skills = data.skills || {};
    
    return `
      <div style="font-family: Arial, sans-serif; color: black; background: white; padding: 20px;">
        <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 20px; text-align: center;">
          ${personal.name || 'Your Name'}
        </h1>
        
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ccc; padding-bottom: 15px;">
          ${personal.email ? `<div style="margin: 5px 0;"><strong>Email:</strong> ${personal.email}</div>` : ''}
          ${personal.phone ? `<div style="margin: 5px 0;"><strong>Phone:</strong> ${personal.phone}</div>` : ''}
          ${personal.location ? `<div style="margin: 5px 0;"><strong>Location:</strong> ${personal.location}</div>` : ''}
        </div>
        
        ${experience.length > 0 ? `
          <h2 style="color: #1f2937; font-size: 18px; margin: 25px 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
            Professional Experience
          </h2>
          ${experience.map(exp => `
            <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
              <div style="font-weight: bold; font-size: 16px; color: #1f2937; margin-bottom: 5px;">
                ${exp.position || 'Position'}
              </div>
              <div style="color: #6b7280; font-style: italic; margin-bottom: 5px;">
                ${exp.company || 'Company'}
              </div>
              <div style="color: #9ca3af; font-size: 14px; margin-bottom: 10px;">
                ${exp.duration || 'Duration'}
              </div>
              ${exp.description ? `
                <div style="color: #374151; line-height: 1.5;">
                  ${exp.description.replace(/\n/g, '<br>')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        ` : `
          <h2 style="color: #1f2937; font-size: 18px; margin: 25px 0 15px 0;">Professional Experience</h2>
          <div style="color: #9ca3af; font-style: italic; text-align: center; padding: 20px;">
            No work experience added yet
          </div>
        `}
        
        <h2 style="color: #1f2937; font-size: 18px; margin: 25px 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
          Education
        </h2>
        ${education.length > 0 ? 
          education.map(edu => `
            <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
              <div style="font-weight: bold; font-size: 16px; color: #1f2937; margin-bottom: 5px;">
                ${edu.degree || 'Degree'}
              </div>
              <div style="color: #6b7280; font-style: italic; margin-bottom: 5px;">
                ${edu.institution || 'Institution'}
              </div>
              <div style="color: #9ca3af; font-size: 14px; margin-bottom: 10px;">
                ${edu.duration || 'Duration'}
              </div>
              ${edu.field ? `<div style="margin: 5px 0;"><strong>Field:</strong> ${edu.field}</div>` : ''}
              ${edu.gpa ? `<div style="margin: 5px 0;"><strong>GPA:</strong> ${edu.gpa}</div>` : ''}
              ${edu.achievements ? `<div style="color: #374151; margin-top: 10px;">${edu.achievements.replace(/\n/g, '<br>')}</div>` : ''}
            </div>
          `).join('')
          : `<div style="color: #9ca3af; font-style: italic; text-align: center; padding: 20px;">
               No education information added yet
             </div>`
        }
        
        <h2 style="color: #1f2937; font-size: 18px; margin: 25px 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
          Skills
        </h2>
        ${Object.values(skills).some(skillArray => Array.isArray(skillArray) && skillArray.length > 0) ? `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 15px;">
            ${Object.entries(skills).map(([category, skillList]) => 
              Array.isArray(skillList) && skillList.length > 0 ? `
                <div style="margin-bottom: 15px;">
                  <h3 style="font-size: 16px; font-weight: bold; color: #374151; margin-bottom: 8px;">
                    ${category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${skillList.map(skill => `
                      <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px; color: #374151; border: 1px solid #e5e7eb;">
                        ${skill}
                      </span>
                    `).join('')}
                  </div>
                </div>
              ` : ''
            ).join('')}
          </div>
        ` : `
          <div style="color: #9ca3af; font-style: italic; text-align: center; padding: 20px;">
            No skills added yet
          </div>
        `}
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
          Generated on ${new Date().toLocaleDateString()}
          ${selectedTemplate ? ` using ${selectedTemplate.name} template` : ''}
        </div>
      </div>
    `;
  };

  const createBasicPDFContent = () => {
    console.log('Creating PDF content with data:', resumeData);
    
    // Ensure we have valid data
    const safeResumeData = {
      personalInfo: resumeData?.personalInfo || {},
      experience: resumeData?.experience || [],
      education: resumeData?.education || [],
      skills: resumeData?.skills || {}
    };
    
    console.log('Safe resume data:', safeResumeData);
    
    // Helper function to safely get text content
    const safeText = (text) => {
      if (!text) return '';
      return String(text).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeText(safeResumeData.personalInfo.name) || 'Resume'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
            padding: 40px;
            font-size: 14px;
        }
        
        .resume-container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        h1 {
            color: #2563eb;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .contact-info {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .contact-info p {
            margin: 5px 0;
            font-size: 14px;
        }
        
        h2 {
            color: #1f2937;
            font-size: 20px;
            font-weight: bold;
            margin-top: 30px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .section-item {
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f3f4f6;
        }
        
        .item-title {
            font-size: 16px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 5px;
        }
        
        .item-subtitle {
            font-size: 14px;
            color: #6b7280;
            font-style: italic;
            margin-bottom: 5px;
        }
        
        .item-duration {
            font-size: 13px;
            color: #9ca3af;
            margin-bottom: 10px;
        }
        
        .item-description {
            font-size: 14px;
            color: #374151;
            line-height: 1.5;
            white-space: pre-line;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 15px;
        }
        
        .skill-category {
            margin-bottom: 15px;
        }
        
        .skill-category h3 {
            font-size: 16px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 8px;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill-tag {
            background: #f3f4f6;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            color: #374151;
            border: 1px solid #e5e7eb;
        }
        
        .empty-section {
            color: #9ca3af;
            font-style: italic;
            text-align: center;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="resume-container">
        <h1>${safeText(safeResumeData.personalInfo.name) || 'Your Name'}</h1>
        
        <div class="contact-info">
            ${safeResumeData.personalInfo.email ? `<p><strong>Email:</strong> ${safeText(safeResumeData.personalInfo.email)}</p>` : ''}
            ${safeResumeData.personalInfo.phone ? `<p><strong>Phone:</strong> ${safeText(safeResumeData.personalInfo.phone)}</p>` : ''}
            ${safeResumeData.personalInfo.location ? `<p><strong>Location:</strong> ${safeText(safeResumeData.personalInfo.location)}</p>` : ''}
            ${!safeResumeData.personalInfo.email && !safeResumeData.personalInfo.phone && !safeResumeData.personalInfo.location ? '<p class="empty-section">No contact information provided</p>' : ''}
        </div>
        
        <h2>Professional Experience</h2>
        ${safeResumeData.experience.length > 0 ? 
            safeResumeData.experience.map(exp => `
                <div class="section-item">
                    <div class="item-title">${safeText(exp.position) || 'Position Title'}</div>
                    <div class="item-subtitle">${safeText(exp.company) || 'Company Name'}</div>
                    <div class="item-duration">${safeText(exp.duration) || 'Employment Duration'}</div>
                    ${exp.description ? `<div class="item-description">${safeText(exp.description)}</div>` : ''}
                </div>
            `).join('') 
            : '<div class="empty-section">No work experience added yet</div>'
        }
        
        <h2>Education</h2>
        ${safeResumeData.education.length > 0 ? 
            safeResumeData.education.map(edu => `
                <div class="section-item">
                    <div class="item-title">${safeText(edu.degree) || 'Degree'}</div>
                    <div class="item-subtitle">${safeText(edu.institution) || 'Institution'}</div>
                    <div class="item-duration">${safeText(edu.duration) || 'Duration'}</div>
                    ${edu.field ? `<div class="item-description"><strong>Field of Study:</strong> ${safeText(edu.field)}</div>` : ''}
                    ${edu.gpa ? `<div class="item-description"><strong>GPA:</strong> ${safeText(edu.gpa)}</div>` : ''}
                    ${edu.achievements ? `<div class="item-description">${safeText(edu.achievements)}</div>` : ''}
                </div>
            `).join('') 
            : '<div class="empty-section">No education information added yet</div>'
        }
        
        <h2>Skills</h2>
        ${Object.values(safeResumeData.skills).some(skillArray => Array.isArray(skillArray) && skillArray.length > 0) ? 
            `<div class="skills-grid">
                ${Object.entries(safeResumeData.skills).map(([category, skills]) => 
                    Array.isArray(skills) && skills.length > 0 ? `
                        <div class="skill-category">
                            <h3>${category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1').trim()}</h3>
                            <div class="skills-list">
                                ${skills.map(skill => `<span class="skill-tag">${safeText(skill)}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''
                ).join('')}
            </div>`
            : '<div class="empty-section">No skills added yet</div>'
        }
        
        ${selectedTemplate ? `
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
                Generated using ${safeText(selectedTemplate.name)} template • ${new Date().toLocaleDateString()}
            </div>
        ` : `
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
                Generated on ${new Date().toLocaleDateString()}
            </div>
        `}
    </div>
</body>
</html>`;
    
    console.log('Generated HTML content:', htmlContent.substring(0, 500) + '...');
    return htmlContent;
  };


  return (
    <div className="flex items-center space-x-3">
      
      {/* Export to PDF */}
      <button
        onClick={exportToPDF}
        disabled={isExporting}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
          isExporting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            <span>Export PDF</span>
          </>
        )}
      </button>


      {/* Quick Stats */}
      <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500">
        <span>{resumeData.experience.length} experiences</span>
        <span>•</span>
        <span>{Object.values(resumeData.personalInfo).filter(v => v).length}/4 contact info</span>
      </div>
    </div>
  );
};

export default ExportButton;

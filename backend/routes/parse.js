const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  }
});

// Parse PDF files
router.post('/parse-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'File must be a PDF' });
    }

    // Parse PDF using pdf-parse
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Could not extract text from PDF. The file might be image-based or corrupted.',
        text: ''
      });
    }

    // Clean up the extracted text
    const cleanedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    res.json({ 
      text: cleanedText,
      pages: pdfData.numpages,
      info: pdfData.info
    });

  } catch (error) {
    console.error('PDF parsing error:', error);
    res.status(500).json({ 
      error: 'Failed to parse PDF file: ' + error.message,
      text: ''
    });
  }
});

// Parse DOCX files
router.post('/parse-docx', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'File must be a DOCX or DOC file' });
    }

    // Parse DOCX using mammoth
    const result = await mammoth.extractRawText({ buffer: req.file.buffer });
    const extractedText = result.value;

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Could not extract text from DOCX file. The file might be corrupted.',
        text: ''
      });
    }

    // Clean up the extracted text
    const cleanedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    res.json({ 
      text: cleanedText,
      messages: result.messages
    });

  } catch (error) {
    console.error('DOCX parsing error:', error);
    res.status(500).json({ 
      error: 'Failed to parse DOCX file: ' + error.message,
      text: ''
    });
  }
});

// Parse any supported file
router.post('/parse-file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let extractedText = '';
    let fileInfo = {};

    if (req.file.mimetype === 'application/pdf') {
      // Parse PDF
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text;
      fileInfo = {
        type: 'pdf',
        pages: pdfData.numpages,
        info: pdfData.info
      };
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               req.file.mimetype === 'application/msword') {
      // Parse DOCX
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      extractedText = result.value;
      fileInfo = {
        type: 'docx',
        messages: result.messages
      };
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Could not extract text from file. The file might be image-based or corrupted.',
        text: ''
      });
    }

    // Clean up the extracted text
    const cleanedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    res.json({ 
      text: cleanedText,
      fileInfo: fileInfo,
      originalFilename: req.file.originalname,
      size: req.file.size
    });

  } catch (error) {
    console.error('File parsing error:', error);
    res.status(500).json({ 
      error: 'Failed to parse file: ' + error.message,
      text: ''
    });
  }
});

module.exports = router;

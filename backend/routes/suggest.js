const express = require('express');
const router = express.Router();

// Mock suggestions for demo purposes
const mockSuggestions = {
  rewrite: [
    "Developed and maintained responsive web applications using React and Node.js",
    "Implemented robust backend APIs with Express.js and MongoDB integration",
    "Collaborated with cross-functional teams to deliver high-quality software solutions",
    "Optimized application performance resulting in 40% faster load times"
  ],
  enhance: [
    "Add specific metrics and numbers to quantify your achievements",
    "Include relevant technologies and frameworks you used",
    "Mention the impact of your work on business outcomes",
    "Highlight leadership and collaboration skills"
  ],
  keywords: [
    "JavaScript", "React", "Node.js", "Express", "MongoDB", 
    "API Development", "Agile", "Git", "CI/CD", "AWS"
  ]
};

// POST /api/suggest/rewrite
router.post('/rewrite', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Use OpenAI if API key is available, otherwise return mock data
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      // TODO: Implement OpenAI integration
      console.log('Using OpenAI API...');
    }

    // Return mock suggestions for now
    res.json({
      original: text,
      suggestions: mockSuggestions.rewrite,
      type: 'rewrite'
    });

  } catch (error) {
    console.error('Error in rewrite endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/suggest/enhance
router.post('/enhance', async (req, res) => {
  try {
    const { text } = req.body;
    
    res.json({
      original: text,
      suggestions: mockSuggestions.enhance,
      type: 'enhance'
    });

  } catch (error) {
    console.error('Error in enhance endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/suggest/keywords
router.post('/keywords', async (req, res) => {
  try {
    const { jobDescription } = req.body;
    
    res.json({
      jobDescription,
      keywords: mockSuggestions.keywords,
      type: 'keywords'
    });

  } catch (error) {
    console.error('Error in keywords endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

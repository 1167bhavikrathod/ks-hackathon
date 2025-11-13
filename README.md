# Resume Builder

AI-powered resume builder with React frontend and Express backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (LTS) - Download from [nodejs.org](https://nodejs.org)
- Git (optional) - Download from [git-scm.com](https://git-scm.com)

### Installation & Setup

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```
   Or manually:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```
   Or use the PowerShell script:
   ```powershell
   .\manager.ps1 dev
   ```

3. **Open in browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 📁 Project Structure

```
resume-builder-windsurf/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── ResumeEditor.jsx
│   │   │   ├── SuggestionPane.jsx
│   │   │   ├── ScoreCard.jsx
│   │   │   └── ExportButton.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/           # Express API server
│   ├── routes/
│   │   └── suggest.js
│   ├── index.js
│   ├── .env
│   └── package.json
├── package.json       # Root manager
└── manager.ps1        # Windows helper script
```

## 🎯 Features

- **Resume Editor**: Add personal info, work experience, education
- **AI Suggestions**: Get AI-powered content improvements
- **Real-time Scoring**: Resume completeness analysis
- **Export Options**: PDF and JSON export
- **Modern UI**: Built with React + TailwindCSS

## 🛠 Available Scripts

```bash
npm run dev          # Start both frontend & backend
npm run install-all  # Install all dependencies
npm run build        # Build frontend for production
npm run start        # Start production server
```

## 🔧 Configuration

### Backend Environment (.env)
```env
PORT=4000
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### API Endpoints
- `GET /` - Health check
- `POST /api/suggest/rewrite` - Rewrite text suggestions
- `POST /api/suggest/enhance` - Enhancement tips
- `POST /api/suggest/keywords` - Keyword suggestions

## 🧪 Testing

Test the backend API:
```bash
curl http://localhost:4000/
curl -X POST http://localhost:4000/api/suggest/rewrite \
  -H "Content-Type: application/json" \
  -d '{"text":"maintained company website"}'
```

## 📦 Dependencies

### Frontend
- React 18
- Vite
- TailwindCSS
- Lucide React (icons)
- html2pdf.js

### Backend
- Express
- CORS
- dotenv
- OpenAI (optional)

## 🚨 Troubleshooting

- **CORS errors**: Check FRONTEND_URL in backend .env
- **Port conflicts**: Change PORT in backend .env
- **Missing dependencies**: Run `npm run install-all`
- **OpenAI errors**: Set OPENAI_API_KEY or use mock mode

## 📝 Usage

1. **Load Demo Data**: Click "Load Demo Data" for quick testing
2. **Add Experience**: Use "+ Add Experience" button
3. **Get AI Suggestions**: Select text and click suggestion buttons
4. **Export Resume**: Use "Export PDF" or "Save JSON" buttons

Built with ❤️ using Windsurf AI

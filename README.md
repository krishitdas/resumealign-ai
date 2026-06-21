# ResumeAlign AI

**AI-Powered Resume Bullet Point Rewriter**

ResumeAlign AI helps job seekers tailor their resumes to specific job descriptions. Paste a job description and your existing bullet points, select a rewrite style, and get ATS-optimized results — complete with keyword analysis, missing skills detection, and a match score.

---

## Features

- **AI-Powered Rewriting** — Rewrites resume bullet points using Google Gemini to align with job descriptions while preserving truthfulness.
- **ATS Match Score** — Provides a 0-100 compatibility score based on keyword overlap, action verbs, and role alignment.
- **Keyword Extraction** — Identifies important keywords and phrases from the job description.
- **Missing Skills Detection** — Highlights skills or technologies mentioned in the job description but missing from your resume.
- **Improvement Suggestions** — Actionable recommendations to strengthen your resume.
- **Multiple Rewrite Styles** — Professional, Technical, Leadership, and Impact Focused modes.
- **Copy & Download** — One-click copy to clipboard or download as a text file.
- **Responsive Design** — Works on desktop, tablet, and mobile devices.
- **Modern UI** — Dark theme with glassmorphism, smooth animations, and a clean layout inspired by Linear, Vercel, and Notion.

---

## Tech Stack

| Layer      | Technology                       |
|------------|----------------------------------|
| Frontend   | React 19, Vite, CSS Modules      |
| Backend    | Node.js, Express (dev), Vercel Serverless Functions (prod) |
| AI         | Google Gemini API (gemini-2.0-flash)  |
| Deployment | Vercel                           |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/resumealign-ai.git
cd resumealign-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Setup

Edit the `.env` file and add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

### Development

```bash
# Start both frontend and backend dev servers
npm run dev
```

This runs:
- **Frontend** at `http://localhost:5173` (Vite)
- **API Server** at `http://localhost:3001` (Express)

The Vite dev server proxies `/api/*` requests to the Express server.

### Production Build

```bash
npm run build
```

---

## Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add the `GEMINI_API_KEY` environment variable in Vercel project settings.
4. Deploy — Vercel will automatically detect the Vite framework and `/api` serverless functions.

The `vercel.json` configuration is already included in the project.

---

## Project Structure

```
├── api/                     # Vercel Serverless Functions
│   ├── rewrite.js           # POST /api/rewrite endpoint
│   └── utils/
│       └── prompt.js        # Gemini prompt builder
├── src/                     # React frontend
│   ├── components/          # Reusable UI components
│   │   ├── Button/
│   │   ├── ErrorMessage/
│   │   ├── Footer/
│   │   ├── Header/
│   │   ├── LoadingSkeleton/
│   │   ├── ResultsPanel/
│   │   ├── StyleSelector/
│   │   └── TextArea/
│   ├── hooks/               # Custom React hooks
│   │   └── useRewrite.js
│   ├── pages/               # Page components
│   │   └── Home/
│   ├── services/            # API service layer
│   │   └── api.js
│   ├── styles/              # Global styles and design tokens
│   │   ├── design-tokens.css
│   │   └── global.css
│   ├── utils/               # Utility functions
│   │   ├── export.js
│   │   └── validation.js
│   ├── App.jsx
│   └── main.jsx
├── server.js                # Express dev server
├── vercel.json              # Vercel configuration
├── .env.example             # Environment template
└── README.md
```

---

## Screenshots

_Screenshots will be added after deployment._

---

## Future Improvements

- Multiple resume versions and history
- PDF upload and parsing
- Side-by-side before/after comparison
- Batch processing multiple job descriptions
- User accounts with saved preferences
- Dark/light theme toggle
- Export to PDF and DOCX formats
- Integration with LinkedIn profile data

---

## License

MIT

---

Built with React, Vite, and Google Gemini AI.

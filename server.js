import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rewriteHandler from './api/rewrite.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// API routes
app.post('/api/rewrite', (req, res) => rewriteHandler(req, res));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});

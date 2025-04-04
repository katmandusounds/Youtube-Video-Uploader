import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Add health check endpoint
app.get('/', (req, res) => {
  res.send('YouTube OAuth Server is running!');
});

// Handle the OAuth callback
app.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      throw new Error('No code provided');
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code as string);
    console.log('Received tokens:', {
      access_token: tokens.access_token ? 'present' : 'missing',
      refresh_token: tokens.refresh_token ? 'present' : 'missing'
    });

    // Store refresh token securely (in a real app, save to database)
    if (tokens.refresh_token) {
      console.log('Refresh token received');
    }

    // Redirect back to frontend with access token
    res.redirect(`${process.env.FRONTEND_URL}?access_token=${tokens.access_token}`);
  } catch (error) {
    console.error('Auth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
  }
});

app.post('/auth/google/token', async (req, res) => {
  try {
    const { code } = req.body;
    const { tokens } = await oauth2Client.getToken(code);
    res.json({ access_token: tokens.access_token });
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

// Fix: Convert PORT to number
const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}); 
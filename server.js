const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 5000;

// CORS for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); // Added GET for our new endpoint
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Gracefully handle malformed JSON bodies
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid contact information."
    });
  }
  next();
});

// Configure rate limiter for the contact endpoint (max 5 requests per 15 minutes per IP)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                   // limit each IP to 5 requests per windowMs
  standardHeaders: true,    // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,     // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many contact submissions from this IP, please try again after 15 minutes."
  }
});

// Helper function to validate email format
const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  // Standard regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// POST /api/contact endpoint with rate limiting applied
app.post('/api/contact', contactLimiter, (req, res) => {
  const { name, email, message } = req.body;

  // Validation rules:
  // - name, email, and message are required.
  // - name must contain at least 2 characters.
  // - email must be a valid email address.
  // - message must contain at least 10 characters.
  if (
    typeof name !== 'string' || name.trim().length < 2 ||
    !isValidEmail(email) ||
    typeof message !== 'string' || message.trim().length < 10
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid contact information."
    });
  }

  // Return success response if validation passes
  return res.status(200).json({
    success: true,
    message: "Your message has been received successfully."
  });
});

// =================================================================
// 💥 NEW ENDPOINT: AI Style Match Engine (Issue #450) 💥
// =================================================================
app.get('/api/recommendations/style', (req, res) => {
  const { productId, style } = req.query;

  // TODO: Wire this up to a real Vector DB or AI recommendation engine later.
  // For now, we return highly curated mock data to power the React component.
  
  const mockRecommendations = [
      {
          id: 'rec-1',
          name: 'Geometric Wool Rug',
          category: 'Decor',
          price: 120.00,
          image: 'images/flower-vase.webp' 
      },
      {
          id: 'rec-2',
          name: 'Aura Pendant Lamp',
          category: 'Lighting',
          price: 85.00,
          image: 'images/hanging lamp.webp'
      },
      {
          id: 'rec-3',
          name: 'Walnut Side Table',
          category: 'Tables',
          price: 150.00,
          image: 'images/side table.webp'
      },
      {
          id: 'rec-4',
          name: 'Modern Accent Chair',
          category: 'Seating',
          price: 210.00,
          image: 'images/modern chair.webp'
      }
  ];

  // Simulate a slight network delay so the frontend skeleton loaders look natural
  setTimeout(() => {
      res.status(200).json({ items: mockRecommendations });
  }, 1200);
});

// START THE SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

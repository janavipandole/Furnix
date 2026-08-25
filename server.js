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

// POST /api/subscribe endpoint for newsletter subscriptions
app.post('/api/subscribe', contactLimiter, (req, res) => {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address."
    });
  }

  return res.status(200).json({
    success: true,
    message: "Thank you for subscribing to Furnix updates!"
  });
});

// POST /api/eco/impact endpoint
app.post('/api/eco/impact', (req, res) => {
  const { amount, category } = req.body;
  const numAmount = Number(amount);

  if (isNaN(numAmount) || numAmount < 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid numeric order or item amount."
    });
  }

  const catFactors = {
    seating: 14.5,
    tables: 18.2,
    lighting: 8.0,
    storage: 16.0,
    accessories: 4.5
  };

  const catKey = (category || 'seating').toLowerCase();
  const factor = catFactors[catKey] || 12.0;
  const co2Kg = (numAmount / 100) * factor;
  const trees = Math.max(1, Math.ceil(co2Kg / 22.0));
  const offsetFee = Math.max(0.99, co2Kg * 0.05);

  return res.status(200).json({
    success: true,
    data: {
      amount: Number(numAmount.toFixed(2)),
      category: catKey,
      estimatedCo2Kg: Number(co2Kg.toFixed(1)),
      treesPlanted: trees,
      offsetFee: Number(offsetFee.toFixed(2)),
      badge: "100% FSC-Certified Sustainable Sourcing"
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

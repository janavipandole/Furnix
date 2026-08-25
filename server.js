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

// POST /api/bulk-quote endpoint
app.post('/api/bulk-quote', (req, res) => {
  const { unitPrice, quantity, accountType } = req.body;
  const numPrice = Number(unitPrice);
  const numQty = Number(quantity);

  if (isNaN(numPrice) || numPrice < 0 || isNaN(numQty) || numQty < 1) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid unitPrice (>= 0) and quantity (>= 1)."
    });
  }

  let discountPercent = 0;
  let tierName = 'Standard Retail';

  if (numQty >= 25) {
    discountPercent = 22;
    tierName = 'Enterprise Wholesale';
  } else if (numQty >= 12) {
    discountPercent = 15;
    tierName = 'Commercial Project';
  } else if (numQty >= 6) {
    discountPercent = 10;
    tierName = 'Designer Suite';
  } else if (numQty >= 3) {
    discountPercent = 5;
    tierName = 'Studio Pack';
  }

  if (accountType === 'trade_pro') {
    discountPercent = Math.min(30, discountPercent + 3);
  } else if (accountType === 'wholesale') {
    discountPercent = Math.min(35, Math.max(discountPercent, 20));
  }

  const retailSubtotal = numPrice * numQty;
  const totalSavings = retailSubtotal * (discountPercent / 100);
  const discountedSubtotal = retailSubtotal - totalSavings;
  const effectiveUnitPrice = discountedSubtotal / numQty;

  return res.status(200).json({
    success: true,
    data: {
      unitPrice: Number(numPrice.toFixed(2)),
      quantity: Math.floor(numQty),
      accountType: accountType || 'standard',
      tierName,
      discountPercent,
      effectiveUnitPrice: Number(effectiveUnitPrice.toFixed(2)),
      retailSubtotal: Number(retailSubtotal.toFixed(2)),
      totalSavings: Number(totalSavings.toFixed(2)),
      discountedSubtotal: Number(discountedSubtotal.toFixed(2))
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

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

// POST /api/swatches/customize endpoint
app.post('/api/swatches/customize', (req, res) => {
  const { basePrice, materialId, baseSku } = req.body;
  const numBase = Number(basePrice);

  if (isNaN(numBase) || numBase < 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid numeric base price."
    });
  }

  const surchargeMap = {
    'mat-velvet-navy': 0,
    'mat-velvet-emerald': 25.00,
    'mat-boucle-cream': 45.00,
    'mat-linen-oatmeal': 15.00,
    'mat-leather-cognac': 180.00,
    'mat-leather-charcoal': 160.00,
    'mat-wood-walnut': 0,
    'mat-wood-oak': 20.00,
    'mat-wood-ebony': 35.00
  };

  const id = materialId || 'mat-velvet-navy';
  const surcharge = surchargeMap[id] !== undefined ? surchargeMap[id] : 0;
  const finalPrice = numBase + surcharge;
  const suffix = id.replace('mat-', '').toUpperCase();
  const sku = `${baseSku || 'FNX-PROD'}-${suffix}`;

  return res.status(200).json({
    success: true,
    data: {
      basePrice: Number(numBase.toFixed(2)),
      materialId: id,
      surcharge: Number(surcharge.toFixed(2)),
      finalPrice: Number(finalPrice.toFixed(2)),
      customSku: sku
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

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

// Helper function to validate email format
const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  // Standard regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// POST /api/contact endpoint
app.post('/api/contact', (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

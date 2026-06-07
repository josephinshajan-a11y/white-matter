const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    // Validation
    if (!name || !email || !service || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1d4ed8;">New Contact Form Submission</h2>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Service Interested:</strong> ${escapeHtml(service)}</p>
        
        <h3 style="color: #0f1f3d; margin-top: 20px;">Message:</h3>
        <p style="background: #f8faff; padding: 16px; border-left: 3px solid #1d4ed8; line-height: 1.6;">
          ${escapeHtml(message).replace(/\n/g, '<br>')}
        </p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          This message was sent from White Matter website contact form.
        </p>
      </div>
    `;

    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'josephinshajan@gmail.com',
      subject: `New Project Inquiry from ${name} - ${service}`,
      html: htmlContent,
      replyTo: email
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We received your message - White Matter',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1d4ed8;">Thank you for reaching out!</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>We've received your message and we're excited to learn more about your project.</p>
          <p>Our team will review your inquiry and get back to you within 24 hours at <strong>${escapeHtml(email)}</strong> or <strong>${escapeHtml(phone)}</strong>.</p>
          <p>In the meantime, feel free to check out our portfolio and blog for inspiration.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p>Best regards,<br><strong>The White Matter Team</strong></p>
          <p style="color: #999; font-size: 12px;">
            White Matter • Building Digital Ideas That Matter<br>
            +44 7553 779 990 | josephinshajan@gmail.com
          </p>
        </div>
      `
    });

    // Log submission
    const logEntry = `\n[${new Date().toISOString()}] ${name} (${email}) - ${service}`;
    fs.appendFileSync('submissions.log', logEntry);

    return res.json({ success: true, message: 'Message sent successfully' });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Blog management endpoints
app.get('/api/blogs', (req, res) => {
  const blogs = [
    {
      id: 1,
      title: 'How We Built a Fracture Detection AI and Deployed It on Mobile',
      date: 'May 15, 2025',
      category: 'AI & Machine Learning',
      excerpt: 'From training a VGG16 model on X-ray data to shipping a Flutter app...'
    },
    {
      id: 2,
      title: 'Flutter vs React Native in 2025',
      date: 'April 8, 2025',
      category: 'Mobile Development',
      excerpt: 'A practical comparison based on real projects...'
    },
    {
      id: 3,
      title: 'Django REST + Docker',
      date: 'March 22, 2025',
      category: 'Web Development',
      excerpt: 'Why we standardised on this combination...'
    },
    {
      id: 4,
      title: '5 Things Students Should Build Before Their First Dev Job',
      date: 'February 14, 2025',
      category: 'Career & Learning',
      excerpt: 'Practical projects that actually demonstrate skill...'
    }
  ];
  res.json(blogs);
});

// Portfolio endpoints
app.get('/api/projects', (req, res) => {
  const projects = [
    {
      id: 'radai',
      title: 'RadAI — Fracture Detection App',
      category: 'Mobile App · AI',
      description: 'AI-powered radiology app using VGG16 + Flutter'
    },
    {
      id: 'ellys',
      title: 'Ellys by Elizabeth',
      category: 'E-Commerce · Web',
      description: 'Fashion e-commerce platform with Stripe integration'
    },
    {
      id: 'whitematter',
      title: 'White Matter Company Site',
      category: 'Web · Branding',
      description: 'Corporate website with portfolio and blog'
    },
    {
      id: 'banking',
      title: 'Banking App UI',
      category: 'Mobile App · Flutter',
      description: 'Sleek mobile banking interface'
    }
  ];
  res.json(projects);
});

// Admin dashboard - list submissions
app.get('/api/submissions', (req, res) => {
  try {
    const log = fs.readFileSync('submissions.log', 'utf8');
    const entries = log.split('\n').filter(line => line.trim());
    res.json({ submissions: entries });
  } catch (error) {
    res.json({ submissions: [] });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: 'Server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✓ White Matter Backend Server Running`);
  console.log(`  Port: http://localhost:${PORT}`);
  console.log(`  Email: ${process.env.EMAIL_USER || 'Not configured'}`);
  console.log(`  CORS enabled for all origins\n`);
});

// Helper function
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

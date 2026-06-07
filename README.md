# White Matter — Complete Setup Guide

## 📦 Project Structure

```
whitematter-fullstack/
├── frontend/
│   └── index.html          # Complete single-page website
├── backend/
│   ├── server.js           # Node.js/Express backend
│   ├── package.json        # Dependencies
│   ├── .env               # Configuration (Gmail setup)
│   └── .gitignore         # Git ignore rules
└── README.md              # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- Gmail account with app-specific password
- Terminal/Command line access

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Gmail (CRITICAL)

The contact form sends emails to `josephinshajan@gmail.com`. You need to set up Gmail authentication:

**Step 1: Enable 2-Factor Authentication**
1. Go to myaccount.google.com
2. Click "Security" in left menu
3. Find "2-Step Verification" and enable it
4. Complete the verification process

**Step 2: Generate App Password**
1. Go to myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your OS)
3. Google will generate a 16-character password
4. Copy this password

**Step 3: Update .env File**
```
EMAIL_USER=josephinshajan@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  (paste the 16-char password here)
```

### 3. Run Backend Server

```bash
npm start
```

You should see:
```
✓ White Matter Backend Server Running
  Port: http://localhost:5000
  Email: josephinshajan@gmail.com
```

### 4. Open Frontend

Open `frontend/index.html` in your browser, or serve it:

```bash
# If you have Python 3 installed:
cd frontend
python -m http.server 8000

# Then visit: http://localhost:8000
```

---

## 📋 Features Included

### ✅ Contact Form
- Sends to: josephinshajan@gmail.com
- Phone: +44 7553 779 990
- Automatic confirmation email to submitter
- All fields validated
- Nice success/error messages

### ✅ Portfolio Section
- 4 projects with detailed modals
- Click any project to see full details
- Customizable project content in `server.js`
- Images and descriptions for each project

### ✅ Blog System
- 4 sample blog posts included
- Click "Read Article" or "Read" to open full post
- Full content displayed in modal
- Easy to add new blogs (see below)

### ✅ Responsive Design
- Mobile-friendly layout
- Works on phones, tablets, desktops
- All sections properly styled
- Smooth animations and transitions

---

## 📝 How to Add New Content

### Adding a New Blog Post

1. **Edit backend/server.js**

Find the `app.get('/api/blogs')` endpoint (around line 120) and add to the blogs array:

```javascript
{
  id: 5,
  title: 'Your Blog Title Here',
  date: 'June 2025',
  category: 'Your Category',
  excerpt: 'Short preview text...'
}
```

2. **Add full blog content to frontend modal**

In `index.html`, find the `openBlogModal()` function (around line 550) and add:

```javascript
5: {
  title: 'Your Blog Title Here',
  date: 'June 2025',
  category: 'Your Category',
  content: `
    <div class="blog-detail-content">
      <h2>Main Heading</h2>
      <p>Your blog content here...</p>
      <h3>Subheading</h3>
      <p>More content...</p>
    </div>
  `
}
```

3. **Add blog card to HTML**

In the blog section (around line 430), add a new card:

```html
<div class="blog-card" onclick="openBlogModal(5)">
  <div class="blog-image small" style="background: linear-gradient(135deg, #0f1f3d 0%, #1d4ed8 100%);"><span class="blog-cat-badge">Your Category</span></div>
  <div class="blog-body">
    <div class="blog-meta"><span class="blog-date">June 2025</span><span class="blog-read-time">X min read</span></div>
    <h3 class="blog-title">Your Blog Title Here</h3>
    <a href="#" class="blog-read-btn">Read →</a>
  </div>
</div>
```

### Updating Portfolio Projects

Similar process in `server.js` around line 105 - update the `openProjectModal()` function with your project details.

---

## 🔧 Contact Form Flow

```
1. User fills form on website
   ↓
2. Frontend validates fields
   ↓
3. Data sent to backend (POST /api/contact)
   ↓
4. Backend validates again
   ↓
5. Email sent to josephinshajan@gmail.com
   ↓
6. Confirmation email sent to user
   ↓
7. Submission logged to submissions.log
   ↓
8. Success message shown to user
```

---

## 📧 Email Configuration Reference

### Sending Email (from form)
- **To:** josephinshajan@gmail.com
- **From:** josephinshajan@gmail.com
- **Subject:** "New Project Inquiry from [Name] - [Service]"
- **Includes:** All form data in formatted HTML email

### Confirmation Email (to user)
- **To:** User's email (from form)
- **Subject:** "We received your message - White Matter"
- **Content:** Thank you message with contact details

---

## 🐳 Docker Deployment (Optional)

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t white-matter-backend .
docker run -p 5000:5000 --env-file .env white-matter-backend
```

---

## 🌐 Deploying to Production

### Backend Options

**Option 1: Heroku**
1. Create Heroku account
2. Install Heroku CLI
3. Run: `heroku create white-matter-api`
4. Set env vars: `heroku config:set EMAIL_PASS=xxxx`
5. Deploy: `git push heroku main`

**Option 2: AWS Elastic Beanstalk**
1. Install AWS CLI
2. Run: `eb init`
3. Configure your app
4. Deploy: `eb create`

**Option 3: DigitalOcean**
1. Create droplet
2. Install Node.js
3. Clone repository
4. Install dependencies
5. Set up PM2 for process management
6. Point domain to your droplet

### Frontend Options

**Option 1: Vercel**
- Upload `frontend/index.html` to Vercel
- Free hosting, automatic HTTPS
- CDN for fast delivery

**Option 2: Netlify**
- Same as Vercel
- Drag & drop deployment

**Option 3: GitHub Pages**
- Free with GitHub account
- Perfect for static HTML

---

## 🔐 Security Checklist

- [ ] Gmail: Use app-specific password (not main password)
- [ ] Backend: Never commit `.env` file
- [ ] Frontend: No API keys in HTML
- [ ] Forms: Server-side validation (already done)
- [ ] CORS: Configured for your domain
- [ ] HTTPS: Use SSL certificate in production

---

## 🐛 Troubleshooting

### "Connection refused" on port 5000
- Backend not running
- Solution: Run `npm start` in backend folder

### Emails not sending
- Gmail app password incorrect
- 2FA not enabled on Gmail account
- Solution: Follow Gmail setup steps above carefully

### Form shows "Network error"
- Backend server not running
- CORS issue
- Solution: Check backend is running and `localhost:5000` is accessible

### Modals not opening
- JavaScript error
- Solution: Check browser console (F12 > Console tab)

---

## 📞 Quick Reference

**Contact Details:**
- Phone: +44 7553 779 990
- Email: josephinshajan@gmail.com

**Server URLs:**
- Frontend: http://localhost:8000 (or port where served)
- Backend: http://localhost:5000
- API: http://localhost:5000/api/

**Key Endpoints:**
- POST /api/contact - Submit contact form
- GET /api/blogs - List all blogs
- GET /api/projects - List all projects
- GET /api/health - Server status

---

## 📚 File Guide

| File | Purpose |
|------|---------|
| frontend/index.html | Complete website (all sections, styles, JS) |
| backend/server.js | Express server, email, API endpoints |
| backend/package.json | Node dependencies |
| backend/.env | Gmail configuration |
| submissions.log | Contact form submissions log |

---

## ✅ You're Ready!

Everything is configured and ready to go. The website:
- ✅ Has working contact form with email
- ✅ Displays portfolio projects with details
- ✅ Shows blog posts with full content
- ✅ Is fully responsive
- ✅ Has smooth animations
- ✅ Validates all forms
- ✅ Sends confirmation emails

Edit the content, add new blogs/projects, deploy, and you're live!

---

## 📞 Support

Having issues? Check:
1. Browser console for JavaScript errors (F12)
2. Backend terminal for server errors
3. Gmail account has 2FA and app password set
4. .env file has correct email credentials
5. Node.js and npm are installed (node -v, npm -v)

---

**Last Updated:** June 2025
**Version:** 1.0.0
**Status:** Production Ready ✅

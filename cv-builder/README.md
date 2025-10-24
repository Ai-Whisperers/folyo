# 🎯 CV Builder Pro - Professional CV Service

Transform the Jekyll CV template into a modern, user-friendly web service for creating professional CVs.

## ✨ Features

- **🎨 Real-time Preview** - See your changes instantly as you type
- **🖌️ 8 Professional Themes** - Choose from beautiful color schemes
- **📱 Mobile Responsive** - Works perfectly on all devices
- **💾 Auto-save** - Your work is automatically saved as you go
- **📤 Multiple Export Formats** - PDF, JSON, and YAML exports
- **🔧 Jekyll Integration** - Export to Jekyll-compatible YAML
- **⚡ Fast & Modern** - Built with Next.js and Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to CV Builder directory
cd cv-builder

# Install dependencies
npm install

# Start development servers (frontend + backend)
npm run dev

# Or start individually:
npm run dev:client  # Frontend on port 3000
npm run dev:server  # Backend API on port 5000
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health
- **CV Builder**: http://localhost:3000/builder

## 📋 API Endpoints

### Health & Info
- `GET /api/health` - Server health check
- `GET /api/themes` - Available CV themes

### CV Management
- `POST /api/cv/save` - Save CV data
- `GET /api/cv/:cvId` - Load CV by ID
- `POST /api/cv/generate-site` - Generate Jekyll site

### Export Options
- `POST /api/cv/export/yaml` - Export as Jekyll YAML
- `POST /api/cv/export/json` - Export as JSON
- `GET /api/placeholder/:width/:height` - Placeholder images

## 🏗️ Architecture

### Frontend (Next.js)
```
app/
├── layout.tsx          # Root layout
├── page.tsx           # Landing page
├── builder/
│   └── page.tsx       # CV Builder interface
└── globals.css        # Global styles

components/
├── CVBuilderForm.tsx  # Form interface
├── CVPreview.tsx      # Real-time preview
├── ThemeSwitcher.tsx  # Theme selection
├── SaveButton.tsx     # Save functionality
└── ExportButton.tsx   # Export options
```

### Backend (Express.js)
```
server.js              # API server
├── Health checks
├── CV data management
├── Export functionality
└── Jekyll integration
```

## 🎨 Available Themes

| Theme | Color | Use Case |
|-------|-------|----------|
| Professional Blue | #2E86AB | Corporate, Business |
| Modern Turquoise | #17a2b8 | Tech, Startups |
| Fresh Green | #28a745 | Environment, Health |
| Creative Berry | #8e44ad | Design, Creative |
| Vibrant Orange | #fd7e14 | Marketing, Sales |
| Warm Ceramic | #d4926d | Consulting, Education |
| Cool Teal | #20c997 | Finance, Analytics |
| Neutral Gray | #6c757d | Conservative, Legal |

## 📊 Data Structure

The CV data follows the Jekyll template structure:

```yaml
theme_skin: teal
sidebar:
  name: "Your Name"
  tagline: "Your Professional Title"
  email: "your.email@example.com"
  # ... more fields
experiences:
  info:
    - role: "Job Title"
      company: "Company Name"
      time: "Duration"
      details: "Job description..."
# ... more sections
```

## 🔧 Development

### Adding New Themes
1. Add theme to `tailwind.config.js`
2. Update `ThemeSwitcher.tsx` component
3. Add theme colors to API `/api/themes`

### Adding New Sections
1. Update CV data structure
2. Add form fields in `CVBuilderForm.tsx`
3. Update preview in `CVPreview.tsx`

### Testing
```bash
npm test         # Run all tests
npm run test:watch  # Watch mode
```

## 📈 Roadmap

### Phase 1: MVP ✅
- [x] Basic CV builder interface
- [x] Real-time preview
- [x] Theme switching
- [x] Export functionality
- [x] Auto-save feature

### Phase 2: Enhanced Features
- [ ] User authentication
- [ ] Cloud storage integration
- [ ] PDF generation
- [ ] AI content suggestions
- [ ] ATS optimization

### Phase 3: Advanced
- [ ] Team collaboration
- [ ] Custom domains
- [ ] Analytics dashboard
- [ ] API for developers

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel, Netlify, or similar
```

### Backend (Railway/Heroku)
```bash
# Set environment variables
PORT=5000
NODE_ENV=production

# Deploy server.js
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🎯 Business Model

- **Freemium**: Basic features free, premium features paid
- **Pricing Tiers**: 
  - Free: Basic templates, watermark
  - Pro ($9/month): Premium themes, custom domain
  - Business ($29/month): Team features, analytics

---

**Built with ❤️ using the Jekyll CV Template foundation**
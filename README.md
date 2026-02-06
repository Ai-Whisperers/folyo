# 🎯 Folyo - Professional Portfolio & CV Builder

Create stunning, shareable web portfolios with real-time preview, beautiful themes, and multiple export options.

## ✨ Features

- **🎨 Real-time Preview** - See your changes instantly as you type
- **🖌️ Professional Color Palettes** - Choose from beautiful, curated color schemes
- **📱 Mobile Responsive** - Works perfectly on all devices
- **💾 Auto-save** - Your work is automatically saved as you go
- **📤 Multiple Export Formats** - PDF, JSON, and YAML exports
- **🔗 Shareable Links** - Get a unique URL for your portfolio
- **📊 QR Codes** - Share your portfolio with QR codes
- **⚡ Fast & Modern** - Built with Next.js 14 and Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Application

- **Home**: http://localhost:3000
- **CV Builder**: http://localhost:3000/builder
- **Templates**: http://localhost:3000/templates
- **Demo CV**: http://localhost:3000/cv/demo

## 🏗️ Architecture

```
app/
├── layout.tsx          # Root layout with Navbar/Footer
├── page.tsx            # Landing page
├── builder/
│   └── page.tsx        # CV Builder interface
├── cv/[slug]/
│   └── page.tsx        # Public CV display
├── templates/
│   └── page.tsx        # Template & color selection
└── globals.css         # Global styles

components/
├── cv/
│   ├── CVBuilderForm.tsx   # Form interface
│   ├── CVPreview.tsx       # Real-time preview
│   └── sections/           # Form sections
├── common/
│   ├── ThemeSwitcher.tsx   # Theme selection
│   ├── Navbar.tsx          # Navigation
│   └── Footer.tsx          # Footer
└── ui/                     # UI components

data/portfolios/            # Static portfolio JSON files
```

## 🎨 Color Palettes

### Professional
| Name | Primary | Use Case |
|------|---------|----------|
| Navy Executive | #1e3a5f | Corporate, Finance |
| Charcoal Pro | #2d3748 | Legal, Consulting |
| Forest Professional | #1a472a | Environment, Healthcare |

### Vibrant
| Name | Primary | Use Case |
|------|---------|----------|
| Electric Teal | #0d9488 | Tech, Startups |
| Sunset Coral | #f97316 | Creative, Marketing |
| Royal Purple | #7c3aed | Design, Arts |

### Neutral & Dark
| Name | Primary | Use Case |
|------|---------|----------|
| Warm Stone | #78716c | Architecture, Consulting |
| Midnight | #0f172a | Developer, Tech |
| Deep Ocean | #164e63 | Marine, Environment |

## 📊 Portfolio Data Structure

Portfolios are stored as JSON files in `data/portfolios/`:

```json
{
  "slug": "your-name",
  "color_palette": "teal",
  "sidebar": {
    "name": "Your Name",
    "tagline": "Your Professional Title",
    "email": "your.email@example.com",
    "linkedin": "your-linkedin",
    "github": "your-github"
  },
  "career_profile": {
    "title": "About Me",
    "summary": "Your professional summary..."
  },
  "experiences": [...],
  "education": [...],
  "skills": [...],
  "projects": [...]
}
```

## 🔧 Development

### Adding New Color Palettes
1. Add palette to `lib/templates.ts`
2. Update theme utilities in `lib/utils/theme.ts`

### Adding New Portfolio
1. Create JSON file in `data/portfolios/your-name.json`
2. Access at `http://localhost:3000/cv/your-name`

### Testing
```bash
npm test              # Run all tests
npm run test:e2e      # Run E2E tests with Playwright
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

### Vercel (Recommended)
```bash
npm run build
# Connect repo to Vercel for automatic deployments
```

### Environment Variables
```bash
MONGODB_URI=your_mongodb_connection_string  # Optional: for database
NEXTAUTH_SECRET=your_secret                 # For authentication
NEXTAUTH_URL=https://your-domain.com
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

**Built with ❤️ by [Ai-Whisperers](https://github.com/Ai-Whisperers)**
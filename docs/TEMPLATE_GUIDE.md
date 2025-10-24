# 📄 Online CV Template Guide

This Jekyll template is based on Kyrian Weiss van der Pol's professional CV and has been converted into a reusable template for anyone to create their own online resume.

## 🚀 Quick Start

### Prerequisites
- Ruby (2.7+)
- Bundler gem
- Git

### Setup

1. **Fork/Clone this repository**
   ```bash
   git clone https://github.com/yourusername/online-cv-template.git
   cd online-cv-template
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Run locally**
   ```bash
   bundle exec jekyll serve
   ```
   Visit `http://localhost:4000` to see your CV


## 🎨 Customization

### 1. Basic Configuration (`_config.yml`)

Update these essential settings:

```yaml
title: "Your Name - Online CV"
url: 'https://yourusername.github.io'
baseurl: '/your-repo-name'  # Your repository name
description: "Professional online CV and portfolio"
theme_skin: teal  # Choose: blue, turquoise, green, berry, orange, ceramic, teal, oceanstale
analytics: # Your Google Analytics ID (optional)
```

### 2. Personal Information (`_data/data.yml`)

Replace the template data with your information:

#### Profile Section
```yaml
sidebar:
  name: Your Full Name
  tagline: Your Professional Title | Your Expertise
  avatar: your-photo.jpg  # Place in assets/images/
  email: your.email@example.com
  phone: '+1 (555) 123-4567'
  # ... other contact info
```

#### Career Profile
Write a compelling 2-3 paragraph summary highlighting:
- Your professional background
- Key achievements and skills  
- Career goals and value proposition

#### Experience Section
For each job, include:
- Role title and company
- Employment dates
- Detailed accomplishments (use bullet points)
- Relevant technologies/skills
- Quantifiable achievements where possible

#### Projects Section
Showcase your best work:
- Project name and timeframe
- Technologies used
- Key features and impact
- Links to live demos or repositories

### 3. Assets

#### Profile Picture
- Add your professional headshot to `assets/images/`
- Recommended: 400x400px, professional quality
- Update the `avatar` field in `data.yml`

#### Resume PDF (Optional)
- Add your PDF resume to `assets/images/`
- Update the `pdf` field in `data.yml`

## 🎯 Professional Tips

### Content Writing
- **Use action verbs**: "Developed", "Implemented", "Led", "Optimized"
- **Quantify achievements**: "Increased efficiency by 30%", "Managed team of 5"
- **Include keywords**: Relevant to your industry for SEO
- **Keep it concise**: Clear, scannable bullet points

### Design Customization
- **Choose appropriate theme**: Professional colors for your industry
- **Organize sections**: Most relevant information first
- **Use consistent formatting**: Same style for dates, titles, etc.
- **Mobile-friendly**: Template is responsive by default

## 🚀 Deployment

### GitHub Pages
1. Push your customized code to GitHub
2. Go to repository Settings > Pages
3. Select source: Deploy from branch `main`
4. Your CV will be available at `https://yourusername.github.io/repo-name`

### Custom Domain (Optional)
1. Add `CNAME` file with your domain name
2. Configure DNS settings with your domain provider
3. Enable HTTPS in GitHub Pages settings

## 📋 Example Configurations

### Software Developer
```yaml
tagline: Full-Stack Developer | React & Node.js Specialist
interests:
  - Software Architecture
  - Open Source Projects
  - DevOps & CI/CD
  - Code Mentoring
```

### Data Scientist
```yaml
tagline: Data Scientist | Machine Learning & Analytics Expert
interests:
  - Machine Learning
  - Data Visualization
  - Statistical Analysis
  - AI Research
```

### QA Engineer
```yaml
tagline: QA Engineer | Test Automation & Quality Assurance
interests:
  - Test Automation
  - Agile Methodologies
  - Performance Testing
  - Process Improvement
```

## 🛠 Advanced Customization

### Adding New Sections
1. Create new include file in `_includes/`
2. Add corresponding data structure in `data.yml`
3. Include in `index.html` or layouts

### Modifying Styles
- Main styles: `_sass/_base.scss`
- Theme colors: `_sass/skins/_[theme].scss`
- Custom CSS: Add to `assets/css/main.scss`

### Icons and Styling
- Uses Font Awesome icons
- Bootstrap components available
- Liquid templating for dynamic content

## 🐛 Troubleshooting

### Common Issues
1. **Site not loading**: Check `baseurl` in `_config.yml`
2. **Images not showing**: Verify file paths in `assets/images/`
3. **Styling issues**: Clear browser cache, restart Jekyll server
4. **Build errors**: Check YAML syntax in configuration files

### Local Development
```bash
# Clean build
bundle exec jekyll clean

# Build with verbose output
bundle exec jekyll build --verbose

# Serve with live reload
bundle exec jekyll serve --livereload
```

## 📝 Content Checklist

Before publishing, ensure you have:

- [ ] Updated all placeholder text with your information
- [ ] Added your professional profile picture
- [ ] Reviewed all contact information for accuracy
- [ ] Spell-checked all content
- [ ] Tested all external links
- [ ] Optimized for mobile viewing
- [ ] Added relevant keywords for SEO

## 🤝 Contributing

Found a bug or have a feature suggestion? Please open an issue or submit a pull request.

## 📄 License

This template is open source. Feel free to use it for your personal CV.

---

**Good luck with your job search!** 🚀
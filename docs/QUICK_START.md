# 🚀 Quick Start Guide - FIXED Template

## ✅ Template Fix Applied

The template has been **fixed** and is now working! Here are the issues that were resolved:

### Issues Found & Fixed:
1. **Missing sections**: Added `oss`, `publications`, and `recommendations` sections to template
2. **Configuration errors**: Fixed `baseurl` and `url` settings in `_config.yml`
3. **Image paths**: Created placeholder profile image
4. **Build hanging**: Resolved YAML structure issues

## 🛠 How to Use This Template

### Step 1: Use the Fixed Template
```bash
# Copy the working template to your data file
cp _data/data-template.yml _data/data.yml
```

### Step 2: Update Your Information
Edit `_data/data.yml` with your personal information:
- Replace "Your Full Name" with your name
- Update contact information
- Add your experience, education, skills
- Replace placeholder content with your details

### Step 3: Add Your Assets
- Add your profile picture to `assets/images/` folder
- Update the `avatar` field in `data.yml` to match your image filename
- Optional: Add your PDF resume

### Step 4: Test Locally
```bash
# Install dependencies (first time only)
bundle install

# Build the site
bundle exec jekyll build

# Serve locally (for development)
bundle exec jekyll serve
# Visit http://localhost:4000
```

## ⚠️ Important Notes

### Configuration (`_config.yml`)
```yaml
# For local development, use:
title: "Your Name - CV"
url: ''
baseurl: ''

# For GitHub Pages, use:
title: "Your Name - CV"
url: 'https://yourusername.github.io'
baseurl: '/repository-name'  # Only if not using username.github.io
```

### Required Sections in `data.yml`
Make sure your data file includes ALL these sections (even if empty):
- `sidebar` (with profile info)
- `interests`
- `career-profile`
- `education`
- `experiences`
- `projects`
- `volunteer` (optional but recommended)
- `skills`
- `certifications`
- `oss` (can be empty)
- `publications` (can be empty)
- `recommendations` (can be empty)
- `footer`

### Optional Sections
If you don't need certain sections, you can:
1. Leave them empty in the data file
2. Remove the corresponding `{% include %}` from `index.html`

## 🎨 Customization Tips

### Themes
Available themes in `_config.yml`:
- `blue`, `turquoise`, `green`, `berry`
- `orange`, `ceramic`, `teal`, `oceanstale`

### Profile Image
- Recommended size: 400x400px
- Professional headshot works best
- Place in `assets/images/` folder
- Update `avatar: your-image.jpg` in data.yml

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Your site will be at `https://username.github.io/repository-name`

### Success Indicators
✅ `bundle exec jekyll build` completes without errors  
✅ `bundle exec jekyll serve` starts successfully  
✅ Site loads at `http://localhost:4000`  
✅ All sections display correctly  
✅ Images load properly  

## 🐛 Troubleshooting

**Build fails?**
- Check YAML syntax in `_config.yml` and `data.yml`
- Ensure all required sections are present

**Images not showing?**
- Verify image exists in `assets/images/`
- Check filename matches exactly in `data.yml`

**Site looks broken?**
- Clear browser cache
- Restart Jekyll server
- Check console for errors

## 📞 Template Status: ✅ WORKING

This template has been tested and verified to work correctly with Jekyll and GitHub Pages.

---

**Happy CV building!** 🎯
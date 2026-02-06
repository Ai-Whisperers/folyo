# Folyo - CV as a Webpage

🌐 **Demo:** [ai-whisperers.github.io/folyo](https://ai-whisperers.github.io/folyo/)

---

## 🎯 What is Folyo?

**Folyo** transforms your professional CV into a beautiful, interactive webpage. No coding required - just edit a YAML file and deploy.

Perfect for:
- 👩‍💻 Developers showcasing their portfolio
- 🎓 Students entering the job market
- 💼 Professionals building their personal brand
- 🚀 Anyone who wants to stand out

---

## ✨ Features

- 📱 **Responsive Design** - Looks great on any device
- 🎨 **Multiple Themes** - Choose from 7 color schemes
- ⚡ **Fast Setup** - Deploy in under 5 minutes
- 🔄 **Easy Updates** - Just edit one YAML file
- 🆓 **Free Hosting** - GitHub Pages included
- 📄 **PDF Download** - Link your traditional CV

---

## 🚀 Quick Start

### 1. Fork this repo
Click "Use this template" or fork to your account

### 2. Edit your data
Update `_data/data.yml` with your information:

```yaml
sidebar:
  name: Your Name
  tagline: Your Professional Title
  email: you@example.com
  linkedin: your-linkedin
  github: your-github
```

### 3. Deploy
Enable GitHub Pages in Settings → Pages → Source: main branch

Your CV will be live at: `https://yourusername.github.io/folyo/`

---

## 🎨 Available Themes

Change `theme_skin` in `_data/data.yml`:

| Theme | Preview |
|-------|---------|
| `blue` | Professional blue |
| `turquoise` | Fresh teal |
| `green` | Nature green |
| `berry` | Bold magenta |
| `orange` | Warm orange |
| `ceramic` | Earthy brown |
| `teal` | Classic teal |

---

## 📁 Project Structure

```
folyo/
├── _data/
│   └── data.yml      # ← YOUR CV DATA GOES HERE
├── _config.yml       # Site configuration
├── assets/
│   └── images/       # Profile picture & PDF
├── _includes/        # HTML components
├── _layouts/         # Page templates
└── _sass/            # Stylesheets
```

---

## 🛠️ Local Development

```bash
# Install dependencies
bundle install

# Run locally
bundle exec jekyll serve

# Open http://localhost:4000/folyo/
```

---

## 📝 Sections Available

- ✅ Career Profile
- ✅ Education
- ✅ Experience
- ✅ Projects
- ✅ Skills & Proficiency
- ✅ Certifications
- ✅ Languages
- ✅ Interests
- ✅ Volunteer Work

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

Based on [online-cv](https://github.com/sharu725/online-cv) by Sharath Kumar.  
MIT License - feel free to use for your personal CV!

---

## 🏢 Part of AI Whisperers

This project is maintained by [AI Whisperers](https://github.com/Ai-Whisperers) as part of the FPUNA 2026 course materials.

**Course:** Marketing Personal con IA - Track 04

---

*Transform your career with Folyo* ✨

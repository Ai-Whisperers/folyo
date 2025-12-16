# Quick Reference Guide - LinkedIn Post Generator

## 🚀 Quick Start (5 Minutes)

### 1. Access n8n
```
http://localhost:5678
```

### 2. Import Workflow
1. Click **Workflows** → **Import from File**
2. Select: `linkedin-post-generator-workflow.json`

### 3. Get API Keys

**Google Gemini API:**
- Go to: https://makersuite.google.com/app/apikey
- Click **Create API Key**
- Copy the key

**LinkedIn OAuth:**
- Go to: https://www.linkedin.com/developers/apps
- Create new app
- Copy Client ID and Client Secret
- Add redirect URL: `http://localhost:5678/rest/oauth2-credential/callback`
- Request "Share on LinkedIn" product access

### 4. Configure Nodes

| Node | What to Configure |
|------|------------------|
| **Receive Post Title** | ✅ Already configured |
| **Google Gemini Chat Model** | ➕ Add API key credential |
| **Format AI Output** | ✅ Already configured |
| **Generate AI Content** | ✅ Verify connections to Gemini & Output Parser |
| **Post to LinkedIn** | ➕ Add OAuth2 credentials |
| **Show Confirmation** | ✅ Already configured |

### 5. Activate & Test
1. Toggle **Inactive** → **Active**
2. Copy the form URL from "Receive Post Title" node
3. Open form in browser
4. Submit test post title
5. Check LinkedIn profile for new post

---

## 📋 Configuration Checklist

```
□ n8n running at http://localhost:5678
□ Workflow imported
□ Google Gemini API key obtained
□ Gemini credentials added to n8n
□ LinkedIn app created
□ LinkedIn OAuth credentials added
□ LinkedIn connection authorized
□ Workflow activated
□ Test post successful
□ Post appeared on LinkedIn
```

---

## 🔑 Credentials Quick Setup

### Google Gemini
1. In "Google Gemini Chat Model" node
2. Click credential dropdown → **Create New**
3. Name: "Google Gemini API"
4. Paste API key
5. Save

### LinkedIn OAuth2
1. In "Post to LinkedIn" node
2. Click credential dropdown → **Create New**
3. Select "LinkedIn OAuth2 API"
4. Enter Client ID
5. Enter Client Secret
6. Click **Sign in with LinkedIn**
7. Authorize the app

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| **n8n Dashboard** | http://localhost:5678 |
| **Form URL** | http://localhost:5678/form/generate-linkedin-post |
| **Google Gemini API** | https://makersuite.google.com/app/apikey |
| **LinkedIn Developers** | https://www.linkedin.com/developers/apps |
| **n8n Docs** | https://docs.n8n.io |

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **Form not loading** | Check workflow is Active |
| **Gemini API error** | Verify API key and quota |
| **LinkedIn auth failed** | Check Client ID/Secret and redirect URL |
| **Post is empty** | Verify Gemini model connection |
| **Post too long** | Reduce maxTokens to 800 |

---

## 🐳 Docker Commands

```bash
# Check if n8n is running
docker ps | grep n8n

# View logs
docker logs n8n -f

# Restart n8n
docker restart n8n

# Stop n8n
docker stop n8n

# Start n8n
docker start n8n
```

---

## ⚙️ Node Configuration Summary

### 1️⃣ Receive Post Title
- **Type:** Form Trigger
- **Config:** ✅ Pre-configured
- **Action:** None needed

### 2️⃣ Google Gemini Chat Model
- **Type:** AI Model
- **Config:** ➕ **Add credential**
- **Required:** API Key from Google

### 3️⃣ Format AI Output
- **Type:** Output Parser
- **Config:** ✅ Pre-configured
- **Action:** None needed

### 4️⃣ Generate AI Content
- **Type:** AI Agent
- **Config:** ✅ Pre-configured
- **Action:** Verify connections

### 5️⃣ Post to LinkedIn
- **Type:** LinkedIn Integration
- **Config:** ➕ **Add OAuth credential**
- **Required:** Client ID + Secret from LinkedIn

### 6️⃣ Show Confirmation
- **Type:** Webhook Response
- **Config:** ✅ Pre-configured
- **Action:** None needed

---

## 📊 Workflow Flow

```
User fills form
    ↓
Receive Post Title (Form Trigger)
    ↓
Generate AI Content (AI Agent)
    ↓ (uses)
Google Gemini Chat Model
    ↓ (uses)
Format AI Output (Parser)
    ↓
Post to LinkedIn
    ↓
Show Confirmation
```

---

## 🎯 Testing Checklist

```
1. □ Open form URL
2. □ Enter test title (e.g., "AI in 2025")
3. □ Click Submit
4. □ Wait 10-15 seconds
5. □ See confirmation page
6. □ Check LinkedIn profile
7. □ Verify post content
8. □ Delete test post if needed
```

---

## 🔧 Common Customizations

### Change AI Model
In **Google Gemini Chat Model**:
- Default: `gemini-pro`
- Faster: `gemini-1.5-flash`
- Advanced: `gemini-1.5-pro`

### Adjust Creativity
In **Google Gemini Chat Model** → Options:
- More creative: Temperature = `0.8` or `0.9`
- More consistent: Temperature = `0.5` or `0.6`

### Post Length
In **Google Gemini Chat Model** → Options:
- Shorter posts: Max Tokens = `500`
- Longer posts: Max Tokens = `1500` or `2000`

### Post Visibility
In **Post to LinkedIn** → Additional Fields:
- `PUBLIC` - Everyone
- `CONNECTIONS` - Connections only
- `LOGGED_IN` - All LinkedIn members

---

## 📱 How to Use (End User)

1. Open the form URL
2. Enter your post topic/title
3. Click Submit
4. Wait 10-15 seconds
5. See the generated post
6. Post is automatically published to LinkedIn
7. Click "Create Another Post" to make more

---

## 💡 Pro Tips

1. **Save the form URL** as a bookmark for quick access
2. **Test with different prompts** to see what works best
3. **Adjust temperature** based on your industry
4. **Monitor API costs** in Google Cloud Console
5. **Back up your workflow** regularly (Export as JSON)

---

## 📞 Support

**Full Guide:** See `N8N_WORKFLOW_CONFIGURATION_GUIDE.md`

**Issues?**
1. Check n8n executions tab for errors
2. Review docker logs: `docker logs n8n`
3. Visit https://community.n8n.io

---

## ✅ You're Ready!

Once you've completed the checklist above, your workflow is ready to:
- ✨ Generate AI-powered LinkedIn posts
- 🚀 Automatically publish to your profile
- 📝 Create professional content in seconds

**Form URL to share:**
```
http://localhost:5678/form/generate-linkedin-post
```

Happy posting! 🎉

# LinkedIn AI Automation - Quick Reference Card

## 🚀 One-Page Setup Guide

### 1️⃣ Get Your API Keys (15 min)

**Google Gemini:**
- Go to: https://makersuite.google.com/app/apikey
- Click "Get API Key"
- Copy and save the key

**LinkedIn:**
- Go to: https://www.linkedin.com/developers/apps
- Create new app
- Request "Share on LinkedIn" access
- Copy Client ID & Client Secret

### 2️⃣ Setup n8n (10 min)

**Cloud:** Sign up at n8n.io

**Self-hosted:**
```bash
npm install n8n -g
n8n start
```
Access at: http://localhost:5678

### 3️⃣ Add Credentials to n8n (5 min)

1. Go to Settings → Credentials
2. Add "Google API" credential (paste Gemini key)
3. Add "LinkedIn OAuth2" credential (paste Client ID & Secret)
4. Connect and authorize LinkedIn

### 4️⃣ Import Workflow (2 min)

1. In n8n, click "Import from File"
2. Select `workflow-template.json`
3. Update credentials in each node
4. Save workflow

### 5️⃣ Test It (5 min)

1. Activate workflow
2. Open `test-script.html` in browser
3. Enter your webhook URL
4. Test with a post title
5. Check LinkedIn for the post

---

## 📋 Workflow Nodes Quick Reference

| Node | Purpose | Configuration |
|------|---------|---------------|
| **Webhook** | Receive post title | Path: `/linkedin-post` |
| **AI Agent** | Generate content | Connect sub-nodes |
| **Gemini Model** | AI brain | Model: gemini-pro, Temp: 0.7 |
| **Memory** | Context retention | Session ID: custom |
| **Output Parser** | Format output | JSON structure |
| **LinkedIn** | Post content | Resource: Post, Operation: Create |
| **Respond** | Confirmation | Message with post content |

---

## 🔗 Essential URLs

| Service | URL |
|---------|-----|
| n8n Cloud | https://n8n.io |
| Google AI Studio | https://makersuite.google.com/app/apikey |
| LinkedIn Developers | https://www.linkedin.com/developers/apps |
| n8n Docs | https://docs.n8n.io/ |
| n8n Community | https://community.n8n.io/ |

---

## 💡 Best AI Prompts (Copy & Paste)

### Professional Post
```
You are a LinkedIn content expert. Create an engaging LinkedIn post based on this title: {{$json.postTitle}}

Requirements:
- Professional yet conversational tone
- 150-200 words
- Include relevant hashtags (3-5)
- Add a call-to-action
- Use line breaks for readability
```

### Storytelling Post
```
Create a compelling LinkedIn story based on this topic: {{$json.postTitle}}

Format:
- Start with a hook
- Build narrative with 2-3 key points
- End with a lesson
- 3-5 hashtags
- 200-250 words
```

### List Post
```
Create a LinkedIn list post about: {{$json.postTitle}}

Structure:
- Engaging opening
- 5-7 numbered actionable points
- Conclude with a question
- 3-5 hashtags
- 150-200 words
```

---

## ⚙️ Configuration Values

### Gemini Settings
```
Model: gemini-pro (or gemini-1.5-pro)
Temperature: 0.7
Max Tokens: 500
```

### LinkedIn Settings
```
Resource: Post
Operation: Create
Post As: Person
Visibility: Public
Text: {{$json.output}}
```

### Webhook Settings
```
Method: POST
Path: linkedin-post
Response Mode: Last Node
Response Code: 200
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| LinkedIn auth fails | Check redirect URL in app settings |
| AI not generating | Verify Gemini API key & quota |
| Webhook not working | Ensure workflow is ACTIVE |
| Post not on LinkedIn | Check API permissions & credentials |
| Slow generation | Normal, AI takes 5-10 seconds |

---

## 📊 File Structure

```
📦 Your Project
├── 📄 README.md                     ← Start here
├── 📄 LinkedIn-AI-Automation-Guide.md  ← Full guide
├── 📄 AI-Prompts-Library.md         ← 20+ prompts
├── 📄 Quick-Start-Checklist.md      ← Setup checklist
├── 📄 QUICK-REFERENCE.md            ← This file
├── 📄 workflow-template.json        ← Import to n8n
└── 📄 test-script.html              ← Testing interface
```

---

## 🎯 Testing Commands

### Test Webhook with cURL
```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"postTitle": "The Future of AI in Business"}'
```

### Test Gemini API
```bash
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

---

## 🔒 Security Checklist

- [ ] API keys stored in n8n credentials only
- [ ] No credentials in code or screenshots
- [ ] HTTPS for production webhooks
- [ ] Webhook authentication enabled (optional)
- [ ] Regular credential rotation scheduled

---

## 📈 Expected Results

**Time Investment:**
- Initial Setup: 1-2 hours
- Per Post: < 1 minute (vs 15-20 min manual)

**Performance:**
- Generation Time: 5-10 seconds
- Success Rate: 95%+
- Cost per Post: $0.001-0.01

**Benefits:**
- Consistent posting schedule
- Professional content quality
- Time savings: 90%+
- Scalable to multiple platforms

---

## 🎓 Learning Path

1. **Day 1:** Complete basic setup, test workflow
2. **Week 1:** Generate 5-10 posts, refine prompts
3. **Week 2:** Customize for your brand voice
4. **Month 1:** Add scheduling or multi-platform
5. **Quarter 1:** Analyze ROI, scale up

---

## 💬 Common Questions

**Q: Can I edit posts before publishing?**
A: Yes! Add a "Manual" node or approval step in the workflow.

**Q: How much does it cost?**
A: Gemini API: ~$0.001/post. LinkedIn API: Free. n8n: Free or $20/month for cloud.

**Q: Can I schedule posts?**
A: Yes! Replace webhook with Schedule Trigger node.

**Q: Can I post to company pages?**
A: Yes! Change LinkedIn node setting from "Person" to "Organization".

**Q: Is it against LinkedIn's terms?**
A: Using the official API is compliant. Avoid spam and follow their usage policies.

---

## 🚨 Emergency Contacts

**If something breaks:**

1. Check n8n execution log
2. Verify all credentials are valid
3. Test each node individually
4. Check API status pages:
   - n8n: https://n8n.statuspage.io/
   - Google Cloud: https://status.cloud.google.com/
   - LinkedIn: https://www.linkedin-apistatus.com/

5. Ask for help:
   - n8n Community: https://community.n8n.io/
   - Your documentation: Read the full guide

---

## ✅ Success Metrics to Track

- [ ] Number of posts per week
- [ ] Time saved vs manual posting
- [ ] LinkedIn engagement rate
- [ ] Content quality score (self-rated)
- [ ] Automation success rate

---

## 🎉 You're Ready!

### Next Steps:
1. ✅ Import workflow to n8n
2. ✅ Configure all credentials
3. ✅ Test with sample post
4. ✅ Verify on LinkedIn
5. ✅ Start automating!

---

## 📞 Need More Help?

- **Detailed Setup:** Read `LinkedIn-AI-Automation-Guide.md`
- **Better Prompts:** Check `AI-Prompts-Library.md`
- **Track Progress:** Use `Quick-Start-Checklist.md`
- **Test Interface:** Open `test-script.html`

---

**🌟 Pro Tips:**

1. Start with 1-2 posts per week
2. Review AI content before auto-posting (at first)
3. Customize prompts for your industry
4. Monitor engagement and iterate
5. Add your personal touch to AI content

---

*Print this page for easy reference during setup!*

**Happy Automating! 🚀**

---

Last Updated: October 24, 2025



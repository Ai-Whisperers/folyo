# LinkedIn Post Generator - OpenAI & Claude Setup Guide

## 🎯 Choose Your AI Model

I've created **two workflow versions** for you:

| AI Model | File | Best For | Cost |
|----------|------|----------|------|
| **OpenAI (GPT-4)** | `linkedin-workflow-openai.json` | Creative, versatile posts | ~$0.01 per post |
| **Claude (Anthropic)** | `linkedin-workflow-claude.json` | Professional, detailed posts | ~$0.003 per post |

**Choose based on:**
- Which API you already have access to
- Your budget (Claude is ~3x cheaper)
- Your content style preference

---

## 📥 Option 1: Setup with OpenAI (GPT-4)

### Step 1: Get OpenAI API Key (2 minutes)

1. Go to: https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click **Create new secret key**
4. Name it: "n8n LinkedIn Poster"
5. Copy the API key (starts with `sk-...`)
6. **Save it securely** - you can't see it again!

**Pricing:**
- GPT-4o-mini: ~$0.15 per 1M input tokens (~$0.01 per post)
- GPT-4o: ~$2.50 per 1M input tokens (~$0.10 per post)
- GPT-3.5-turbo: ~$0.50 per 1M input tokens (~$0.005 per post)

**Set up billing:**
1. Go to: https://platform.openai.com/account/billing
2. Add payment method
3. Add credits (minimum $5)

### Step 2: Import OpenAI Workflow

1. Open n8n: http://localhost:5678
2. Click **Workflows** → **Add Workflow**
3. Click **⋮** menu → **Import from File**
4. Select: `linkedin-workflow-openai.json`
5. Click **Open**

### Step 3: Configure OpenAI Credentials in n8n

1. In the workflow, click on **"Generate with OpenAI"** node
2. Under **Credential to connect with**, click dropdown
3. Click **Create New Credential**
4. Select **"OpenAI API"**
5. Fill in:
   - **Credential Name:** "OpenAI API"
   - **API Key:** [Paste your sk-... key]
6. Click **Save**

### Step 4: Configure LinkedIn (same for both)

1. Go to: https://www.linkedin.com/developers/apps
2. Create new app (see full instructions below)
3. Get Client ID and Client Secret
4. In n8n workflow, click **"Post to LinkedIn"** node
5. Create LinkedIn OAuth2 credential
6. Authorize the app

### Step 5: Activate & Test

1. Click **Inactive** toggle → **Active**
2. Click **"Receive Post Title"** node
3. Copy the Production URL
4. Open in browser and test!

---

## 📥 Option 2: Setup with Claude (Anthropic)

### Step 1: Get Claude API Key (2 minutes)

1. Go to: https://console.anthropic.com/
2. Sign in or create an account
3. Go to **API Keys** section
4. Click **Create Key**
5. Name it: "n8n LinkedIn Poster"
6. Copy the API key (starts with `sk-ant-...`)
7. **Save it securely** - you can't see it again!

**Pricing:**
- Claude 3.5 Sonnet: ~$3 per 1M input tokens (~$0.003 per post)
- Claude 3 Opus: ~$15 per 1M input tokens (~$0.015 per post)
- Claude 3 Haiku: ~$0.25 per 1M tokens (~$0.0003 per post)

**Set up billing:**
1. Go to: https://console.anthropic.com/settings/billing
2. Add payment method
3. Add credits (minimum $5)

### Step 2: Import Claude Workflow

1. Open n8n: http://localhost:5678
2. Click **Workflows** → **Add Workflow**
3. Click **⋮** menu → **Import from File**
4. Select: `linkedin-workflow-claude.json`
5. Click **Open**

### Step 3: Configure Claude Credentials in n8n

1. In the workflow, click on **"Generate with Claude"** node
2. Under **Credential to connect with**, click dropdown
3. Click **Create New Credential**
4. Select **"Anthropic API"** (or **"HTTP Header Auth"** if Anthropic API not available)

**If using "Anthropic API":**
- **Credential Name:** "Claude (Anthropic) API"
- **API Key:** [Paste your sk-ant-... key]
- Click **Save**

**If using "HTTP Header Auth":**
- **Credential Name:** "Claude API Header"
- **Name:** `x-api-key`
- **Value:** [Paste your sk-ant-... key]
- Click **Save**

### Step 4: Configure LinkedIn (same as OpenAI)

Follow Step 4 from OpenAI section above.

### Step 5: Activate & Test

1. Click **Inactive** toggle → **Active**
2. Click **"Receive Post Title"** node
3. Copy the Production URL
4. Open in browser and test!

---

## 🔗 LinkedIn OAuth Setup (Required for Both)

This is the same for both OpenAI and Claude workflows.

### Create LinkedIn App

1. **Go to:** https://www.linkedin.com/developers/apps
2. **Click:** "Create app"
3. **Fill in:**
   - **App name:** "n8n LinkedIn Automation"
   - **LinkedIn Page:** Select your page (create one if needed)
   - **Privacy policy URL:** `https://n8n.io/privacy`
   - **App logo:** Upload any image (optional)
   - Check legal agreement
4. **Click:** "Create app"

### Get OAuth Credentials

1. Go to **"Auth"** tab
2. Under **OAuth 2.0 settings:**
   - Copy **Client ID**
   - Copy **Client Secret**
3. Click **Edit** next to **Redirect URLs**
4. Add: `http://localhost:5678/rest/oauth2-credential/callback`
5. Click **Update**

### Request API Products

1. Go to **"Products"** tab
2. Request access for:
   - ✅ **Share on LinkedIn** (required)
   - ✅ **Sign In with LinkedIn using OpenID Connect** (required)
3. Usually approved instantly

### Add to n8n

1. In your workflow, click **"Post to LinkedIn"** node
2. Under **Credential to connect with**, click dropdown
3. Click **Create New Credential**
4. Select **"LinkedIn OAuth2 API"**
5. Fill in:
   - **Credential Name:** "LinkedIn account"
   - **Client ID:** [Paste from LinkedIn]
   - **Client Secret:** [Paste from LinkedIn]
6. Click **Connect my account**
7. Authorize in popup
8. Click **Save**

---

## 🎨 Customizing Post Style

### For OpenAI Workflow

Edit the **"Generate with OpenAI"** node → Messages:

**Professional & Data-Driven:**
```
Create a data-driven LinkedIn post about: {{ $json['formField:Post Title or Topic'] }}

Include statistics, trends, and actionable insights.
Use a professional, authoritative tone.
```

**Casual & Engaging:**
```
Create a casual, conversational LinkedIn post about: {{ $json['formField:Post Title or Topic'] }}

Make it relatable and engaging.
Use storytelling and personal anecdotes.
```

**Technical & Educational:**
```
Create a technical educational post about: {{ $json['formField:Post Title or Topic'] }}

Explain concepts clearly with examples.
Include code snippets or technical details if relevant.
```

### For Claude Workflow

Edit the **"Generate with Claude"** node → JSON Body:

Change the content within the JSON:

```json
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": "Your custom prompt here..."
    }
  ]
}
```

---

## ⚙️ Advanced Configuration

### Change OpenAI Model

In **"Generate with OpenAI"** node:
- **modelId:**
  - `gpt-4o-mini` (default, best value)
  - `gpt-4o` (most capable, expensive)
  - `gpt-3.5-turbo` (faster, cheaper)

### Change Claude Model

In **"Generate with Claude"** node → JSON Body:
- **model:**
  - `claude-3-5-sonnet-20241022` (default, best balance)
  - `claude-3-opus-20240229` (most capable)
  - `claude-3-haiku-20240307` (fastest, cheapest)

### Adjust Creativity

**OpenAI:**
- In **Options** → **Temperature**: `0.7` (default)
  - Lower (0.3-0.5): More consistent, predictable
  - Higher (0.8-0.9): More creative, varied

**Claude:**
- Add to JSON body:
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 1024,
  "temperature": 0.7,
  "messages": [...]
}
```

### Adjust Post Length

**OpenAI:**
- **Options** → **Max Tokens:**
  - Short posts: 500
  - Medium: 800 (default)
  - Long: 1500

**Claude:**
- Change `max_tokens` in JSON body:
  - Short: 512
  - Medium: 1024 (default)
  - Long: 2048

---

## 💰 Cost Comparison

**For 100 LinkedIn posts per month:**

| Model | Cost per Post | Monthly Cost | Quality |
|-------|---------------|--------------|---------|
| GPT-4o-mini | ~$0.01 | ~$1 | ⭐⭐⭐⭐ |
| GPT-4o | ~$0.10 | ~$10 | ⭐⭐⭐⭐⭐ |
| GPT-3.5-turbo | ~$0.005 | ~$0.50 | ⭐⭐⭐ |
| Claude 3.5 Sonnet | ~$0.003 | ~$0.30 | ⭐⭐⭐⭐⭐ |
| Claude 3 Haiku | ~$0.0003 | ~$0.03 | ⭐⭐⭐ |

**Recommendation:**
- **Best Value:** Claude 3.5 Sonnet or GPT-4o-mini
- **Best Quality:** GPT-4o or Claude 3.5 Sonnet
- **Budget Option:** Claude 3 Haiku or GPT-3.5-turbo

---

## 🧪 Testing Your Workflow

### Test Checklist

```
□ API credentials configured
□ LinkedIn OAuth configured
□ Workflow activated (no errors)
□ Form URL copied
□ Form opens in browser
□ Submit test title: "The Future of Remote Work"
□ Wait 5-10 seconds
□ Confirmation page appears
□ Post visible on LinkedIn
□ Post quality is good
□ Delete test post (optional)
```

### Example Test Topics

Try these to test post quality:

1. "5 Tips for Better Productivity"
2. "Why AI is Changing Marketing"
3. "Lessons from My First Year as a CEO"
4. "The Future of Remote Work in 2025"
5. "How to Build a Personal Brand on LinkedIn"

---

## 🐛 Troubleshooting

### OpenAI Errors

**Error: "Invalid API Key"**
- Solution: Check your API key starts with `sk-`
- Verify you copied the full key
- Try creating a new key

**Error: "Insufficient Quota"**
- Solution: Add credits at https://platform.openai.com/account/billing
- Minimum $5 required

**Error: "Model not found"**
- Solution: Make sure you have access to the model
- Try `gpt-3.5-turbo` instead of `gpt-4o`

### Claude Errors

**Error: "Authentication failed"**
- Solution: Check your API key starts with `sk-ant-`
- Verify credentials type is correct (Anthropic API or HTTP Header Auth)

**Error: "Overloaded_error"**
- Solution: Claude is temporarily busy
- Wait a few seconds and try again
- This is usually very brief

**Error: "Invalid request"**
- Solution: Check the JSON body is properly formatted
- Make sure max_tokens is set

### LinkedIn Errors

**Error: "Post failed to publish"**
- Solution: Check post isn't too long (3000 char limit)
- Verify LinkedIn credential is still valid
- Try re-authorizing LinkedIn connection

**Error: "OAuth redirect mismatch"**
- Solution: Verify redirect URL in LinkedIn app is exactly:
  `http://localhost:5678/rest/oauth2-credential/callback`

---

## 📊 Which AI Model Should I Choose?

### Choose **OpenAI** if:
- ✅ You already have OpenAI credits
- ✅ You want more model options (GPT-3.5, GPT-4, etc.)
- ✅ You prefer OpenAI's writing style
- ✅ You need faster response times
- ✅ You want to use DALL-E for images later

### Choose **Claude** if:
- ✅ You want the best value (cheaper)
- ✅ You prefer more detailed, nuanced writing
- ✅ You want longer context window
- ✅ You value Anthropic's ethical AI approach
- ✅ You need better reasoning for complex topics

**My Recommendation:**
Start with **Claude 3.5 Sonnet** - best quality-to-price ratio!

If Claude doesn't work or you prefer OpenAI, use **GPT-4o-mini** - excellent quality at low cost.

---

## 🚀 Quick Start Checklist

**For OpenAI:**
```
□ Get OpenAI API key from platform.openai.com
□ Add billing ($5 minimum)
□ Import linkedin-workflow-openai.json
□ Add OpenAI credential to n8n
□ Configure LinkedIn OAuth
□ Activate workflow
□ Test with sample topic
```

**For Claude:**
```
□ Get Claude API key from console.anthropic.com
□ Add billing ($5 minimum)
□ Import linkedin-workflow-claude.json
□ Add Anthropic credential to n8n
□ Configure LinkedIn OAuth
□ Activate workflow
□ Test with sample topic
```

---

## 📱 Your Form URLs

**OpenAI Version:**
```
http://localhost:5678/form/linkedin-openai-form
```

**Claude Version:**
```
http://localhost:5678/form/linkedin-claude-form
```

---

## 💡 Pro Tips

1. **Test both models** with the same topic to compare quality
2. **Monitor your API usage** to track costs
3. **Adjust temperature** to find your preferred creativity level
4. **Save good prompts** that work well for your industry
5. **Use shorter max_tokens** for punchier posts
6. **Bookmark your form URL** for quick access

---

## 🆚 Side-by-Side Comparison

| Feature | OpenAI | Claude |
|---------|--------|--------|
| **Setup Difficulty** | Easy | Easy |
| **Cost** | Medium | Low |
| **Post Quality** | Excellent | Excellent |
| **Response Speed** | Fast (1-3s) | Fast (2-5s) |
| **Max Post Length** | 4096 tokens | 4096 tokens |
| **Creativity** | High | Very High |
| **Context Understanding** | Excellent | Excellent |
| **Professional Tone** | Good | Excellent |
| **Technical Content** | Excellent | Excellent |
| **Storytelling** | Good | Excellent |

---

## ✅ You're Ready!

Choose your preferred AI model, follow the setup steps, and start creating amazing LinkedIn content!

**Need help?** Check the troubleshooting section or the main guides:
- `N8N_WORKFLOW_CONFIGURATION_GUIDE.md`
- `QUICK_REFERENCE.md`

Good luck! 🎉

# LinkedIn Post Generator with AI - n8n Workflow Setup Guide

## Overview
This n8n workflow automates LinkedIn post creation using Google Gemini AI. Users submit a post title through a form, and the workflow generates professional LinkedIn content and posts it automatically.

## Workflow Components

1. **Receive Post Title** - Form trigger to collect post ideas
2. **Generate AI Content** - AI Agent using Google Gemini to create content
3. **Google Gemini Chat Model** - Language model for content generation
4. **Format AI Output** - Structures the AI response
5. **Post to LinkedIn** - Publishes the content to LinkedIn
6. **Show Confirmation** - Displays success message

## Prerequisites

### 1. n8n Installation
You need n8n running locally or on a server. Choose one option:

**Option A: Local Installation (npm)**
```bash
npm install n8n -g
n8n start
```

**Option B: Docker**
```bash
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n
```

**Option C: Cloud (n8n.cloud)**
Sign up at https://n8n.cloud

### 2. Required API Credentials

#### Google Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Save it securely

#### LinkedIn OAuth2 Credentials
1. Go to https://www.linkedin.com/developers/apps
2. Create a new app
3. Add OAuth 2.0 credentials
4. Required scopes: `w_member_social`, `r_basicprofile`
5. Save Client ID and Client Secret

## Installation Steps

### Step 1: Import the Workflow

1. Open your n8n instance (default: http://localhost:5678)
2. Click **"Workflows"** in the left sidebar
3. Click **"Import from File"** or **"Import from URL"**
4. Select the file: `linkedin-post-generator-workflow.json`
5. Click **"Import"**

### Step 2: Configure Google Gemini Credentials

1. Click on the **"Google Gemini Chat Model"** node
2. Click **"Create New Credential"**
3. Enter your Google Gemini API Key
4. Click **"Save"**

### Step 3: Configure LinkedIn Credentials

1. Click on the **"Post to LinkedIn"** node
2. Click **"Create New Credential"**
3. Select **"LinkedIn OAuth2 API"**
4. Enter your LinkedIn App credentials:
   - Client ID
   - Client Secret
5. Click **"Connect my account"**
6. Authorize the app in the popup window
7. Click **"Save"**

### Step 4: Activate the Workflow

1. Click the **"Active"** toggle in the top right corner
2. The workflow is now live!

## Usage

### Accessing the Form

1. Click on the **"Receive Post Title"** node
2. Copy the **Production Webhook URL**
3. Open the URL in your browser
4. Fill in the form with your post title
5. Click **"Submit"**
6. Wait for the AI to generate and post the content
7. View the confirmation page

### Testing the Workflow

1. Click the **"Test workflow"** button
2. Click on **"Receive Post Title"** node
3. Click **"Listen for Test Event"**
4. Open the test URL and submit a title
5. Watch the workflow execute step-by-step

## Customization Options

### Modify AI Prompt

Edit the **"Generate AI Content"** node to customize the AI behavior:

```javascript
You are a professional LinkedIn content creator. Based on the following post title, create an engaging LinkedIn post with:

1. A compelling hook in the first line
2. Well-structured body content with insights
3. Relevant hashtags
4. A call-to-action at the end

Post Title: {{ $json.postTitle }}
```

### Add Memory (Optional)

To add conversation memory:
1. Add a **"Memory"** node (Window Buffer Memory or similar)
2. Connect it to the AI Agent node's memory input

### Add PDF Parser (Optional)

To enable PDF processing:
1. Add **"PDF Parser"** tool node
2. Connect it to the AI Agent's tools input
3. Update the form to accept PDF uploads

### Change LinkedIn Visibility

In the **"Post to LinkedIn"** node, modify the visibility:
- `PUBLIC` - Anyone can see
- `CONNECTIONS` - Only connections
- `LOGGED_IN` - All LinkedIn members

### Add Additional Form Fields

Edit the **"Receive Post Title"** node to add more fields:

```json
{
  "fieldLabel": "Target Audience",
  "fieldType": "dropdown",
  "requiredField": false,
  "fieldId": "audience",
  "fieldOptions": {
    "values": [
      {"option": "Developers"},
      {"option": "Business Leaders"},
      {"option": "General Professional"}
    ]
  }
}
```

## Troubleshooting

### Issue: "Workflow could not be activated"
- **Solution**: Check that all credentials are properly configured

### Issue: "Google Gemini API Error"
- **Solution**: Verify your API key is valid and has not exceeded quota
- Check billing is enabled for your Google Cloud project

### Issue: "LinkedIn post failed"
- **Solution**:
  - Verify LinkedIn credentials are connected
  - Check that your LinkedIn app has the required scopes
  - Ensure the post content is not empty

### Issue: "Form not loading"
- **Solution**:
  - Ensure workflow is activated
  - Check that n8n is running and accessible
  - Verify webhook URL is correct

## Advanced Features

### Add Error Handling

1. Add an **"Error Trigger"** node
2. Configure it to catch errors from specific nodes
3. Add a notification node (Email, Slack, etc.) to alert you

### Add Post Scheduling

1. Add a **"Schedule Trigger"** node
2. Add a **"Google Sheets"** node to read queued posts
3. Connect it before the AI generation step

### Add Analytics

1. Add a **"Google Sheets"** or **"Database"** node after posting
2. Store post data: title, content, timestamp, post ID
3. Track performance metrics

## Workflow File Location

The workflow JSON file is located at:
```
C:\Users\kyrian\Documents\kiki\New folder\linkedin-post-generator-workflow.json
```

## Support and Resources

- **n8n Documentation**: https://docs.n8n.io
- **n8n Community**: https://community.n8n.io
- **Google Gemini Docs**: https://ai.google.dev/docs
- **LinkedIn API Docs**: https://learn.microsoft.com/en-us/linkedin/

## Version History

- **v1.0** (2025-10-23): Initial workflow creation
  - Form trigger for post title input
  - Google Gemini AI content generation
  - LinkedIn posting
  - Confirmation page

## License

This workflow is provided as-is for educational and professional use.

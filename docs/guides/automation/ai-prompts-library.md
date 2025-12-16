# AI Prompts Library for LinkedIn Content

This document contains various AI prompts you can use in your n8n workflow to generate different types of LinkedIn content.

---

## 🎯 Basic Prompts

### 1. Standard Professional Post
```
You are a LinkedIn content expert. Create an engaging LinkedIn post based on this title: {{$json.postTitle}}

Requirements:
- Professional yet conversational tone
- 150-200 words
- Include relevant hashtags (3-5)
- Add a call-to-action
- Use line breaks for readability
- Make it engaging and valuable to readers
```

### 2. Storytelling Format
```
Create a compelling LinkedIn story based on this topic: {{$json.postTitle}}

Format:
- Start with a hook (personal anecdote or surprising fact)
- Build the narrative with 2-3 key points
- End with a lesson or insight
- Add 3-5 relevant hashtags
- Keep it 200-250 words
- Use short paragraphs for mobile readability
```

### 3. List/Listicle Format
```
Create a LinkedIn list post about: {{$json.postTitle}}

Structure:
- Engaging opening line
- 5-7 numbered points with brief explanations
- Each point should be actionable
- Conclude with a question to drive engagement
- Add 3-5 hashtags
- Keep total length 150-200 words
```

---

## 🚀 Industry-Specific Prompts

### Tech Industry
```
You are a tech industry thought leader. Create a LinkedIn post about: {{$json.postTitle}}

Style:
- Technical but accessible
- Include current trends or innovations
- Use tech-relevant hashtags (#AI #MachineLearning #CloudComputing)
- Add practical insights or code snippets (if relevant)
- 180-220 words
- End with a thought-provoking question
```

### Marketing & Sales
```
Create a persuasive LinkedIn post for marketing professionals about: {{$json.postTitle}}

Requirements:
- Focus on ROI and results
- Include statistics or data points (can be general industry facts)
- Use action-oriented language
- Hashtags: #Marketing #DigitalMarketing #GrowthHacking
- 150-200 words
- Strong call-to-action
```

### Leadership & Management
```
Write an inspiring leadership post about: {{$json.postTitle}}

Tone:
- Inspirational yet practical
- Share leadership wisdom or experience
- Use inclusive language ("we", "our team")
- Hashtags: #Leadership #Management #TeamBuilding
- 180-250 words
- End with encouragement or reflection question
```

### Entrepreneurship
```
Create a motivational entrepreneur-focused post about: {{$json.postTitle}}

Elements:
- Start with a challenge or obstacle
- Share practical business insights
- Include a success principle or lesson
- Hashtags: #Entrepreneur #Startup #BusinessGrowth
- 200-250 words
- Encourage engagement with a question about their journey
```

---

## 💡 Content Type Prompts

### Educational/How-To
```
Create an educational LinkedIn post teaching about: {{$json.postTitle}}

Format:
- Clear, step-by-step approach
- Break down complex topics simply
- Use bullet points or numbers
- Include "Key Takeaway" section
- Hashtags: #Learning #ProfessionalDevelopment #Education
- 200-250 words
```

### Thought Leadership
```
Write a thought-provoking LinkedIn post that establishes authority on: {{$json.postTitle}}

Characteristics:
- Present a unique perspective or counterintuitive insight
- Support with logic and reasoning
- Challenge conventional thinking
- Use industry-specific hashtags
- 250-300 words
- End with invitation for discussion
```

### Personal Experience/Case Study
```
Transform this topic into a personal experience post: {{$json.postTitle}}

Structure:
- Situation: Set the context
- Challenge: What was the problem?
- Action: What did you do?
- Result: What was the outcome?
- Lesson: What did you learn?
- 3-5 hashtags
- 200-250 words
```

### News Commentary
```
Create a timely commentary post about: {{$json.postTitle}}

Requirements:
- Connect to recent industry news or trends
- Share your professional opinion
- Explain implications for your audience
- Remain professional and balanced
- Relevant hashtags for the topic
- 180-220 words
- Invite others to share their views
```

---

## 🎨 Tone Variations

### 1. Casual & Friendly
```
Write a friendly, approachable LinkedIn post about: {{$json.postTitle}}

Tone:
- Conversational, like talking to a colleague
- Use contractions and simple language
- Include emoji (2-3 maximum)
- Personal and relatable
- 150-180 words
- End with "What do you think?"
```

### 2. Formal & Academic
```
Create a formal, research-oriented post about: {{$json.postTitle}}

Style:
- Professional and scholarly
- Reference frameworks or methodologies
- Use industry terminology appropriately
- Data-driven and analytical
- No emoji
- 220-280 words
- Cite general industry research if relevant
```

### 3. Motivational & Inspirational
```
Write an inspiring, uplifting post about: {{$json.postTitle}}

Elements:
- Positive and encouraging language
- Focus on possibilities and growth
- Use power words (achieve, transform, breakthrough)
- Include a motivational quote if relevant
- 2-3 inspirational hashtags
- 180-220 words
```

---

## 🎯 Engagement-Focused Prompts

### High Engagement Post
```
Create a highly engaging LinkedIn post about: {{$json.postTitle}}

Optimization for engagement:
- Start with a bold statement or question
- Use pattern interrupts (surprising facts, contrarian views)
- Include a clear call-to-action
- Ask for comments, shares, or opinions
- Use 2-3 line breaks for readability
- Add "Double tap if you agree" or similar
- 150-200 words
- Strategic hashtags (mix popular + niche)
```

### Poll-Style Post
```
Create a poll-style discussion post about: {{$json.postTitle}}

Format:
- Present 2-3 perspectives on the topic
- Ask audience to vote in comments (A, B, or C)
- Explain why it's an interesting question
- No bias - present all options fairly
- Encourage debate in comments
- 150-180 words
- Hashtags that attract discussion
```

### Question Post
```
Create an engagement-driving question post about: {{$json.postTitle}}

Structure:
- Open with context (2-3 sentences)
- Pose a specific, thoughtful question
- Explain why this question matters
- Show you're genuinely interested in answers
- 100-150 words (short for more comments)
- End with: "Share your thoughts below 👇"
```

---

## 📊 Special Format Prompts

### Carousel Post (Multi-Slide)
```
Create content for a LinkedIn carousel about: {{$json.postTitle}}

Provide 5-7 slides:
Slide 1: Hook/title
Slide 2-6: Main points (one per slide)
Slide 7: Call-to-action

Each slide:
- Title (5-7 words)
- Body text (20-30 words)
- Keep it scannable

Post caption: 80-100 words introducing the carousel
Hashtags: 3-5 relevant tags
```

### Video Script
```
Write a script for a short LinkedIn video about: {{$json.postTitle}}

Script format:
- Hook (first 3 seconds)
- Main content (30-45 seconds)
- Call-to-action (last 5 seconds)
- Include visual cues [like this]
- Conversational, easy to speak

Post caption: 100-150 words complementing the video
```

### Document Post
```
Create a LinkedIn document post outline about: {{$json.postTitle}}

Provide:
1. Document title
2. 5-7 section headings
3. Key points under each section (2-3 bullets)
4. Conclusion

Post caption: 120-150 words teasing the document content
Make people want to click "See more"
Hashtags: 4-5 relevant tags
```

---

## 🔧 Dynamic Prompts (Using Variables)

### Personalized Post
```
Create a LinkedIn post about: {{$json.postTitle}}

Customize based on these details:
- Industry: {{$json.industry}}
- Target Audience: {{$json.audience}}
- Tone: {{$json.tone}}
- Word Count: {{$json.wordCount}}

Include relevant hashtags for the specified industry.
```

### Time-Sensitive Post
```
Create a LinkedIn post about: {{$json.postTitle}}

Context:
- Day of week: {{$json.dayOfWeek}}
- Time of day: {{$json.timeOfDay}}
- Current month: {{$json.month}}

Adjust tone and content timing references accordingly.
Examples:
- Monday: Motivational, week-starting energy
- Friday: Reflective, weekend-forward
- Morning: Fresh insights, daily tips
- Evening: Reflections, learnings
```

---

## 📈 Best Practices

### Writing Effective Prompts

1. **Be Specific**: The more details you provide, the better the output
2. **Set Constraints**: Word count, tone, format help focus the AI
3. **Include Examples**: Show the style you want
4. **Iterate**: Test and refine your prompts based on results

### Prompt Variables You Can Use

- `{{$json.postTitle}}` - The main topic
- `{{$json.industry}}` - Target industry
- `{{$json.tone}}` - Desired tone (casual, formal, etc.)
- `{{$json.audience}}` - Target audience
- `{{$json.wordCount}}` - Desired length
- `{{$json.keywords}}` - Keywords to include
- `{{$json.callToAction}}` - Specific CTA

### Testing Your Prompts

1. Test with various topics
2. Check for consistent quality
3. Verify hashtags are relevant
4. Ensure CTAs are clear
5. Monitor engagement on actual posts

---

## 🎓 Advanced Prompt Techniques

### Chain of Thought
```
Create a LinkedIn post about: {{$json.postTitle}}

Think step by step:
1. What's the key insight?
2. Who needs to hear this?
3. What action should they take?
4. How can I make this memorable?

Now write the post incorporating these elements.
150-200 words with 3-5 hashtags.
```

### Few-Shot Examples
```
Create a LinkedIn post like these examples:

Example 1: [paste example post]
Example 2: [paste example post]

Now create a similar post about: {{$json.postTitle}}

Match the style, structure, and tone of the examples.
```

### Negative Prompting
```
Create a LinkedIn post about: {{$json.postTitle}}

Include:
- Actionable insights
- Clear structure
- Relevant hashtags

Avoid:
- Overly salesy language
- Jargon without explanation
- Generic platitudes
- Emoji overuse

150-200 words.
```

---

## 💾 How to Use These Prompts

### In Your n8n Workflow:

1. **Copy the prompt** you want to use
2. **Open your n8n workflow**
3. **Click on the AI Agent node**
4. **Paste into the "Prompt" field**
5. **Save and test**

### Customization Tips:

- Mix and match sections from different prompts
- Adjust word counts based on your needs
- Add your brand voice guidelines
- Include specific hashtags your audience follows
- Test A/B variations to see what performs best

---

## 📚 Prompt Templates by Goal

| Goal | Recommended Prompt |
|------|-------------------|
| Maximum Engagement | High Engagement Post |
| Thought Leadership | Thought Leadership |
| Quick Daily Post | Standard Professional Post |
| Viral Potential | Storytelling Format or Poll-Style |
| Educational Content | Educational/How-To |
| Personal Branding | Personal Experience/Case Study |
| Industry Authority | Tech/Marketing/Leadership (specific) |
| Community Building | Question Post |

---

## 🔄 Updating Your Prompts

Remember to:
- ✅ Monitor post performance
- ✅ Refine prompts based on engagement data
- ✅ Stay current with LinkedIn best practices
- ✅ Test new formats and styles
- ✅ Keep your brand voice consistent

---

*Happy Content Creating! 🚀*



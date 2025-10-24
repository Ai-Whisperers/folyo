# CV Builder AI - Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)
3. **OpenAI API Key** (required for AI features)

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy the example environment file and configure it:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your actual values:

**Required:**
- `OPENAI_API_KEY`: Get from https://platform.openai.com/api-keys
- `NEXTAUTH_SECRET`: Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**Optional (defaults provided):**
- `MONGODB_URI`: MongoDB connection string (default: local MongoDB)
- `NEXTAUTH_URL`: Your app URL (default: http://localhost:3000)

### 3. Start MongoDB
If using local MongoDB:
```bash
mongod
```

### 4. Run the Application
```bash
npm run dev
```

This starts both the Next.js frontend (port 3000) and Express API server (port 5000).

## Features

### AI-Powered CV Builder
- **Conversational Interface**: Natural language conversation to gather CV information
- **AI Enhancement**: Automatically improves user responses for professional CVs
- **Job Description Analysis**: Tailors CV content based on target job requirements
- **ATS Optimization**: Ensures CV passes Applicant Tracking Systems
- **Multiple Alternatives**: Generates different versions of enhanced content

### User Management
- **Authentication**: NextAuth.js with email/password and OAuth providers
- **User Dashboard**: Manage multiple CVs and track progress
- **Session Management**: Secure user sessions with conversation state

### CV Generation
- **Real-time Preview**: See CV updates as you answer questions
- **Professional Templates**: Multiple CV layouts and themes
- **Export Options**: PDF download and sharing capabilities

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `GET /api/auth/session` - Current session

### Conversation Management
- `POST /api/conversations/start` - Start new CV conversation
- `GET /api/conversations/:sessionId` - Get conversation state  
- `POST /api/conversations/:sessionId/answer` - Submit answer
- `POST /api/conversations/:sessionId/next` - Move to next question
- `POST /api/conversations/:sessionId/complete` - Complete conversation

### AI Enhancement
- `POST /api/ai/enhance` - Enhance user content
- `POST /api/ai/alternatives` - Generate alternative versions
- `POST /api/ai/analyze-job` - Analyze job description
- `POST /api/ai/evaluate` - Evaluate CV content

### CV Management  
- `GET /api/cvs` - List user CVs
- `POST /api/cvs` - Create new CV
- `PUT /api/cvs/:id` - Update CV
- `DELETE /api/cvs/:id` - Delete CV

## Development

### File Structure
```
cv-builder/
├── app/                    # Next.js app directory
│   ├── ai-builder/        # AI conversation interface
│   ├── auth/              # Authentication pages  
│   ├── dashboard/         # User dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── AIConversationFlow.tsx
│   ├── CVPreview.tsx
│   └── ...
├── lib/                   # Utilities and services
│   ├── openai.js         # OpenAI integration
│   ├── mongodb.js        # Database connection
│   └── ...
├── models/               # Database models
│   ├── User.js
│   ├── CV.js
│   └── Conversation.js
├── server.js            # Express API server
└── package.json
```

### Adding New Features
1. **New CV Sections**: Extend the conversation schema in `models/Conversation.js`
2. **AI Prompts**: Modify enhancement prompts in `lib/openai.js`
3. **UI Components**: Add new React components in `components/`
4. **API Endpoints**: Create new routes in `server.js` or `app/api/`

## Troubleshooting

### Common Issues
1. **Missing OpenAI API Key**: Ensure `OPENAI_API_KEY` is set in `.env.local`
2. **MongoDB Connection**: Check MongoDB is running and connection string is correct
3. **Port Conflicts**: Ensure ports 3000 and 5000 are available
4. **Authentication Errors**: Verify `NEXTAUTH_SECRET` is set and NextAuth URL is correct

### Logs
- Check browser console for frontend errors
- Check terminal output for server errors  
- MongoDB logs for database issues

## Production Deployment

### Environment Variables
Set these in your production environment:
- `OPENAI_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production domain)
- `MONGODB_URI` (production database)

### Docker Deployment
```bash
docker build -t cv-builder .
docker run -p 3000:3000 -p 5000:5000 cv-builder
```

### Vercel Deployment  
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch
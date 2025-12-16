#!/bin/bash

# CV Builder Improvements Setup Script
# This script installs the new dependencies and sets up the image upload directory

echo "🚀 Setting up CV Builder improvements..."

# Install new dependencies
echo "📦 Installing new dependencies..."
npm install sharp@^0.33.0 puppeteer@^21.0.0

# Create upload directories
echo "📁 Creating upload directories..."
mkdir -p public/uploads/images
chmod 755 public/uploads/images

# Create .gitkeep files to ensure directories are tracked
touch public/uploads/.gitkeep
touch public/uploads/images/.gitkeep

# Update .gitignore to ignore uploaded files but keep structure
echo "📝 Updating .gitignore..."
if ! grep -q "public/uploads/images/*" .gitignore; then
    echo "" >> .gitignore
    echo "# Uploaded images (keep structure, ignore content)" >> .gitignore
    echo "public/uploads/images/*" >> .gitignore
    echo "!public/uploads/images/.gitkeep" >> .gitignore
fi

echo "✅ Setup complete!"
echo ""
echo "🎉 New features available:"
echo "   • Professional image upload for profile pictures"
echo "   • High-quality PDF export with Puppeteer"
echo "   • Enhanced print styles for better formatting"
echo "   • Optimized image processing with Sharp"
echo ""
echo "🔧 To start the development server:"
echo "   npm run dev"
echo ""
echo "📚 Don't forget to set up environment variables if using server-side PDF generation:"
echo "   NEXT_PUBLIC_APP_URL=http://localhost:3000"
